import { test } from '@japa/runner'

test.group('Commerce catalog service authentication', () => {
  test('rejects requests without the service key', async ({ client }) => {
    const response = await client.get('/api/v1/internal/card-catalog/collections')
    response.assertStatus(401)
  })

  test('validates the batch request and accepts an empty batch', async ({ client, assert }) => {
    const key = process.env.CARD_CATALOG_API_KEY!
    const invalid = await client.post('/api/v1/internal/card-catalog/cards/batch')
      .header('authorization', `Bearer ${key}`).json({ ids: ['invalid'] })
    invalid.assertStatus(400)
    const empty = await client.post('/api/v1/internal/card-catalog/cards/batch')
      .header('authorization', `Bearer ${key}`).json({ ids: [] })
    empty.assertStatus(200)
    assert.deepEqual(empty.body(), { cards: [] })
  })

  test('rejects invalid collection IDs and pagination', async ({ client }) => {
    const key = process.env.CARD_CATALOG_API_KEY!
    const badId = await client.get('/api/v1/internal/card-catalog/collections/nope')
      .header('authorization', `Bearer ${key}`)
    badId.assertStatus(400)
    const badPage = await client.get('/api/v1/internal/card-catalog/collections').qs({ limit: 101 })
      .header('authorization', `Bearer ${key}`)
    badPage.assertStatus(400)
  })
})
