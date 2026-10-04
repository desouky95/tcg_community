import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { timingSafeEqual } from 'node:crypto'

function matchesToken(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)

  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

export default class ScraperTriggerMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const expected = env.get('SCRAPER_TRIGGER_TOKEN')
    if (!expected) {
      return response.status(503).json({
        error: {
          code: 'scraper_not_configured',
          message: 'SCRAPER_TRIGGER_TOKEN is not configured',
        },
      })
    }

    const authorization = request.header('authorization') ?? ''
    const actual = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (!matchesToken(actual, expected)) {
      return response.status(401).json({
        error: { code: 'unauthorized', message: 'A valid scraper bearer token is required' },
      })
    }

    return next()
  }
}
