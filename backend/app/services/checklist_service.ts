import Checklist from '#models/checklist'
import UserChecklist from '#models/user_checklist'
import app from '@adonisjs/core/services/app'

export class ChecklistService {
  async reCalculate(checklistId: string) {
    console.log('CalcChecklist started')
    const checklist = await Checklist.findOrFail(checklistId)
    await checklist.load('cards')
    const usersChecklists = await UserChecklist.query().where('checklist_id', checklistId)

    const missingLists = usersChecklists.map((_) => (_.missingList || '').split(','))
    const duplicatesLists = usersChecklists.map((_) => (_.duplicatesList || '').split(','))
    const collectedLists = usersChecklists.map((_) => (_.collectedList || '').split(','))

    for (const index in checklist.cards) {
      const card = checklist.cards[index]
      const missingCount = missingLists.reduce((prev, curr) => {
        return curr.find((_) => _ === card.number) ? prev + 1 : prev
      }, 0)
      let duplicatesCount =
        duplicatesLists.reduce((prev, curr) => {
          return curr.find((_) => _ === card.number) ? prev + 1 : prev
        }, 0) || 0
      const collectedCount = collectedLists.reduce((prev, curr) => {
        return curr.find((_) => _ === card.number) ? prev + 1 : prev
      }, 0)

      duplicatesCount = duplicatesCount === 0 ? 1 : duplicatesCount
      await card.lockForUpdate(async (release) => {
        const ratio = missingCount / duplicatesCount
        release.needCount = missingCount
        release.holdCount = collectedCount
        release.offerCount = duplicatesCount
        release.ratio = ratio.toFixed(2)
        await release.save()
      })
    }
    console.log('CalcChecklist finished')
  }

  async getUserChecklists(userId: number) {
    return UserChecklist.query().preload('checklist').where('userId', userId)
  }
}
