import type { HttpContext } from '@adonisjs/core/http'
import UserChecklist from '#models/user_checklist'
import {
  importUpdateChecklist,
  updateOrCreateUserChecklistValidator,
} from '#validators/user_checklist'
import Checklist from '#models/checklist'
import { inject } from '@adonisjs/core'
import { ChecklistService } from '#services/checklist_service'
import xlsx from 'xlsx'

@inject()
export default class UserChecklistsController {
  constructor(protected checklistService: ChecklistService) {}
  async show({ auth, params }: HttpContext) {
    const user = auth.user!
    return await UserChecklist.query()
      .where('userId', user.id)
      .where('checklistId', params.id)
      .first()
  }

  async update({ auth, params, request }: HttpContext) {
    const user = auth.user!
    const checklistId = params.id
    const checklist = await Checklist.query().where('id', checklistId).firstOrFail()
    await checklist.load('cards')
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

  async importExcel({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const checklistId = params.id

    const { file, treatEmptyAsMissing } = await request.validateUsing(importUpdateChecklist)
    if (!file) {
      return response.badRequest({ message: 'File is required' })
    }

    if (!file.isValid) {
      return response.badRequest({ message: file.errors })
    }

    const workbook = xlsx.readFile(file.tmpPath!)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = xlsx.utils.sheet_to_json<string[]>(worksheet, { header: 1, range: 1 })

    const importedData = jsonData.map((row) => {
      const isMissing = !row[4] && treatEmptyAsMissing
      const duplicates = isMissing ? '' : row[6]
      const isCollected = !!row[4] || (!isMissing && treatEmptyAsMissing)
      return {
        row,
        isMissing,
        duplicates,
        isCollected,
      }
    })

    const missingList = importedData.filter((_) => _.isMissing).map((_) => _.row[0])
    const collectedList = importedData.filter((_) => _.isCollected).map((_) => _.row[0])
    const duplicatesList = importedData
      .filter((_) => !_.isMissing && _.duplicates)
      .map((_) => _.duplicates)

    const checklist = await Checklist.query().where('id', checklistId).firstOrFail()
    await checklist.load('cards')
    const validCards = checklist.cards.map((c) => c.number)

    const filterValid = (list: string[]) => list.filter((num) => validCards.includes(num)).join(',')
    const filterValidDuplicates = (list: string[]) =>
      list
        .filter((item) => {
          let num = new RegExp(/.*?[(].*?[)]/gm).test(item) ? item.split('(')[0] : item
          return validCards.includes(num)
        })
        .join(',')

    const progress = await UserChecklist.updateOrCreate(
      { userId: user.id, checklistId: checklistId },
      {
        missingList: filterValid(missingList),
        duplicatesList: filterValidDuplicates(duplicatesList),
        collectedList: filterValid(collectedList),
      }
    )

    await this.checklistService.reCalculate(checklistId)

    return progress
  }
}
