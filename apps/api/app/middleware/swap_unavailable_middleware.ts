import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SwapUnavailableMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    if (env.get('SWAPS_ENABLED')) return next()
    return response.status(503).json({
      error: {
        code: 'swaps_coming_soon',
        message: 'Swapping is coming soon. Checklists are available now.',
      },
    })
  }
}
