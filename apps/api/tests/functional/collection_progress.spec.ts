import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Category from '#models/category'
import Checklist from '#models/checklist'
import Card from '#models/card'
import { sessionFingerprint } from '#services/identity_service'
import XLSX from 'xlsx'

async function setup() {
  const user = await User.create({
    username: 'collection_owner',
    mobile: '+201012345678',
    password: 'password123',
    status: 'active',
    role: 'user',
    isVerified: true,
  })
  const other = await User.create({
    username: 'collection_other',
    mobile: '+201112345678',
    password: 'password123',
    status: 'active',
    role: 'user',
    isVerified: true,
  })
  const category = await Category.create({ name: 'Collection feature test', parentId: -1 })
  const checklist = await Checklist.create({
    categoryId: category.id,
    name: 'Collection feature checklist',
    slug: 'collection-feature-checklist',
    year: 2026,
    type: 'card',
    totalCards: 2,
  })
  const first = await Card.create({
    checklistId: checklist.id,
    number: '1',
    name: 'First',
    type: 'Base',
    section: 'A',
    order: 0,
    variant: null,
    baseCardId: null,
  })
  const second = await Card.create({
    checklistId: checklist.id,
    number: '2',
    name: 'Second',
    type: 'Base',
    section: 'A',
    order: 1,
    variant: null,
    baseCardId: null,
  })
  const session = (actor: User) => ({
    auth_web: actor.id,
    auth_password_fingerprint: sessionFingerprint(actor.password),
  })
  return { user, other, checklist, first, second, session }
}
function workbook(rows: unknown[][]) {
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.aoa_to_sheet([
      ['Number', 'Name', 'Type', 'Section', 'Hold', 'Offer', 'Wanted'],
      ...rows,
    ]),
    'Collection'
  )
  return XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

test.group('Collection progress', (group) => {
  group.each.setup(async () => {
    const rollback = await testUtils.db().wrapInGlobalTransaction()
    await db.rawQuery(
      "ALTER TABLE user_checklists ADD COLUMN IF NOT EXISTS visibility varchar(16) NOT NULL DEFAULT 'private'"
    )
    await db.rawQuery(
      'ALTER TABLE user_checklists ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1'
    )
    await db.rawQuery(
      'ALTER TABLE user_checklists ADD COLUMN IF NOT EXISTS share_token varchar(64)'
    )
    await db.rawQuery(
      'ALTER TABLE user_checklist_cards ADD COLUMN IF NOT EXISTS offered_quantity integer NOT NULL DEFAULT 0'
    )
    await db.rawQuery(
      'ALTER TABLE user_checklist_cards ADD COLUMN IF NOT EXISTS wanted_quantity integer NOT NULL DEFAULT 0'
    )
    await db.rawQuery(
      'CREATE TABLE IF NOT EXISTS collection_audits (id serial primary key, user_id integer NOT NULL, checklist_id integer NOT NULL, action varchar(20) NOT NULL, version integer NOT NULL, created_at timestamptz NOT NULL)'
    )
    return rollback
  })

  test('starts once, updates quantities atomically and rejects stale or invalid edits', async ({
    client,
    assert,
  }) => {
    const f = await setup()
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    for (let i = 0; i < 2; i++)
      (
        await client.post(`${path}/start`).withCsrfToken().withSession(f.session(f.user)).json({})
      ).assertStatus(200)
    assert.lengthOf(
      await db.from('user_checklists').where({ user_id: f.user.id, checklist_id: f.checklist.id }),
      1
    )
    const data = {
      expectedVersion: 1,
      entries: [
        { cardId: f.first.id, quantity: 3, offeredQuantity: 2, wanted: false },
        { cardId: f.second.id, quantity: 0, offeredQuantity: 0, wanted: true },
      ],
    }
    ;(
      await client
        .patch(`${path}/entries`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json(data)
    ).assertStatus(200)
    const row = await db
      .from('user_checklists')
      .where({ user_id: f.user.id, checklist_id: f.checklist.id })
      .first()
    assert.equal(row.version, 2)
    assert.equal(row.collected_list, '1(3)')
    assert.equal(row.duplicates_list, '1(2)')
    assert.equal(row.missing_list, '2')
    ;(
      await client
        .patch(`${path}/entries`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json(data)
    ).assertStatus(409)
    ;(
      await client
        .patch(`${path}/entries`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({
          expectedVersion: 2,
          entries: [{ cardId: f.first.id, quantity: 1, offeredQuantity: 3, wanted: false }],
        })
    ).assertStatus(422)
    assert.equal((await db.from('user_checklists').where('id', row.id).first()).version, 2)
    const details = await client.get(`${path}/details`).withSession(f.session(f.user))
    details.assertStatus(200)
    const detailData = (
      details.body() as {
        data: {
          checklistId: number
          version: number
          visibility: string
          missingList: string
          entries: Array<{
            cardId: number
            number: string
            quantity: number
            offeredQuantity: number
            wanted: boolean
            wantedQuantity: number
          }>
        }
      }
    ).data
    assert.equal(detailData.checklistId, f.checklist.id)
    assert.equal(detailData.version, 2)
    assert.equal(detailData.visibility, 'private')
    assert.equal(detailData.missingList, '2')
    assert.deepEqual(
      detailData.entries.map((entry) => [
        entry.cardId,
        entry.number,
        entry.quantity,
        entry.offeredQuantity,
        entry.wanted,
        entry.wantedQuantity,
      ]),
      [
        [f.first.id, '1', 3, 2, false, 0],
        [f.second.id, '2', 0, 0, true, 1],
      ]
    )
    ;(await client.get(`${path}/details`).withSession(f.session(f.other))).assertStatus(404)
  })

  test('shared views return missing and offered copies in checklist order', async ({
    client,
    assert,
  }) => {
    const f = await setup()
    await db.from('cards').where('id', f.first.id).update({ number: '20', order: 0 })
    await db.from('cards').where('id', f.second.id).update({ number: '3', order: 1 })
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    ;(
      await client.post(`${path}/start`).withCsrfToken().withSession(f.session(f.user)).json({})
    ).assertStatus(200)
    ;(
      await client
        .patch(`${path}/entries`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({
          expectedVersion: 1,
          entries: [
            { cardId: f.first.id, quantity: 3, offeredQuantity: 2, wanted: true },
            { cardId: f.second.id, quantity: 2, offeredQuantity: 1, wanted: true },
          ],
        })
    ).assertStatus(200)
    const unlisted = await client
      .put(`${path}/visibility`)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .json({ expectedVersion: 2, visibility: 'unlisted' })
    unlisted.assertStatus(200)
    const token = (unlisted.body() as { data: { shareToken: string } }).data.shareToken
    const shared = await client.get(`/api/v1/shared/collections/${token}`)
    shared.assertStatus(200)
    const sharedData = (
      shared.body() as {
        data: {
          missing: { number: string; quantity: number }[]
          duplicates: { number: string; quantity: number }[]
        }
      }
    ).data
    assert.deepEqual(
      sharedData.missing.map((item) => [item.number, item.quantity]),
      [
        ['20', 1],
        ['3', 1],
      ]
    )
    assert.deepEqual(
      sharedData.duplicates.map((item) => [item.number, item.quantity]),
      [
        ['20', 2],
        ['3', 1],
      ]
    )
    assert.notProperty(sharedData, 'cards')
    ;(
      await client
        .put(`${path}/visibility`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ expectedVersion: 3, visibility: 'public' })
    ).assertStatus(200)
    const publicView = await client.get(
      `/api/v1/users/${f.user.id}/collections/${f.checklist.slug}`
    )
    publicView.assertStatus(200)
    const publicData = (publicView.body() as { data: typeof sharedData }).data
    assert.deepEqual(publicData.missing, sharedData.missing)
    assert.deepEqual(publicData.duplicates, sharedData.duplicates)
  })

  test('enforces private, public and token-only visibility and confirmed reset', async ({
    client,
    assert,
  }) => {
    const f = await setup()
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    ;(
      await client.post(`${path}/start`).withCsrfToken().withSession(f.session(f.user)).json({})
    ).assertStatus(200)
    const publicUrl = `/api/v1/users/${f.user.id}/collections/${f.checklist.slug}`
    ;(await client.get(publicUrl)).assertStatus(404)
    const unlisted = await client
      .put(`${path}/visibility`)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .json({ expectedVersion: 1, visibility: 'unlisted' })
    unlisted.assertStatus(200)
    const token = (unlisted.body() as { data: { shareToken: string } }).data.shareToken
    ;(await client.get(publicUrl)).assertStatus(404)
    ;(await client.get(`/api/v1/shared/collections/${token}`)).assertStatus(200)
    const shared = await client.get(`/api/v1/shared/collections/${token}`)
    assert.notProperty((shared.body() as { data: object }).data, 'shareToken')
    ;(
      await client
        .put(`${path}/visibility`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ expectedVersion: 2, visibility: 'public' })
    ).assertStatus(200)
    ;(await client.get(`/api/v1/shared/collections/${token}`)).assertStatus(404)
    ;(await client.get(publicUrl)).assertStatus(200)
    await db
      .from('users')
      .where('id', f.user.id)
      .update({ privacy_preferences: JSON.stringify({ showCollection: false }) })
    ;(await client.get(publicUrl)).assertStatus(404)
    ;(
      await client
        .post(`${path}/reset`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ expectedVersion: 3, confirmation: 'no' })
    ).assertStatus(422)
    ;(
      await client
        .post(`${path}/reset`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ expectedVersion: 3, confirmation: 'RESET' })
    ).assertStatus(200)
    assert.exists(
      await db
        .from('collection_audits')
        .where({ user_id: f.user.id, checklist_id: f.checklist.id, action: 'reset' })
        .first()
    )
    ;(await client.get(publicUrl)).assertStatus(404)
  })

  test('previews spreadsheet errors without mutation and commits a valid versioned import', async ({
    client,
    assert,
  }) => {
    const f = await setup()
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    ;(
      await client.post(`${path}/start`).withCsrfToken().withSession(f.session(f.user)).json({})
    ).assertStatus(200)
    const bad = workbook([
      ['1', '', '', '', 2],
      ['unknown', '', '', '', 1],
    ])
    const preview = await client
      .post(`${path}/import/preview`)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .file('file', bad, {
        filename: 'import.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    preview.assertStatus(200)
    assert.lengthOf((preview.body() as { data: { issues: unknown[] } }).data.issues, 1)
    assert.lengthOf(
      await db
        .from('user_checklist_cards')
        .where(
          'user_checklist_id',
          (
            await db
              .from('user_checklists')
              .where({ user_id: f.user.id, checklist_id: f.checklist.id })
              .first()
          ).id
        ),
      0
    )
    const valid = workbook([
      ['1', '', '', '', 3, 1, 'no'],
      ['2', '', '', '', 0, 0, 'yes'],
    ])
    const validPreview = await client
      .post(`${path}/import/preview`)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .fields({ treatEmptyAsMissing: 'true' })
      .file('file', valid, {
        filename: 'import.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    validPreview.assertStatus(200)
    const previewToken = (validPreview.body() as { data: { previewToken: string } }).data
      .previewToken
    const tampered = await client
      .post(`${path}/import/commit`)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .fields({ expectedVersion: '1', previewToken, treatEmptyAsMissing: 'true' })
      .file('file', bad, {
        filename: 'import.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    tampered.assertStatus(422)
    assert.lengthOf(
      await db
        .from('user_checklist_cards')
        .where(
          'user_checklist_id',
          (
            await db
              .from('user_checklists')
              .where({ user_id: f.user.id, checklist_id: f.checklist.id })
              .first()
          ).id
        ),
      0
    )
    const commit = await client
      .post(`${path}/import/commit`)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .fields({ expectedVersion: '1', previewToken, treatEmptyAsMissing: 'true' })
      .file('file', valid, {
        filename: 'import.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    commit.assertStatus(200)
    assert.equal((commit.body() as { data: { imported: number } }).data.imported, 2)
    assert.exists((commit.body() as { data: { auditId: number } }).data.auditId)
    const collection = await db
      .from('user_checklists')
      .where({ user_id: f.user.id, checklist_id: f.checklist.id })
      .first()
    assert.equal(collection.missing_list, '2')
    assert.equal(collection.duplicates_list, '1')
    const exported = await client.get(`${path}/export`).withSession(f.session(f.user))
    exported.assertStatus(200)
    assert.include(exported.header('content-type'), 'spreadsheetml')
  })
  test('keeps dashboard summaries and public card counts aligned with privacy preferences', async ({
    client,
    assert,
  }) => {
    const f = await setup()
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    ;(
      await client.post(`${path}/start`).withCsrfToken().withSession(f.session(f.user)).json({})
    ).assertStatus(200)
    ;(
      await client
        .patch(`${path}/entries`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({
          expectedVersion: 1,
          entries: [{ cardId: f.first.id, quantity: 2, offeredQuantity: 1, wanted: false }],
        })
    ).assertStatus(200)
    assert.equal(Number((await db.from('cards').where('id', f.first.id).first()).hold_count), 0)
    const dashboard = await client.get('/api/v1/account/collections').withSession(f.session(f.user))
    dashboard.assertStatus(200)
    const summaries = dashboard.body().data as { owned: number; offered: number }[]
    assert.equal(summaries[0].owned, 1)
    assert.equal(summaries[0].offered, 1)
    ;(
      await client
        .put(`${path}/visibility`)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ expectedVersion: 2, visibility: 'public' })
    ).assertStatus(200)
    assert.equal(Number((await db.from('cards').where('id', f.first.id).first()).hold_count), 1)
    ;(
      await client
        .put('/api/v1/account/preferences')
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ privacy: { showCollection: false } })
    ).assertStatus(200)
    assert.equal(Number((await db.from('cards').where('id', f.first.id).first()).hold_count), 0)
  })

  test('preserves the legacy list editor and syncs its quantities', async ({ client, assert }) => {
    const f = await setup()
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    const saved = await client
      .post(path)
      .withCsrfToken()
      .withSession(f.session(f.user))
      .json({ collectedList: '1', duplicatesList: '1, 2(2)', missingList: '1, 2(3)' })
    saved.assertStatus(200)
    const viewed = await client.get(path).withSession(f.session(f.user))
    viewed.assertStatus(200)
    const owned = await db
      .from('user_checklists')
      .where({ user_id: f.user.id, checklist_id: f.checklist.id })
      .first()
    const first = await db
      .from('user_checklist_cards')
      .where({ user_checklist_id: owned.id, card_id: f.first.id })
      .first()
    assert.equal(first.quantity, 1)
    assert.equal(first.offered_quantity, 1)
    assert.equal(first.wanted_quantity, 1)
    assert.equal(owned.missing_list, '1,2(3)')
    const second = await db
      .from('user_checklist_cards')
      .where({ user_checklist_id: owned.id, card_id: f.second.id })
      .first()
    assert.equal(second.offered_quantity, 2)
    assert.equal(second.wanted_quantity, 3)
  })

  test('rejects malformed or unknown list entries before creating a collection', async ({
    client,
    assert,
  }) => {
    const f = await setup()
    const path = `/api/v1/user-checklists/${f.checklist.slug}`
    ;(
      await client
        .post(path)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ missingList: '1(0)' })
    ).assertStatus(422)
    ;(
      await client
        .post(path)
        .withCsrfToken()
        .withSession(f.session(f.user))
        .json({ duplicatesList: 'unknown(2)' })
    ).assertStatus(422)
    assert.notExists(
      await db
        .from('user_checklists')
        .where({ user_id: f.user.id, checklist_id: f.checklist.id })
        .first()
    )
  })
})
