import Category from '#models/category'
import Checklist from '#models/checklist'
import User from '#models/user'
import { checklistCoverStorage } from '#services/checklist_cover_storage'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { access, mkdir, readdir, writeFile } from 'node:fs/promises'
import XLSX from 'xlsx'

const coverDirectory = app.makePath('storage', 'checklist-covers')
const pngCover = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
)

function invalidChecklistWorkbook() {
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.json_to_sheet([
    { number: '1', name: 'First card' },
    { number: '1', name: 'Duplicate card' },
  ])
  XLSX.utils.book_append_sheet(workbook, sheet, 'Cards')
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }) as Buffer
}

async function storedCovers() {
  try {
    return await readdir(coverDirectory)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function createFixtures(suffix: string) {
  const admin = await User.create({
    username: `cover-admin-${suffix}`,
    mobile: `2010${suffix.slice(-7)}`,
    role: 'super_admin',
  })
  const category = await Category.create({ name: `Cover category ${suffix}`, parentId: -1 })
  return { admin, category }
}

function checklistFields(categorySlug: string, name: string) {
  return {
    name,
    type: 'card',
    year: '2026',
    totalCards: '10',
    categoryId: categorySlug,
  }
}

test.group('Checklist cover images', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('uploads and streams a versioned checklist cover', async ({ client, assert }) => {
    const suffix = Date.now().toString()
    const { admin, category } = await createFixtures(suffix)
    const response = await client
      .post('/api/v1/checklists')
      .withCsrfToken()
      .withGuard('web')
      .loginAs(admin)
      .fields(checklistFields(category.slug, `Cover upload ${suffix}`))
      .file('coverImage', pngCover, {
        filename: 'cover.png',
        contentType: 'image/png',
      })

    response.assertStatus(201)
    const checklist = await Checklist.findByOrFail('name', `Cover upload ${suffix}`)
    assert.isNotNull(checklist.coverImagePath)
    assert.include(checklist.coverImageUrl!, `/api/v1/checklists/${checklist.id}/cover?v=`)
    const createBody = response.body() as { coverImageUrl?: string | null }
    assert.include(createBody.coverImageUrl!, `/api/v1/checklists/${checklist.id}/cover?v=`)

    const detail = await client.get(`/api/v1/checklists/${checklist.id}`)
    detail.assertStatus(200)
    const detailBody = detail.body() as { data: { coverImageUrl?: string | null } }
    assert.equal(detailBody.data.coverImageUrl, checklist.coverImageUrl)

    const cover = await client.get(checklist.coverImageUrl!)
    cover.assertStatus(200)
    assert.equal(cover.header('content-type'), 'image/png')
    assert.equal(cover.header('cache-control'), 'public, max-age=31536000, immutable')

    await checklistCoverStorage.remove(checklist.coverImagePath)
  })

  test('returns 404 when a checklist has no cover', async ({ client }) => {
    const suffix = Date.now().toString()
    const { category } = await createFixtures(suffix)
    const checklist = await Checklist.create({
      ...checklistFields(category.slug, `No cover ${suffix}`),
      categoryId: category.id,
      year: 2026,
      totalCards: 10,
    })

    const response = await client.get(`/api/v1/checklists/${checklist.id}/cover`)
    response.assertStatus(404)
  })

  test('rejects an unsupported cover type', async ({ client }) => {
    const suffix = Date.now().toString()
    const { admin, category } = await createFixtures(suffix)
    const response = await client
      .post('/api/v1/checklists')
      .withCsrfToken()
      .withGuard('web')
      .loginAs(admin)
      .fields(checklistFields(category.slug, `Invalid cover ${suffix}`))
      .file('coverImage', Buffer.from('not-an-image'), {
        filename: 'cover.gif',
        contentType: 'image/gif',
      })

    response.assertStatus(422)
  })

  test('replaces the stored cover and removes the previous file', async ({ client, assert }) => {
    const suffix = Date.now().toString()
    const { admin, category } = await createFixtures(suffix)
    const previousCover = `previous-${suffix}.png`
    await mkdir(coverDirectory, { recursive: true })
    await writeFile(checklistCoverStorage.path(previousCover), 'old-cover')
    const checklist = await Checklist.create({
      ...checklistFields(category.slug, `Replace cover ${suffix}`),
      categoryId: category.id,
      year: 2026,
      totalCards: 10,
      coverImagePath: previousCover,
    })

    const response = await client
      .put(`/api/v1/checklists/${checklist.id}`)
      .withCsrfToken()
      .withGuard('web')
      .loginAs(admin)
      .fields(checklistFields(category.slug, checklist.name))
      .file('coverImage', pngCover, {
        filename: 'replacement.png',
        contentType: 'image/png',
      })

    response.assertStatus(200)
    await checklist.refresh()
    assert.notEqual(checklist.coverImagePath, previousCover)
    await assert.rejects(() => access(checklistCoverStorage.path(previousCover)))
    await access(checklistCoverStorage.path(checklist.coverImagePath!))

    await checklistCoverStorage.remove(checklist.coverImagePath)
  })

  test('removes a new cover when checklist creation rolls back', async ({ client, assert }) => {
    const suffix = Date.now().toString()
    const { admin, category } = await createFixtures(suffix)
    const before = await storedCovers()
    const response = await client
      .post('/api/v1/checklists')
      .withCsrfToken()
      .withGuard('web')
      .loginAs(admin)
      .fields(checklistFields(category.slug, `Rollback cover ${suffix}`))
      .file('coverImage', pngCover, {
        filename: 'cover.png',
        contentType: 'image/png',
      })
      .file('file', invalidChecklistWorkbook(), {
        filename: 'cards.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

    response.assertStatus(500)
    assert.deepEqual(await storedCovers(), before)
  })
})
