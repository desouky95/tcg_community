import type { HttpContext } from '@adonisjs/core/http'
import { CommerceCustomerService } from '#services/commerce_customer_service'
import { addressValidator } from '#validators/commerce_account'

export default class CommerceController {
  async customer({ auth, response }: HttpContext) {
    const result = await new CommerceCustomerService().resolveForUser(auth.getUserOrFail())
    return response.json({ data: result })
  }
  private async send(ctx: HttpContext, payload: Record<string, unknown>) {
    ctx.response.header('Cache-Control', 'no-store')
    const result = await new CommerceCustomerService().account(ctx.auth.getUserOrFail(), payload)
    return ctx.response.status(result.status).json(result.body)
  }
  async orders(ctx: HttpContext) {
    const offset = Number(ctx.request.input('offset', 0))
    if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000)
      return ctx.response.badRequest({ error: 'Invalid offset' })
    return this.send(ctx, { operation: 'orders', offset })
  }
  async order(ctx: HttpContext) {
    return this.send(ctx, { operation: 'order', id: ctx.params.id })
  }
  async addresses(ctx: HttpContext) {
    return this.send(ctx, { operation: 'addresses' })
  }
  async createAddress(ctx: HttpContext) {
    return this.send(ctx, {
      operation: 'create_address',
      address: await ctx.request.validateUsing(addressValidator),
    })
  }
  async updateAddress(ctx: HttpContext) {
    return this.send(ctx, {
      operation: 'update_address',
      id: ctx.params.id,
      address: await ctx.request.validateUsing(addressValidator),
    })
  }
  async deleteAddress(ctx: HttpContext) {
    return this.send(ctx, { operation: 'delete_address', id: ctx.params.id })
  }
}
