import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { sessionFingerprint } from '#services/identity_service'

export default class AdminMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { allowAdmin?: boolean } = {}
  ) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = await ctx.auth.authenticateUsing(['web'])

    if (
      user.status !== 'active' ||
      user.blocked ||
      ctx.session.get('auth_password_fingerprint') !== sessionFingerprint(user.password)
    ) {
      return ctx.response.status(401).json({
        error: { code: 'session_expired', message: 'Your session is no longer active' },
      })
    }

    if (user.role !== 'super_admin' && !(options.allowAdmin && user.role === 'admin')) {
      return ctx.response.status(403).json({ error: { code: 'forbidden', message: 'Administrator access required' } })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
