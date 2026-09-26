import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Checklist from '#models/checklist'
import UserChecklist from '#models/user_checklist'

export default class RecalculateStats extends BaseCommand {
  static commandName = 'recalculate:stats'
  static description = 'Recalculate card-level statistics for all checklists'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting statistics recalculation...')

    const checklists = await Checklist.query().preload('cards')

    for (const checklist of checklists) {
      this.logger.info(`Processing checklist: ${checklist.name}`)

      // Fetch all user progress for this checklist
      const userChecklists = await UserChecklist.query().where('checklistId', checklist.id)

      // Map to store counts: cardNum -> { need: 0, hold: 0, offer: 0 }
      const statsMap: Record<string, { need: number; hold: number; offer: number }> = {}

      for (const uc of userChecklists) {
        const collected = (uc.collectedList || '').split(',').filter(Boolean)
        const missing = (uc.missingList || '').split(',').filter(Boolean)
        const duplicates = (uc.duplicatesList || '').split(',').filter(Boolean)

        collected.forEach((num) => {
          if (!statsMap[num]) statsMap[num] = { need: 0, hold: 0, offer: 0 }
          statsMap[num].hold++
        })

        missing.forEach((num) => {
          if (!statsMap[num]) statsMap[num] = { need: 0, hold: 0, offer: 0 }
          statsMap[num].need++
        })

        duplicates.forEach((num) => {
          if (!statsMap[num]) statsMap[num] = { need: 0, hold: 0, offer: 0 }
          statsMap[num].offer++
        })
      }

      // Update each card in the checklist
      for (const card of checklist.cards) {
        const stats = statsMap[card.number] || { need: 0, hold: 0, offer: 0 }

        card.needCount = stats.need
        card.holdCount = stats.hold
        card.offerCount = stats.offer

        // Ratio = Need / Offer
        if (stats.offer > 0) {
          card.ratio = (stats.need / stats.offer).toFixed(2)
        } else {
          card.ratio = '0.00'
        }

        await card.save()
      }
    }

    this.logger.success('Statistics recalculation completed.')
  }
}