import { CardService } from '#services/card_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CardsController {
  constructor(private service: CardService) {}
  async index({ params, response, request, auth }: HttpContext) {
    const slug = params.id
    const qs = request.qs()
    const user = await auth.authenticateUsing(['web'])
    const cards = await this.service.filterCards(slug, qs, user)
    const filters = await this.service.getFiltersOptions(slug)
    return response.api(cards, { filters })
  }
}
