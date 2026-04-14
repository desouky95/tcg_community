import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import { BelongsTo } from '@adonisjs/lucid/types/relations'
import Checklist from '#models/checklist'
import UserChecklist from '#models/user_checklist'
import { SwapFilter } from '#validators/swap'

export type SwapResult = {
  user: {
    id: number
    fullName: string | null
    username: string
    governorate: string | null
    lastLoginAt: DateTime<boolean> | null
  }
  totalMutalTrades: number
  totalTheyOffer: number
  totalTheyNeed: number
  matches: {
    checklistId: number
    checklist: BelongsTo<typeof Checklist>
    theyOffer: string[]
    theyNeed: string[]
  }[]
}

@inject()
export class SwapService {
  constructor(protected ctx: HttpContext) {}

  async getUserSwapMeta(filters?: SwapFilter) {
    const user = this.ctx.auth.user
    let userChecklistsQuery = UserChecklist.query().preload('checklist').where('userId', user?.id!)

    if (filters?.checklists && filters.checklists.length > 0) {
      userChecklistsQuery = userChecklistsQuery.whereIn('checklistId', filters.checklists)
    }
    const myChecklists = await userChecklistsQuery
    if (myChecklists.length === 0) return

    const myNeeds: Record<number, string[]> = {}
    const myOffers: Record<number, string[]> = {}

    for (const cl of myChecklists) {
      myNeeds[cl.checklist.id!] = cl.missingListArray || []
      myOffers[cl.checklist.id!] = cl.duplicatesListArray || []
    }
    return { myNeeds, myOffers }
  }
  async getPossibleUsers(checklistIdsToSearch: number[]) {
    const current = this.ctx.auth.user
    return await User.query()
      .whereNot('id', current?.id!)
      .where('not_ready_for_swap', false)
      .preload('checklists', (q) => {
        q.whereIn('checklistId', checklistIdsToSearch).preload('checklist')
      })
  }
  async getSwapMatchPerUser(
    user: User,
    needs: Record<number, string[]>,
    offers: Record<number, string[]>
  ): Promise<SwapResult | undefined> {
    if (!user.checklists || user.checklists.length === 0) return

    let totalTheyOfferMe = 0
    let totalINeedFromThem = 0
    let matchedChecklists = []
    for (const theirChecklist of user.checklists) {
      const clId = theirChecklist.checklistId!
      const theirOffers = theirChecklist.duplicatesListArray || []
      const theirNeeds = theirChecklist.missingListArray || []

      const myNeedsForCl = needs[clId] || []
      const myOffersForCl = offers[clId] || []

      // theyOfferMe: intersection of myNeedsForCl and theirOffers
      const theyOfferMe = myNeedsForCl.filter((card) => theirOffers.includes(card))

      // theyNeedFromMe: intersection of myOffersForCl and theirNeeds
      const theyNeedFromMe = myOffersForCl.filter((card) => theirNeeds.includes(card))

      if (theyOfferMe.length > 0 || theyNeedFromMe.length > 0) {
        totalTheyOfferMe += theyOfferMe.length
        totalINeedFromThem += theyNeedFromMe.length

        matchedChecklists.push({
          checklistId: clId,
          checklist: theirChecklist.checklist,
          theyOffer: theyOfferMe,
          theyNeed: theyNeedFromMe,
        })
      }
    }

    if (matchedChecklists.length > 0) {
      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          governorate: user.governorate,
          lastLoginAt: user.lastLoginAt,
        },
        totalMutalTrades: Math.min(totalTheyOfferMe, totalINeedFromThem), // simple heuristic
        totalTheyOffer: totalTheyOfferMe,
        totalTheyNeed: totalINeedFromThem,
        matches: matchedChecklists,
      }
    }
    return
  }
}
