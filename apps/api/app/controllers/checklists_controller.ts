import Checklist from '#models/checklist'
import Card from '#models/card'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import XLSX from 'xlsx'
import { createChecklistValidator } from '#validators/checklist'
import ChecklistTransformer from '#transformers/checklist_transformer'
import { parseCardImportRows } from '#services/card_import_service'

export default class ChecklistsController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const categoryId = request.input('categoryId')
    const subcategoryId = request.input('subcategoryId')
    const limit = request.input('limit')

    const query = Checklist.query().preload('category').preload('subcategory')

    if (q) {
      query.where('name', 'like', `%${q}%`)
    }

    if (categoryId) {
      query.where('categoryId', categoryId)
    }

    if (subcategoryId) {
      query.where('subcategoryId', subcategoryId)
    }

    query.orderBy('createdAt', 'desc')

    if (limit) {
      query.limit(Number(limit))
    }

    return await query
  }

  async show({ params, auth, serialize }: HttpContext) {
    const isUserExist = !!auth.user
    return serialize(
      ChecklistTransformer.transform(
        await Checklist.query()
          .where('id', params.id)
          .preload('cards', (q) =>
            q.whereNull('variant').withCount('checklist').orderBy('order', 'asc')
          )
          .preload('category')
          .preload('subcategory')
          .if(isUserExist, (q) =>
            q.preload('userChecklist', (qq) => qq.where('userId', auth.user!.id))
          )
          .firstOrFail()
      )
    )
  }

  private async importCards(checklist: Checklist, file: any, trx: any) {
    if (!file || !file.isValid) return

    const workbook = XLSX.readFile(file.tmpPath!)
    const cardsSheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!cardsSheet) return

    const cardsData = XLSX.utils.sheet_to_json<Record<string, unknown>>(cardsSheet)
    if (cardsData.length === 0) return
    const cards = parseCardImportRows(cardsData)
    const baseRows = cards.filter((card) => !card.variant)
    const variantRows = cards.filter((card) => card.variant)

    await Card.query({ client: trx }).where('checklistId', checklist.id).delete()

    const bases = await Card.createMany(
      baseRows.map((card) => ({
        checklistId: checklist.id,
        number: card.number,
        name: card.name,
        type: card.type,
        section: card.section,
        variant: null,
        baseCardId: null,
        order: card.order,
      })),
      { client: trx }
    )
    const baseIds = new Map(bases.map((card) => [card.number, card.id]))

    await Card.createMany(
      variantRows.map((card) => ({
        checklistId: checklist.id,
        number: card.number,
        name: card.name,
        type: card.type,
        section: card.section,
        variant: card.variant,
        baseCardId: baseIds.get(card.baseNumber!)!,
        order: card.order,
      })),
      { client: trx }
    )

    checklist.totalCards = baseRows.length
    await checklist.save()
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createChecklistValidator)
    const file = request.file('file', {
      size: '10mb',
      extnames: ['xlsx', 'xls', 'zip'],
    })

    try {
      const checklist = await db.transaction(async (trx) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const _checklist = await Checklist.create(
          {
            ...data,
          },
          { client: trx }
        )

        if (file) {
          await this.importCards(_checklist, file, trx)
        }

        return _checklist
      })

      return response.status(201).json(checklist)
    } catch (err) {
      console.error('Submission error:', err)
      return response.internalServerError({
        error: 'Failed to publish checklist. Check file format.',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const result = await db.transaction(async (trx) => {
        const checklist = await Checklist.findOrFail(params.id, { client: trx })
        const data = request.only([
          'name',
          'year',
          'type',
          'totalCards',
          'categoryId',
          'subcategoryId',
        ])

        const file = request.file('file', {
          size: '10mb',
          extnames: ['xlsx', 'xls', 'zip'],
        })

        checklist.merge(data)
        await checklist.save()

        if (file) {
          await this.importCards(checklist, file, trx)
        }

        return checklist
      })
      return response.ok(result)
    } catch (err) {
      console.error('Update error:', err)
      return response.internalServerError({ error: 'Failed to update checklist.' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const checklist = await Checklist.findOrFail(params.id)
    await Card.query().where('checklistId', checklist.id).delete()
    await checklist.delete()
    return response.ok({ message: 'Checklist deleted successfully' })
  }
}
