import type { HttpContext } from '@adonisjs/core/http'
import { CommerceCustomerService } from '#services/commerce_customer_service'

export default class CommerceController {
  async customer({ auth, response }: HttpContext) {
    const result = await new CommerceCustomerService().resolveForUser(auth.getUserOrFail())
    // A commerce outage is deliberately non-fatal to the shared account session.
    return response.json({ data: result })
  }
}
