import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { consumeOtp } from '#services/identity_service'

const signup = {
  fullName: 'OTP Collector', username: 'otp_collector', email: 'otp@example.test',
  mobile: '+201012345678', password: 'password123', passwordConfirmation: 'password123',
  governorate: 'Cairo' as const,
}

test.group('Signup OTP request', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('signup issues a hashed challenge with the configured lifetime and attempt limit', async ({ client, assert }) => {
    const before = DateTime.utc()
    const response = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    response.assertStatus(202)
    const body = response.body() as unknown as { data: { challenge: string; expiresInSeconds: number } }
    assert.equal(body.data.challenge, 'issued')
    assert.equal(body.data.expiresInSeconds, 600)
    assert.notProperty(body.data, 'code')
    const challenge = await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).first()
    assert.exists(challenge)
    assert.equal(challenge.attempts, 0)
    assert.equal(challenge.max_attempts, 5)
    assert.isNull(challenge.consumed_at)
    const expiry = DateTime.fromJSDate(challenge.expires_at)
    assert.isAtLeast(expiry.diff(before, 'seconds').seconds, 599)
    assert.isAtMost(expiry.diff(before, 'seconds').seconds, 605)
    assert.notMatch(challenge.code_hash, /^\d{6}$/)
  })

  test('expired and exhausted challenges cannot verify the account', async ({ client, assert }) => {
    const response = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    response.assertStatus(202)
    const challenge = await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).first()
    await db.from('otp_challenges').where('id', challenge.id).update({
      code_hash: await hash.make('123456'), expires_at: DateTime.utc().minus({ minutes: 1 }).toSQL(),
    })
    assert.deepEqual(await consumeOtp(signup.mobile, 'signup', '123456'), { ok: false, reason: 'expired' })
    await db.from('otp_challenges').where('id', challenge.id).update({
      expires_at: DateTime.utc().plus({ minutes: 5 }).toSQL(), attempts: 5,
    })
    assert.deepEqual(await consumeOtp(signup.mobile, 'signup', '123456'), { ok: false, reason: 'locked' })
    assert.isFalse(Boolean((await db.from('users').where('mobile', signup.mobile).first()).is_verified))
  })

  test('overlapping requests leave one active signup challenge', async ({ client, assert }) => {
    const created = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    created.assertStatus(202)
    await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).update({ created_at: DateTime.utc().minus({ minutes: 2 }).toSQL() })
    const results = await Promise.all([
      client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile }),
      client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile }),
    ])
    assert.deepEqual(results.map((result) => result.status()).sort(), [200, 429])
    const active = await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).whereNull('consumed_at')
    assert.lengthOf(active, 1)
  })

  test('rejects malformed requests and unavailable accounts without issuing a challenge', async ({ client, assert }) => {
    const invalid = await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: 'invalid' })
    invalid.assertStatus(422)
    const unknown = await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile })
    unknown.assertStatus(404)
    const created = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    created.assertStatus(202)
    await db.from('users').where('mobile', signup.mobile).update({ blocked: true })
    const blocked = await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile })
    blocked.assertStatus(403)
    assert.lengthOf(await db.from('otp_challenges').where('mobile', signup.mobile), 1)
  })
})
