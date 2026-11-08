import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { mkdir, writeFile } from 'node:fs/promises'

export function exportPath(id: number) {
  return app.makePath('private', 'privacy-exports', `${id}.json`)
}

export default class PrivacyExport extends Job<{ exportId: number; userId: number }> {
  static options: JobOptions = { queue: 'default', maxRetries: 3 }
  async execute() {
    const { exportId, userId } = this.payload
    await db.transaction(async (trx) => {
      const activeUser = await trx.from('users').where('id', userId).forUpdate().first()
      const record = await trx
        .from('privacy_exports')
        .where({ id: exportId, user_id: userId })
        .first()
      if (
        !record ||
        record.status !== 'queued' ||
        DateTime.fromJSDate(record.expires_at) <= DateTime.utc()
      )
        return
      if (!activeUser || activeUser.status !== 'active') {
        await trx
          .from('privacy_exports')
          .where('id', exportId)
          .update({ status: 'failed', updated_at: DateTime.utc().toSQL() })
        return
      }
      const user = await trx
        .from('users')
        .where('id', userId)
        .select(
          'id',
          'full_name',
          'username',
          'email',
          'mobile',
          'governorate',
          'locale',
          'theme',
          'privacy_preferences',
          'communication_preferences',
          'created_at'
        )
        .first()
      const collections = await trx.from('user_checklists').where('user_id', userId)
      const ids = collections.map((item) => item.id)
      const cards = ids.length
        ? await trx.from('user_checklist_cards').whereIn('user_checklist_id', ids)
        : []
      const conversations = await trx
        .from('conversations')
        .where('user1_id', userId)
        .orWhere('user2_id', userId)
      const conversationIds = conversations.map((item) => item.id)
      const messages = conversationIds.length
        ? await trx
            .from('messages')
            .whereIn('conversation_id', conversationIds)
            .select('id', 'conversation_id', 'sender_id', 'content', 'type', 'created_at')
        : []
      const directory = app.makePath('private', 'privacy-exports')
      await mkdir(directory, { recursive: true, mode: 0o700 })
      await writeFile(
        exportPath(exportId),
        JSON.stringify(
          {
            generatedAt: DateTime.utc().toISO(),
            profile: user,
            collections,
            cards,
            conversations,
            messages,
          },
          null,
          2
        ),
        { mode: 0o600 }
      )
      await trx
        .from('privacy_exports')
        .where({ id: exportId, user_id: userId })
        .update({ status: 'ready', updated_at: DateTime.utc().toSQL() })
    })
  }
  async failed() {
    await db
      .from('privacy_exports')
      .where('id', this.payload.exportId)
      .update({ status: 'failed', updated_at: DateTime.utc().toSQL() })
  }
}
