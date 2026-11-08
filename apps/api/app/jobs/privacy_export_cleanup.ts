import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { rm } from 'node:fs/promises'
import { exportPath } from './privacy_export.js'

export default class CleanupPrivacyExport extends Job<{ exportId: number }> {
  static options: JobOptions = { queue: 'default', maxRetries: 3 }
  async execute() {
    const record = await db.from('privacy_exports').where('id', this.payload.exportId).first()
    if (!record || DateTime.fromJSDate(record.expires_at) > DateTime.utc()) return
    await rm(exportPath(this.payload.exportId), { force: true })
    await db
      .from('privacy_exports')
      .where('id', this.payload.exportId)
      .update({ status: 'expired', updated_at: DateTime.utc().toSQL() })
  }
}
