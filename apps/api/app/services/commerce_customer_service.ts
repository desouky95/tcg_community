import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import User from '#models/user'

export class CommerceCustomerService {
  async resolveForUser(user: User, cartId?: string) {
    const baseUrl = env.get('API_MEDUSA_INTERNAL_URL')
    const serviceKey = env.get('API_MEDUSA_SERVICE_KEY')
    const publisableKey = env.get('API_MEDUSA_PUBLISHABLE_KEY')
    if (!baseUrl || !serviceKey || !publisableKey)
      return { linked: false, customerId: null, available: false }
    try {
      // Serialize first-time links across API instances, including the remote creation.

      return await db.transaction(async (trx) => {
        await User.query().where('id', user.id).forUpdate().firstOrFail()
        const existing = await trx.from('commerce_customer_links').where('user_id', user.id).first()
        if (existing?.medusa_customer_id && !cartId)
          return {
            linked: true,
            customerId: existing.medusa_customer_id as string,
            available: true,
          }

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
              ...(cartId ? { cart_id: cartId } : {}),
            }),
            signal: AbortSignal.timeout(10000),
          }
        )
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
      console.error('Commerce customer sync failed')
      return { linked: false, customerId: null, available: false }
    }
  }

  async account(user: User, payload: Record<string, unknown>) {
    const link = await this.resolveForUser(user)
    const baseUrl = env.get('API_MEDUSA_INTERNAL_URL')
    const key = env.get('API_MEDUSA_SERVICE_KEY')
    const publisableKey = env.get('API_MEDUSA_PUBLISHABLE_KEY')

    console.log("DEBUG",link,baseUrl,key,publisableKey)
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
