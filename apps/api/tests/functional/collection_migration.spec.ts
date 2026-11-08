import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import type { QueryClientContract } from '@adonisjs/lucid/types/database'
import CollectionMigration from '../../database/migrations/1792600000000_add_collection_visibility_version.js'

test.group('Collection migration', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  test('adds and removes collection schema inside an isolated transaction', async ({ assert }) => {
    const connection = db.connection() as QueryClientContract
    if (await connection.schema.hasColumn('user_checklists', 'visibility')) return
    await new CollectionMigration(connection, 'collection_migration').execUp()
    assert.isTrue(await connection.schema.hasColumn('user_checklists', 'visibility'))
    assert.isTrue(await connection.schema.hasColumn('user_checklist_cards', 'offered_quantity'))
    assert.isTrue(await connection.schema.hasColumn('user_checklist_cards', 'wanted_quantity'))
    assert.isTrue(await connection.schema.hasTable('collection_audits'))
    await new CollectionMigration(connection, 'collection_migration').execDown()
    assert.isFalse(await connection.schema.hasColumn('user_checklists', 'visibility'))
    assert.isFalse(await connection.schema.hasTable('collection_audits'))
  })
})
