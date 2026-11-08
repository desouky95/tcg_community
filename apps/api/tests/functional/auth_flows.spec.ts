import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const signup = { fullName: 'Auth Collector', username: 'auth_collector', email: 'auth@example.test', mobile: '+201012345678', password: 'password123', passwordConfirmation: 'password123', governorate: 'Cairo' as const }

test.group('OTP verification, resend and password sign in', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('consumes a valid code once, establishes a session and rejects replay', async ({ client, assert }) => {
    const created = await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)
    created.assertStatus(202)
    await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).update({ code_hash: await hash.make('123456') })
    const meUrl = created.request.request.url.replace('/signup', '/me')
    const bootstrap = await fetch(meUrl)
    const initialCookies = bootstrap.headers.getSetCookie().map((value) => value.split(';')[0])
    const csrfCookie = initialCookies.find((value) => value.startsWith('XSRF-TOKEN='))!
    const verified = await fetch(meUrl.replace('/me', '/verify-otp'), {
      method: 'POST', headers: { 'content-type': 'application/json', cookie: initialCookies.join('; '), 'x-xsrf-token': decodeURIComponent(csrfCookie.slice('XSRF-TOKEN='.length)) },
      body: JSON.stringify({ mobile: signup.mobile, otp: '123456' }),
    })
    assert.equal(verified.status, 200)
    const sessionCookies = verified.headers.getSetCookie().map((value) => value.split(';')[0]).join('; ')
    assert.equal((await fetch(meUrl, { headers: { cookie: sessionCookies } })).status, 200)
    assert.isTrue(Boolean((await db.from('users').where('mobile', signup.mobile).first()).is_verified))
    const replay = await client.post('/api/v1/auth/verify-otp').withCsrfToken().json({ mobile: signup.mobile, otp: '123456' })
    replay.assertStatus(401)
  })

  test('limits failed attempts and does not consume a code for a blocked account', async ({ client, assert }) => {
    ;(await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)).assertStatus(202)
    await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).update({ code_hash: await hash.make('123456') })
    for (let i = 0; i < 5; i++) (await client.post('/api/v1/auth/verify-otp').withCsrfToken().json({ mobile: signup.mobile, otp: '654321' })).assertStatus(401)
    ;(await client.post('/api/v1/auth/verify-otp').withCsrfToken().json({ mobile: signup.mobile, otp: '123456' })).assertStatus(401)
    const challenge = await db.from('otp_challenges').where({ mobile: signup.mobile, purpose: 'signup' }).first()
    assert.equal(challenge.attempts, 5)
    await db.from('otp_challenges').where('id', challenge.id).update({ attempts: 0 })
    await db.from('users').where('mobile', signup.mobile).update({ blocked: true })
    ;(await client.post('/api/v1/auth/verify-otp').withCsrfToken().json({ mobile: signup.mobile, otp: '123456' })).assertStatus(403)
    assert.isNull((await db.from('otp_challenges').where('id', challenge.id).first()).consumed_at)
  })

  test('enforces resend cooldown without invalidating the current challenge', async ({ client, assert }) => {
    ;(await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)).assertStatus(202)
    const denied = await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile })
    denied.assertStatus(429)
    assert.isAbove(Number(denied.header('retry-after')), 0)
    assert.lengthOf(await db.from('otp_challenges').where({ mobile: signup.mobile }).whereNull('consumed_at'), 1)
    await db.from('otp_challenges').where({ mobile: signup.mobile }).update({ created_at: DateTime.utc().minus({ minutes: 2 }).toSQL() })
    ;(await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: signup.mobile })).assertStatus(200)
    assert.lengthOf(await db.from('otp_challenges').where({ mobile: signup.mobile }).whereNull('consumed_at'), 1)
  })

  test('signs in verified users by email, mobile or username and rejects bad or blocked accounts', async ({ client }) => {
    ;(await client.post('/api/v1/auth/signup').withCsrfToken().json(signup)).assertStatus(202)
    ;(await client.post('/api/v1/auth/login').withCsrfToken().json({ uid: signup.email, password: signup.password })).assertStatus(403)
    await db.from('users').where('mobile', signup.mobile).update({ is_verified: true })
    for (const uid of [signup.email, signup.mobile, signup.username]) {
      ;(await client.post('/api/v1/auth/login').withCsrfToken().json({ uid, password: signup.password })).assertStatus(200)
    }
    ;(await client.post('/api/v1/auth/login').withCsrfToken().json({ uid: signup.email, password: 'wrongpassword' })).assertStatus(401)
    await db.from('users').where('mobile', signup.mobile).update({ blocked: true })
    ;(await client.post('/api/v1/auth/login').withCsrfToken().json({ uid: signup.email, password: signup.password })).assertStatus(403)
  })
})
