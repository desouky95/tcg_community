import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { consumeOtp, createOtpChallenge } from '#services/identity_service'

const signup = {
  fullName: 'Test Collector', username: 'registration_test', email: 'registration@example.test',
  mobile: '+201012345678', password: 'password123', passwordConfirmation: 'password123',
  governorate: 'Cairo' as const,
}

test.group('Account registration', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('creates an unverified account and a usable signup challenge', async ({ client, assert }) => {
    const response = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    response.assertStatus(202)
    const body = response.body() as unknown as { data: { challenge: string } }
    assert.equal(body.data.challenge, 'issued')
    assert.notProperty(body.data, 'code')
    const session = await client.get('/api/v1/auth/me')
    session.assertStatus(401)
    const user = await db.from('users').where('username', signup.username).first()
    assert.exists(user)
    assert.isFalse(Boolean(user.is_verified))
    const challenge = await db.from('otp_challenges').where({ user_id: user.id, purpose: 'signup' }).first()
    assert.exists(challenge)
    assert.notEqual(challenge.code_hash, '123456')
    await db.from('otp_challenges').where('id', challenge.id).update({ code_hash: await hash.make('123456') })
    const result = await client.post('/api/v1/auth/verify-otp').withCsrfToken().json({ mobile: signup.mobile, otp: '123456' })
    result.assertStatus(200)
    assert.isTrue(Boolean((await db.from('users').where('id', user.id).first()).is_verified))
  })

  test('rejects invalid and duplicate signup without creating another account', async ({ client, assert }) => {
    const invalid = await client.post('/api/v1/auth/signup').withCsrfToken().json({ ...signup, password: 'short', passwordConfirmation: 'short' })
    invalid.assertStatus(422)
    assert.isNull((await db.from('users').where('username', signup.username).first()) ?? null)
    const first = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    first.assertStatus(202)
    const duplicate = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    duplicate.assertStatus(422)
    assert.lengthOf(await db.from('users').where('username', signup.username), 1)
  })

  test('concurrent registrations cannot create duplicate users', async ({ client, assert }) => {
    const results = await Promise.all([
      client.post('/api/v1/auth/signup').withCsrfToken().json(signup),
      client.post('/api/v1/auth/signup').withCsrfToken().json(signup),
    ])
    assert.deepEqual(results.map((result) => result.status()).sort(), [202, 422])
    assert.lengthOf(await db.from('users').where('username', signup.username), 1)
    assert.lengthOf(await db.from('otp_challenges').where('mobile', signup.mobile), 1)
  })

  test('resends a signup challenge and separates it from login challenges', async ({ client, assert }) => {
    const first = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    first.assertStatus(202)
    const resend = await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile })
    resend.assertStatus(200)
    const challenges = await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).orderBy('id')
    assert.lengthOf(challenges, 2)
    assert.isNotNull(challenges[0].consumed_at)
    await db.from('otp_challenges').where('id', challenges[1].id).update({ code_hash: await hash.make('123456') })
    assert.isFalse((await consumeOtp(signup.mobile, 'login', '123456')).ok)
    assert.isTrue((await consumeOtp(signup.mobile, 'signup', '123456')).ok)
  })

  test('rolls back the challenge when its transaction fails', async ({ assert }) => {
    let reachedFailure = false
    try {
      await db.transaction(async (trx) => {
        const { passwordConfirmation: _confirmation, ...userFields } = signup
        const user = await User.create({ ...userFields, role: 'user', blocked: false, isVerified: false }, { client: trx })
        await createOtpChallenge(trx, signup.mobile, 'signup', user.id)
        reachedFailure = true
        throw new Error('simulated failure')
      })
    } catch { /* expected */ }
    assert.isTrue(reachedFailure)
    assert.lengthOf(await db.from('otp_challenges').where('mobile', signup.mobile), 0)
    assert.lengthOf(await db.from('users').where('username', signup.username), 0)
  })
})
