import Category from '#models/category'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Published catalogue categories', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('lists only published parent categories and published children', async ({
    client,
    assert,
  }) => {
    const suffix = Date.now().toString()
    const publishedParent = await Category.create({
      name: `Published parent ${suffix}`,
      parentId: -1,
      status: 'published',
    })
    const draftParent = await Category.create({
      name: `Draft parent ${suffix}`,
      parentId: -1,
      status: 'draft',
    })
    const archivedParent = await Category.create({
      name: `Archived parent ${suffix}`,
      parentId: -1,
      status: 'archived',
    })
    const publishedChild = await Category.create({
      name: `Published child ${suffix}`,
      parentId: publishedParent.id,
      status: 'published',
    })
    const draftChild = await Category.create({
      name: `Draft child ${suffix}`,
      parentId: publishedParent.id,
      status: 'draft',
    })
    const archivedChild = await Category.create({
      name: `Archived child ${suffix}`,
      parentId: publishedParent.id,
      status: 'archived',
    })

    const response = await client.get('/api/v1/categories?limit=100')

    response.assertStatus(200)
    const body = response.body() as {
      data: Array<{ id: number; children: Array<{ id: number }> }>
      meta: { currentPage: number; perPage: number; total: number }
    }
    const category = body.data.find((item) => item.id === publishedParent.id)

    assert.exists(category)
    assert.notInclude(
      body.data.map((item) => item.id),
      draftParent.id
    )
    assert.notInclude(
      body.data.map((item) => item.id),
      archivedParent.id
    )
    assert.deepEqual(
      category!.children.map((item) => item.id),
      [publishedChild.id]
    )
    assert.notInclude(
      category!.children.map((item) => item.id),
      draftChild.id
    )
    assert.notInclude(
      category!.children.map((item) => item.id),
      archivedChild.id
    )
    assert.equal(body.meta.currentPage, 1)
    assert.equal(body.meta.perPage, 100)
    assert.isAtLeast(body.meta.total, 1)
  })
})
