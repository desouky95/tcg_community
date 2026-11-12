import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import { sessionFingerprint } from '#services/identity_service'
import { CommerceCustomerService } from '#services/commerce_customer_service'

test.group('Commerce account authorization', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  test('rejects guests and derives the customer from the authenticated user', async ({ client, assert }) => {
    ;(await client.get('/api/v1/account/commerce/orders')).assertStatus(401)
    const user = await User.create({ fullName: 'Commerce Test', username: 'commerce_test', email: 'commerce@example.test', mobile: '+201012345678', password: 'password123', governorate: 'Cairo', isVerified: true, blocked: false, status: 'active', role: 'user', locale: 'en', theme: 'system', version: 1 })
    const session = { auth_web: user.id, auth_password_fingerprint: sessionFingerprint(user.password) }
    const original = CommerceCustomerService.prototype.account
    let observed: { userId: number; payload: Record<string, unknown> } | undefined
    CommerceCustomerService.prototype.account = async function (actor, payload) {
      observed = { userId: actor.id, payload }
      return { status: 200, body: { orders: [], count: 0 } }
    }
    try {
      const response = await client.get('/api/v1/account/commerce/orders?customer_id=other').withSession(session)
      response.assertStatus(200)
      assert.equal(observed?.userId, user.id)
      assert.notProperty(observed!.payload, 'customer_id')
      assert.equal(response.headers()['cache-control'], 'no-store')
      const invalid = await client.post('/api/v1/account/commerce/addresses').withCsrfToken().withSession(session).json({ customer_id: 'other' })
      invalid.assertStatus(422)
    } finally { CommerceCustomerService.prototype.account = original }
  })
})
