import type { HttpContext } from '@adonisjs/core/http'
import { swapSearchValidator } from '#validators/swap'
import UserChecklist from '#models/user_checklist'
import { inject } from '@adonisjs/core'
import { SwapResult, SwapService } from '#services/swap_service'
import User from '#models/user'

@inject()
export default class SwapsController {
  constructor(protected swapService: SwapService) {}
  async search({ request, response }: HttpContext) {
    const data = await request.validateUsing(swapSearchValidator)

    const myChecklists = await this.swapService.getUserSwapMeta(data)

    if (!myChecklists) return response.json({ data: [] })

    const checklistIdsToSearch = Object.keys(myChecklists.myNeeds).map(Number)
    const otherUsers = await this.swapService.getPossibleUsers(checklistIdsToSearch)

    const results: SwapResult[] = []

    for (const otherUser of otherUsers) {
      if (!otherUser.checklists || otherUser.checklists.length === 0) continue
      const matched = await this.swapService.getSwapMatchPerUser(
        otherUser,
        myChecklists.myNeeds,
        myChecklists.myOffers
      )
      if (matched) results.push(matched)
    }

    results.sort((a, b) => {
      if (b.totalMutalTrades !== a.totalMutalTrades) {
        return b.totalMutalTrades - a.totalMutalTrades
      }
      return b.totalTheyOffer - a.totalTheyOffer
    })

    return response.json({ data: results })
  }

  async match({ request, response }: HttpContext) {
    const targetUserId = request.param('userId')
    const targetUser = await User.findByOrFail('id', targetUserId!)
    await targetUser.load('checklists')
    const swapInfo = await this.swapService.getUserSwapMeta()
    const matches = await this.swapService.getSwapMatchPerUser(
      targetUser,
      swapInfo!.myNeeds,
      swapInfo!.myOffers
    )

    return response.ok(matches)
  }
}
