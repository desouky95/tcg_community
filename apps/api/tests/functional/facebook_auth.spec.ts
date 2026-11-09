/* eslint-disable @unicorn/no-await-expression-member */
import { test } from '@japa/runner'

test.group('Facebook authentication boundaries', () => {
  test('rejects completion without a browser-bound pending identity', async ({ client }) => {
    const pending = await client.get('/api/v1/auth/oauth/facebook/pending')
    pending.assertStatus(410)
    const signup = await client.post('/api/v1/auth/oauth/facebook/signup').withCsrfToken().json({})
    signup.assertStatus(410)
    const link = await client.post('/api/v1/auth/oauth/facebook/link').withCsrfToken().json({})
    link.assertStatus(401)
  })

  test('rejects a callback with a mismatched state', async ({ client, assert }) => {
    const response = await client
      .get('/api/v1/auth/oauth/facebook/callback?code=invalid&state=invalid')
      .redirects(0)
    response.assertStatus(302)
    assert.include(response.header('location'), 'facebook_error=failed')
  })
})

test.group('Google authentication boundaries', () => {
  test('rejects missing pending identities and unauthenticated linking', async ({ client }) => {
    ;(await client.get('/api/v1/auth/oauth/google/pending')).assertStatus(410)
    ;(await client.post('/api/v1/auth/oauth/google/signup').withCsrfToken().json({})).assertStatus(
      410
    )
    ;(await client.post('/api/v1/auth/oauth/google/link').withCsrfToken().json({})).assertStatus(
      401
    )
  })

  test('rejects unknown providers and callbacks without the initiating provider', async ({
    client,
    assert,
  }) => {
    ;(await client.get('/api/v1/auth/oauth/unknown/pending')).assertStatus(404)
    const callback = await client
      .get('/api/v1/auth/oauth/google/callback?code=invalid&state=invalid')
      .redirects(0)
    callback.assertStatus(302)
    assert.include(callback.header('location'), 'google_error=failed')
  })
  test('rejects legacy callbacks with state mismatch or denial', async ({ client, assert }) => {
    const session = { social_oauth_provider: 'google', facebook_return_to: '/dashboard?tab=cards' }
    const mismatch = await client
      .get('/api/v1/auth/oauth/google/callback?code=invalid&state=invalid')
      .withSession(session)
      .redirects(0)
    mismatch.assertStatus(302)
    assert.include(mismatch.header('location'), 'google_error=failed')
    assert.include(mismatch.header('location'), 'returnTo=')
    const denied = await client
      .get('/api/v1/auth/oauth/google/callback?error=access_denied')
      .withSession(session)
      .redirects(0)
    denied.assertStatus(302)
    assert.include(denied.header('location'), 'google_error=failed')
  })
})

import testUtils from '@adonisjs/core/services/test_utils'
import hash from '@adonisjs/core/services/hash'
import { createCipheriv, createHash, createHmac, randomBytes } from 'node:crypto'
import SocialAuthAttempt from '#models/social_auth_attempt'
import env from '#start/env'
import { DateTime } from 'luxon'
import PendingExternalIdentity from '#models/pending_external_identity'
import ExternalIdentity from '#models/external_identity'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { sessionFingerprint } from '#services/identity_service'

const signupData = {
  fullName: 'Social Collector',
  username: 'social_collector',
  email: 'social@example.test',
  mobile: '+201012345678',
  password: 'password123',
  passwordConfirmation: 'password123',
  governorate: 'Cairo',
}
const nonce = 'social-test-nonce'
const bindingHash = createHash('sha256').update(nonce).digest('hex')
const browserSession = { facebook_pending_nonce: nonce }

test.group('Social identity Lucid persistence', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  for (const provider of ['facebook', 'google'] as const) {
    test(`${provider} completes signup once and preserves the password hash`, async ({
      client,
      assert,
    }) => {
      await PendingExternalIdentity.create({
        bindingHash,
        provider,
        providerSubject: 'social-subject',
        email: signupData.email,
        returnTo: '/dashboard',
        expiresAt: DateTime.now().plus({ minutes: 20 }),
      })
      const pending = await client
        .get(`/api/v1/auth/oauth/${provider}/pending`)
        .withSession(browserSession)
      pending.assertStatus(200)
      assert.notProperty(pending.body(), 'signupData')
      const signup = await client
        .post(`/api/v1/auth/oauth/${provider}/signup`)
        .withSession(browserSession)
        .withCsrfToken()
        .json(signupData)
      signup.assertStatus(202)
      const stored = await PendingExternalIdentity.findByOrFail('bindingHash', bindingHash)
      assert.isTrue(await hash.verify(stored.signupData!.passwordHash, signupData.password))
      assert.notProperty(stored.serialize(), 'signupData')
      await db
        .from('otp_challenges')
        .where({ mobile: signupData.mobile, purpose: `${provider}_signup` })
        .update({ code_hash: await hash.make('123456') })
      const payload = { mobile: signupData.mobile, otp: '123456' }
      ;(
        await client
          .post(`/api/v1/auth/oauth/${provider}/verify`)
          .withSession(browserSession)
          .withCsrfToken()
          .json({ ...payload, otp: '654321' })
      ).assertStatus(401)
      ;(
        await client
          .post(`/api/v1/auth/oauth/${provider}/verify`)
          .withSession(browserSession)
          .withCsrfToken()
          .json(payload)
      ).assertStatus(200)
      const user = await User.findByOrFail('mobile', signupData.mobile)
      assert.equal(user.password, stored.signupData!.passwordHash)
      assert.isTrue(await hash.verify(user.password!, signupData.password))
      ;(
        await client
          .post('/api/v1/auth/login')
          .withCsrfToken()
          .json({ uid: signupData.email, password: signupData.password })
      ).assertStatus(200)
      assert.exists(
        await ExternalIdentity.query().where('provider', provider).where('user_id', user.id).first()
      )
      assert.isNull(await PendingExternalIdentity.findBy('bindingHash', bindingHash))
      ;(
        await client
          .post(`/api/v1/auth/oauth/${provider}/verify`)
          .withSession(browserSession)
          .withCsrfToken()
          .json(payload)
      ).assertStatus(410)
    })

    test(`${provider} rolls back OTP consumption on a duplicate account`, async ({
      client,
      assert,
    }) => {
      await PendingExternalIdentity.create({
        bindingHash,
        provider,
        providerSubject: 'rollback-subject',
        returnTo: '/',
        expiresAt: DateTime.now().plus({ minutes: 20 }),
      })
      const signup = await client
        .post(`/api/v1/auth/oauth/${provider}/signup`)
        .withSession(browserSession)
        .withCsrfToken()
        .json(signupData)
      signup.assertStatus(202)
      await db
        .from('otp_challenges')
        .where({ mobile: signupData.mobile, purpose: `${provider}_signup` })
        .update({ code_hash: await hash.make('123456') })
      await User.create({
        username: signupData.username,
        mobile: '+201011111111',
        password: 'password123',
      })
      const verify = await client
        .post(`/api/v1/auth/oauth/${provider}/verify`)
        .withSession(browserSession)
        .withCsrfToken()
        .json({ mobile: signupData.mobile, otp: '123456' })
      verify.assertStatus(409)
      const challenge = await db
        .from('otp_challenges')
        .where({ mobile: signupData.mobile, purpose: `${provider}_signup` })
        .first()
      assert.isNull(challenge.consumed_at)
      assert.exists(await PendingExternalIdentity.findBy('bindingHash', bindingHash))
    })

    test(`${provider} enforces binding, expiry and provider isolation`, async ({ client }) => {
      await PendingExternalIdentity.create({
        bindingHash,
        provider,
        providerSubject: 'social-subject',
        returnTo: '/',
        expiresAt: DateTime.now().minus({ minutes: 1 }),
      })
      ;(
        await client.get(`/api/v1/auth/oauth/${provider}/pending`).withSession(browserSession)
      ).assertStatus(410)
      const pending = await PendingExternalIdentity.findByOrFail('bindingHash', bindingHash)
      pending.expiresAt = DateTime.now().plus({ minutes: 20 })
      await pending.save()
      ;(
        await client
          .get(`/api/v1/auth/oauth/${provider}/pending`)
          .withSession({ facebook_pending_nonce: 'different' })
      ).assertStatus(410)
      ;(
        await client
          .get(`/api/v1/auth/oauth/${provider === 'facebook' ? 'google' : 'facebook'}/pending`)
          .withSession(browserSession)
      ).assertStatus(410)
    })

    test(`${provider} links an authenticated account and rejects duplicate identity`, async ({
      client,
      assert,
    }) => {
      const user = await User.create({
        username: 'link_collector',
        mobile: '+201011111111',
        password: 'password123',
        isVerified: true,
      })
      await PendingExternalIdentity.create({
        bindingHash,
        provider,
        providerSubject: 'link-subject',
        returnTo: '/dashboard',
        expiresAt: DateTime.now().plus({ minutes: 20 }),
      })
      const session = {
        ...browserSession,
        facebook_link_user_id: user.id,
        auth_password_fingerprint: sessionFingerprint(user.password),
      }
      const linked = await client
        .post(`/api/v1/auth/oauth/${provider}/link`)
        .loginAs(user)
        .withSession(session)
        .withCsrfToken()
        .json({})
      linked.assertStatus(200)
      assert.equal(linked.body().returnTo, '/dashboard')
      await PendingExternalIdentity.create({
        bindingHash,
        provider,
        providerSubject: 'link-subject',
        returnTo: '/',
        expiresAt: DateTime.now().plus({ minutes: 20 }),
      })
      ;(
        await client
          .post(`/api/v1/auth/oauth/${provider}/link`)
          .loginAs(user)
          .withSession(session)
          .withCsrfToken()
          .json({})
      ).assertStatus(409)
      assert.exists(await PendingExternalIdentity.findBy('bindingHash', bindingHash))
    })
  }
})

test.group('Better Auth social handoff', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  const secret = 'test-bridge-secret-with-at-least-32-characters'
  group.each.setup(() => {
    const original = env.get('SOCIAL_AUTH_BRIDGE_SECRET')
    env.set('SOCIAL_AUTH_BRIDGE_SECRET', secret)
    return () => env.set('SOCIAL_AUTH_BRIDGE_SECRET', original ?? '')
  })
  function assertion(provider: string, attempt: string) {
    const iv = randomBytes(12)
    const key = createHash('sha256').update(`social-assertion-encryption:${secret}`).digest()
    const cipher = createCipheriv('aes-256-gcm', key, iv)
    const body = JSON.stringify({
      nonce: attempt,
      provider,
      subject: 'subject-handoff',
      email: null,
      exp: Date.now() + 60_000,
    })
    const encrypted = Buffer.concat([cipher.update(body), cipher.final()])
    const payload = [
      iv.toString('base64url'),
      encrypted.toString('base64url'),
      cipher.getAuthTag().toString('base64url'),
    ].join('.')
    return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`
  }
  for (const provider of ['facebook', 'google'] as const) {
    test(`${provider} rejects cross-session and replayed handoffs`, async ({ client, assert }) => {
      const attempt = randomBytes(32).toString('hex')
      const hashValue = createHash('sha256').update(attempt).digest('hex')
      await SocialAuthAttempt.create({
        nonceHash: hashValue,
        provider,
        destination: 'public',
        returnTo: '/',
        expiresAt: DateTime.utc().plus({ minutes: 10 }),
      })
      const token = assertion(provider, attempt)
      const url = `/api/v1/auth/oauth/${provider}/finish?assertion=${encodeURIComponent(token)}`
      const foreign = await client
        .get(url)
        .withSession({ facebook_pending_nonce: 'wrong' })
        .redirects(0)
      assert.include(foreign.header('location'), `${provider}_error=failed`)
      const valid = await client
        .get(url)
        .withSession({ facebook_pending_nonce: attempt })
        .redirects(0)
      assert.include(valid.header('location'), `/login/social?provider=${provider}`)
      assert.exists(await PendingExternalIdentity.findBy('bindingHash', hashValue))
      const replay = await client
        .get(url)
        .withSession({ facebook_pending_nonce: attempt })
        .redirects(0)
      assert.include(replay.header('location'), `${provider}_error=failed`)
    })
  }
})
