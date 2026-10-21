import type { HttpContext } from '@adonisjs/core/http'
import UserChecklist from '#models/user_checklist'
import {
  importUpdateChecklist,
  updateOrCreateUserChecklistValidator,
} from '#validators/user_checklist'
import Checklist from '#models/checklist'
import { inject } from '@adonisjs/core'
import { ChecklistService } from '#services/checklist_service'
import { Exception } from '@adonisjs/core/exceptions'

@inject()
export default class UserChecklistsController {
  constructor(protected checklistService: ChecklistService) {}
  async show({ auth, params, response }: HttpContext) {
    const checklist = await this.checklistService.get(params.id, {})
    const user = auth.user!
    const userChecklist = await UserChecklist.query()
      .preload('cards')
      .where('userId', user.id)
      .where('checklistId', checklist.id)
      .first()

    return response.api(userChecklist)
  }

  async update({ auth, params, request }: HttpContext) {
    const user = auth.user!
    const checklistId = params.id
    const checklist = await Checklist.query().where('id', checklistId).firstOrFail()
    await checklist.load('cards', (cards) => cards.whereNull('variant'))
    const cards = checklist.cards.map((_) => _.number)
    const data = await request.validateUsing(updateOrCreateUserChecklistValidator, {
      meta: {
        cards: cards,
      },
    })

    const progress = await UserChecklist.updateOrCreate(
      { userId: user.id, checklistId: checklistId },
      {
        missingList: data.missingList,
        duplicatesList: data.duplicatesList,
        collectedList: data.collectedList,
      }
    )

    await this.checklistService.reCalculate(checklistId)

    return progress
  }

  async import({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const checklistId = params.id
      const { file, treatEmptyAsMissing } = await request.validateUsing(importUpdateChecklist)

      const checklist = await this.checklistService.get(checklistId, {})
      const cards = await this.checklistService.import(user, checklist, file, treatEmptyAsMissing)

      return response.api(cards)
    } catch (error) {
      throw new Exception('Something went wrong', {})
    }
  }
}
