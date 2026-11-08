import type { HttpContext } from '@adonisjs/core/http'
import UserChecklist from '#models/user_checklist'
import { updateOrCreateUserChecklistValidator } from '#validators/user_checklist'
import {
  CollectionError,
  applyEntries,
  findChecklist,
  lockCollection,
  parseQuantityList,
  startCollection,
} from '#services/collection_progress_service'
import db from '@adonisjs/lucid/services/db'
import Card from '#models/card'

export default class UserChecklistsController {
  async show({ auth, params, response }: HttpContext) {
    const checklist = await findChecklist(params.id)
    if (!checklist) return response.notFound()
    const userChecklist = await UserChecklist.query()
      .preload('cards')
      .where('userId', auth.user!.id)
      .where('checklistId', checklist.id)
      .first()
    return response.api(userChecklist)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const checklist = await findChecklist(params.id)
    if (!checklist) return response.notFound()
    const cards = await Card.query()
      .where('checklist_id', checklist.id)
      .whereNull('variant')
      .orderBy('order')
      .select('id', 'number')
    const data = await request.validateUsing(updateOrCreateUserChecklistValidator)
    const cardNumbers = cards.map((card) => card.number as string)
    // Parse submitted fields before creating the collection so invalid input has no side effects.
    let submittedWanted: ReturnType<typeof parseQuantityList> | undefined
    let submittedHeld: ReturnType<typeof parseQuantityList> | undefined
    let submittedOffered: ReturnType<typeof parseQuantityList> | undefined
    try {
      submittedWanted =
        data.missingList === undefined
          ? undefined
          : parseQuantityList(data.missingList, cardNumbers)
      submittedHeld =
        data.collectedList === undefined
          ? undefined
          : parseQuantityList(data.collectedList, cardNumbers)
      submittedOffered =
        data.duplicatesList === undefined
          ? undefined
          : parseQuantityList(data.duplicatesList, cardNumbers)
    } catch (error) {
      if (error instanceof CollectionError)
        return response.status(error.status).json({ error: { message: error.message } })
      throw error
    }
    try {
      const collectionId = await db.transaction(async (trx) => {
        const created = await startCollection(trx, auth.user!.id, checklist.id)
        if (!created) throw new CollectionError(500, 'Could not start collection')
        const collection = await lockCollection(trx, auth.user!.id, checklist.id, created.version)
        const wanted = submittedWanted ?? parseQuantityList(collection.missingList, cardNumbers)
        const held = submittedHeld ?? parseQuantityList(collection.collectedList, cardNumbers)
        const offered =
          submittedOffered ?? parseQuantityList(collection.duplicatesList, cardNumbers)
        const existing = await trx
          .from('user_checklist_cards')
          .where('user_checklist_id', collection.id)
        const entries = cards.map((card) => {
          const prior = existing.find((item) => item.card_id === card.id)
          const offeredQuantity = offered.get(card.number) ?? 0
          const quantity =
            held.get(card.number) ??
            (offeredQuantity ? Math.max(prior?.quantity ?? 0, offeredQuantity + 1) : 0)
          return {
            cardId: card.id,
            quantity,
            offeredQuantity,
            wanted: wanted.has(card.number),
            wantedQuantity: wanted.get(card.number) ?? 0,
          }
        })
        await applyEntries(trx, collection, entries)
        return collection.id
      })
      const updated = await UserChecklist.query().preload('cards').where('id', collectionId).first()
      return response.json({ data: updated })
    } catch (error) {
      if (error instanceof CollectionError)
        return response.status(error.status).json({ error: { message: error.message } })
      throw error
    }
  }
}
