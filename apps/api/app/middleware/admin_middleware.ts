import type { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = await ctx.auth.authenticateUsing(['web'])

    if (user.role !== 'super_admin') {
      return ctx.response.status(403).json({ error: { code: 'forbidden', message: 'Administrator access required' } })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
