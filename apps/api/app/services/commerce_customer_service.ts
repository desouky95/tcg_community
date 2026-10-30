import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import User from '#models/user'

type MedusaCustomerLinkResponse = { customer: { id: string } }

/**
 * The only Adonis-to-Medusa integration boundary. It is intentionally
 * best-effort: commerce must never prevent a collector from using checklists.
 */
export class CommerceCustomerService {
  async resolveForUser(user: User) {
    const existing = await db.from('commerce_customer_links').where('user_id', user.id).first()
    if (existing?.medusa_customer_id) {
      return { linked: true, customerId: existing.medusa_customer_id, available: true }
    }

    const baseUrl = env.get('MEDUSA_INTERNAL_URL')
    const serviceKey = env.get('MEDUSA_SERVICE_KEY')
    if (!baseUrl || !serviceKey) {
      return { linked: false, customerId: null, available: false }
    }

    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/store/community/customer-link`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-next-pull-service-key': serviceKey.release(),
        },
        body: JSON.stringify({
          external_id: String(user.id),
          email: user.email ?? undefined,
          first_name: user.fullName?.split(' ')[0] ?? user.username,
          last_name: user.fullName?.split(' ').slice(1).join(' ') || undefined,
        }),
      })

      if (!response.ok) throw new Error(`Medusa customer link returned ${response.status}`)
      const { customer } = (await response.json()) as MedusaCustomerLinkResponse
      const now = DateTime.utc().toSQL()

      await db.transaction(async (trx) => {
        const link = await trx.from('commerce_customer_links').where('user_id', user.id).first()
        if (link) {
          await trx.from('commerce_customer_links').where('id', link.id).update({
            medusa_customer_id: customer.id,
            status: 'active',
            sync_attempts: link.sync_attempts + 1,
            last_sync_error: null,
            last_synced_at: now,
            updated_at: now,
          })
          return
        }
        await trx.table('commerce_customer_links').insert({
          user_id: user.id,
          medusa_customer_id: customer.id,
          status: 'active',
          sync_attempts: 1,
          last_synced_at: now,
          created_at: now,
          updated_at: now,
        })
      })
      return { linked: true, customerId: customer.id, available: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Medusa customer link error'
      const now = DateTime.utc().toSQL()
      const link = await db.from('commerce_customer_links').where('user_id', user.id).first()
      if (link) {
        await db.from('commerce_customer_links').where('id', link.id).update({
          status: 'retry_pending',
          sync_attempts: link.sync_attempts + 1,
          last_sync_error: message,
          updated_at: now,
        })
      } else {
        await db.table('commerce_customer_links').insert({
          user_id: user.id,
          status: 'retry_pending',
          sync_attempts: 1,
          last_sync_error: message,
          created_at: now,
          updated_at: now,
        })
      }
      return { linked: false, customerId: null, available: false }
    }
  }
}
