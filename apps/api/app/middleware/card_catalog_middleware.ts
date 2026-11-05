import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { timingSafeEqual } from 'node:crypto'

export default class CardCatalogMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const expected = env.get('CARD_CATALOG_API_KEY')
    if (!expected) return response.serviceUnavailable({ error: 'Card catalog is not configured' })
    const header = request.header('authorization') ?? ''
    const actual = header.startsWith('Bearer ') ? header.slice(7) : ''
    const a = Buffer.from(actual)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return response.unauthorized({ error: 'Invalid service credentials' })
    }
    return next()
  }
}
