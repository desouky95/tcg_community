import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import logger from '@adonisjs/core/services/logger'

export class CommerceCustomerService {
  async resolveForUser(user: User) {
    const baseUrl = env.get('MEDUSA_INTERNAL_URL')
    const serviceKey = env.get('MEDUSA_SERVICE_KEY')
    const publisableKey = env.get('MEDUSA_PUBLISHABLE_KEY')
    console.log('debug', `'x-next-pull-service-key': ${serviceKey?.release()}`)
    console.log('debug', `'x-publishable-api-key': ${publisableKey?.release()}`)
    if (!baseUrl || !serviceKey || !publisableKey)
      return { linked: false, customerId: null, available: false }
    try {
      // Serialize first-time links across API instances, including the remote creation.

      return await db.transaction(async (trx) => {
        await User.query().where('id', user.id).forUpdate().firstOrFail()
        const existing = await trx.from('commerce_customer_links').where('user_id', user.id).first()
        logger.log('debug', existing)
        if (existing?.medusa_customer_id)
          return {
            linked: true,
            customerId: existing.medusa_customer_id as string,
            available: true,
          }
        console.log('debug', `${baseUrl.replace(/\/$/, '')}/store/community/customer-link`)

        const response = await fetch(
          `${baseUrl.replace(/\/$/, '')}/store/community/customer-link`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-next-pull-service-key': serviceKey.release(),
              'x-publishable-api-key': publisableKey.release(),
            },
            body: JSON.stringify({
              external_id: String(user.id),
              email: user.email ?? undefined,
              first_name: user.fullName?.split(' ')[0] ?? user.username,
              last_name: user.fullName?.split(' ').slice(1).join(' ') || undefined,
            }),
          }
        )
        console.log('debug', response)
        if (!response.ok) throw new Error('Customer link unavailable')
        const payload = (await response.json()) as { customer?: { id?: unknown } }
        const customerId = payload.customer?.id
        if (typeof customerId !== 'string' || !customerId)
          throw new Error('Invalid customer link response')
        const now = DateTime.utc().toSQL()
        if (existing)
          await trx
            .from('commerce_customer_links')
            .where('id', existing.id)
            .update({
              medusa_customer_id: customerId,
              status: 'active',
              sync_attempts: existing.sync_attempts + 1,
              last_sync_error: null,
              last_synced_at: now,
              updated_at: now,
            })
        else
          await trx.table('commerce_customer_links').insert({
            user_id: user.id,
            medusa_customer_id: customerId,
            status: 'active',
            sync_attempts: 1,
            last_synced_at: now,
            created_at: now,
            updated_at: now,
          })
        return { linked: true, customerId, available: true }
      })
    } catch {
      return { linked: false, customerId: null, available: false }
    }
  }

  async account(user: User, payload: Record<string, unknown>) {
    console.log('debug', 'Starting Resolving User')
    const link = await this.resolveForUser(user)
    console.log('debug', 'Finished Resolving User')
    console.log('debug', 'Resolved User', link)
    const baseUrl = env.get('MEDUSA_INTERNAL_URL')
    const key = env.get('MEDUSA_SERVICE_KEY')
    const publisableKey = env.get('MEDUSA_PUBLISHABLE_KEY')
    if (!link.customerId || !baseUrl || !key || !publisableKey)
      return { status: 503, body: { error: 'Commerce is temporarily unavailable' } }
    try {
      const result = await fetch(`${baseUrl.replace(/\/$/, '')}/store/community/account`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-next-pull-service-key': key.release(),
          'x-publishable-api-key': publisableKey?.release(),
        },
        body: JSON.stringify({ ...payload, customer_id: link.customerId }),
        signal: AbortSignal.timeout(10000),
      })
      if (result.status === 404) return { status: 404, body: { error: 'Not found' } }
      if (result.status === 400) return { status: 422, body: { error: 'Invalid commerce request' } }
      if (!result.ok) throw new Error('Commerce unavailable')
      return { status: result.status, body: await result.json() }
    } catch {
      return { status: 503, body: { error: 'Commerce is temporarily unavailable' } }
    }
  }
}
