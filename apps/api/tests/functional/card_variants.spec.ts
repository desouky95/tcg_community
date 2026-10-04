import Card from '#models/card'
import Category from '#models/category'
import Checklist from '#models/checklist'
import User from '#models/user'
import UserChecklist from '#models/user_checklist'
import { ChecklistService } from '#services/checklist_service'
import { updateOrCreateUserChecklistValidator } from '#validators/user_checklist'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Card variants API', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('lists only bases and returns the full non-archived family from either id', async ({
    client,
    assert,
  }) => {
    const category = await Category.create({ name: `Variants ${Date.now()}`, parentId: -1 })
    const checklist = await Checklist.create({
      categoryId: category.id,
      name: 'Variant test checklist',
      year: 2026,
      type: 'sticker',
      totalCards: 1,
    })
    const base = await Card.create({
      checklistId: checklist.id,
      number: '10',
      name: 'Base card',
      type: 'Base',
      section: 'Team',
      order: 0,
      variant: null,
      baseCardId: null,
    })
    const blue = await Card.create({
      checklistId: checklist.id,
      number: '10bu',
      name: 'Blue card',
      type: 'Parallel',
      section: 'Team',
      order: 1,
      variant: 'Blue',
      baseCardId: base.id,
    })
    const archived = await Card.create({
      checklistId: checklist.id,
      number: '10gr',
      name: 'Green card',
      type: 'Parallel',
      section: 'Team',
      order: 2,
      variant: 'Green',
      baseCardId: base.id,
      status: 'archived',
    })

    const list = await client.get('/api/v1/catalogue/cards').qs({ checklistId: checklist.id })
    list.assertStatus(200)
    const listBody = list.body() as { data: Array<{ id: number }> }
    assert.deepEqual(
      listBody.data.map((card) => card.id),
      [base.id]
    )

    const checklistResponse = await client.get(`/api/v1/checklists/${checklist.id}`)
    checklistResponse.assertStatus(200)
    const checklistBody = checklistResponse.body() as { data: { cards: Array<{ id: number }> } }
    assert.deepEqual(
      checklistBody.data.cards.map((card) => card.id),
      [base.id]
    )

    for (const selected of [base, blue]) {
      const detail = await client.get(`/api/v1/catalogue/cards/${selected.id}`)
      detail.assertStatus(200)
      assert.equal(detail.body().data.card.id, selected.id)
      assert.equal(detail.body().data.baseCard.id, base.id)
      assert.deepEqual(
        detail.body().data.variants.map((card: { id: number }) => card.id),
        [blue.id]
      )
    }

    const archivedResponse = await client.get(`/api/v1/catalogue/cards/${archived.id}`)
    archivedResponse.assertStatus(404)
  })

  test('returns 404 for a variant whose base is archived', async ({ client }) => {
    const category = await Category.create({ name: `Archived ${Date.now()}`, parentId: -1 })
    const checklist = await Checklist.create({
      categoryId: category.id,
      name: 'Archived base checklist',
      year: 2026,
      type: 'card',
      totalCards: 1,
    })
    const base = await Card.create({
      checklistId: checklist.id,
      number: '1',
      name: 'Archived base',
      order: 0,
      variant: null,
      baseCardId: null,
      status: 'archived',
    })
    const variant = await Card.create({
      checklistId: checklist.id,
      number: '1bu',
      name: 'Blue variant',
      order: 1,
      variant: 'Blue',
      baseCardId: base.id,
    })

    const response = await client.get(`/api/v1/catalogue/cards/${variant.id}`)
    response.assertStatus(404)
  })

  test('allows the same source number in different checklists', async ({ assert }) => {
    const category = await Category.create({ name: `Independent ${Date.now()}`, parentId: -1 })
    const checklistData = {
      categoryId: category.id,
      year: 2026,
      type: 'card',
      totalCards: 1,
    }
    const first = await Checklist.create({ ...checklistData, name: 'First checklist' })
    const second = await Checklist.create({ ...checklistData, name: 'Second checklist' })

    await Card.create({ checklistId: first.id, number: '10', name: 'First', order: 0 })
    await Card.create({ checklistId: second.id, number: '10', name: 'Second', order: 0 })

    assert.lengthOf(
      await Card.query().where('number', '10').whereIn('checklistId', [first.id, second.id]),
      2
    )
  })

  test('keeps user progress and recalculated statistics base-card-only', async ({ assert }) => {
    const suffix = Date.now().toString()
    const user = await User.create({ username: `variant-${suffix}`, mobile: suffix })
    const category = await Category.create({ name: `Progress ${suffix}`, parentId: -1 })
    const checklist = await Checklist.create({
      categoryId: category.id,
      name: 'Progress checklist',
      year: 2026,
      type: 'sticker',
      totalCards: 1,
    })
    const base = await Card.create({
      checklistId: checklist.id,
      number: '10',
      name: 'Base',
      order: 0,
    })
    const variant = await Card.create({
      checklistId: checklist.id,
      number: '10bu',
      name: 'Blue',
      order: 1,
      variant: 'Blue',
      baseCardId: base.id,
      needCount: 7,
      holdCount: 8,
      offerCount: 9,
      ratio: '0.78',
    })

    await checklist.load('cards', (cards) => cards.whereNull('variant'))
    const validCardNumbers = checklist.cards.map((card) => card.number)
    const progress = await updateOrCreateUserChecklistValidator.validate(
      { missingList: '10bu,10', collectedList: '10bu,10', duplicatesList: '10bu,10' },
      { meta: { cards: validCardNumbers } }
    )
    assert.notInclude(progress.missingList!, '10bu')
    assert.notInclude(progress.collectedList!, '10bu')
    assert.notInclude(progress.duplicatesList!, '10bu')

    await UserChecklist.updateOrCreate(
      { userId: user.id, checklistId: checklist.id },
      { missingList: '10', collectedList: '10', duplicatesList: '10' }
    )
    await new ChecklistService().reCalculate(checklist.id.toString())
    await base.refresh()
    await variant.refresh()

    assert.equal(base.needCount, 1)
    assert.equal(base.holdCount, 1)
    assert.equal(base.offerCount, 1)
    assert.equal(variant.needCount, 7)
    assert.equal(variant.holdCount, 8)
    assert.equal(variant.offerCount, 9)
  })
})
