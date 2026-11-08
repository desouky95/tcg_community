import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { sessionFingerprint } from '#services/identity_service'
import PrivacyExport, { exportPath } from '#jobs/privacy_export'
import { readFile, rm } from 'node:fs/promises'

async function fixture() {
  return User.create({
    fullName: 'Identity Test',
    username: 'identity_test',
    email: 'identity@example.test',
    mobile: '+201012345678',
    password: 'password123',
    governorate: 'Cairo',
    isVerified: true,
    blocked: false,
    status: 'active',
    role: 'user',
    locale: 'en',
    theme: 'system',
    version: 1,
  })
}
function session(user: User) {
  return { auth_web: user.id, auth_password_fingerprint: sessionFingerprint(user.password) }
}

test.group('Remaining identity flows', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('recovery resets a password and invalidates an earlier browser session', async ({
    client,
    assert,
  }) => {
    const user = await fixture()
    const oldSession = session(user)
    ;(
      await client
        .post('/api/v1/auth/password-recovery')
        .withCsrfToken()
        .json({ mobile: user.mobile })
    ).assertStatus(202)
    await db
      .from('otp_challenges')
      .where({ mobile: user.mobile, purpose: 'password_recovery' })
      .update({ code_hash: await hash.make('123456') })
    ;(
      await client
        .post('/api/v1/auth/password-recovery')
        .withCsrfToken()
        .json({
          mobile: user.mobile,
          otp: '123456',
          password: 'newpassword123',
          passwordConfirmation: 'newpassword123',
        })
    ).assertStatus(200)
    const changed = await User.findOrFail(user.id)
    assert.isTrue(await hash.verify(changed.password!, 'newpassword123'))
    ;(await client.get('/api/v1/auth/me').withSession(oldSession)).assertStatus(401)
    ;(
      await client
        .post('/api/v1/auth/login')
        .withCsrfToken()
        .json({ uid: user.email!, password: 'newpassword123' })
    ).assertStatus(200)
  })

  test('profile updates preserve verification when the number is unchanged and hide private details publicly', async ({
    client,
    assert,
  }) => {
    const user = await fixture()
    const own = await client.get('/api/v1/account/profile').withSession(session(user))
    own.assertStatus(200)
    const updated = await client
      .put('/api/v1/account/profile')
      .withCsrfToken()
      .withSession(session(user))
      .json({
        fullName: 'New Name',
        email: 'identity@example.test',
        mobile: user.mobile,
        governorate: 'Cairo',
        notReadyForSwap: false,
      })
    updated.assertStatus(200)
    assert.isTrue(updated.body().data.user.isVerified)
    const publicProfile = await client.get(`/api/v1/users/${user.id}`)
    publicProfile.assertStatus(200)
    const body = publicProfile.body().data
    assert.notProperty(body, 'email')
    assert.notProperty(body, 'mobile')
    assert.notProperty(body, 'password')
  })

  test('saves preferences and deactivation prevents subsequent access', async ({
    client,
    assert,
  }) => {
    const user = await fixture()
    const saved = await client
      .put('/api/v1/account/preferences')
      .withCsrfToken()
      .withSession(session(user))
      .json({
        locale: 'ar',
        theme: 'dark',
        privacy: { showProfile: false },
        communication: { email: false },
      })
    saved.assertStatus(200)
    const loaded = await client.get('/api/v1/account/preferences').withSession(session(user))
    loaded.assertStatus(200)
    assert.equal((loaded.body() as { data: { locale: string } }).data.locale, 'ar')
    assert.isFalse(
      (loaded.body() as { data: { privacy: { showProfile: boolean } } }).data.privacy.showProfile
    )
    const denied = await client
      .post('/api/v1/account/deactivate')
      .withCsrfToken()
      .withSession(session(user))
      .json({ confirmation: 'no' })
    denied.assertStatus(422)
    ;(
      await client
        .post('/api/v1/account/deactivate')
        .withCsrfToken()
        .withSession(session(user))
        .json({ confirmation: 'DEACTIVATE' })
    ).assertStatus(200)
    ;(await client.get('/api/v1/account/preferences').withSession(session(user))).assertStatus(401)
  })
  test('mobile changes require verification before the updated number becomes verified', async ({
    client,
    assert,
  }) => {
    const user = await fixture()
    const newMobile = '+201112345678'
    const result = await client
      .put('/api/v1/account/profile')
      .withCsrfToken()
      .withSession(session(user))
      .json({ mobile: newMobile })
    result.assertStatus(200)
    assert.isFalse(result.body().data.user.isVerified)
    await db
      .from('otp_challenges')
      .where({ mobile: newMobile, purpose: 'mobile_change' })
      .update({ code_hash: await hash.make('123456') })
    ;(
      await client
        .post('/api/v1/auth/verify-otp')
        .withCsrfToken()
        .json({ mobile: newMobile, otp: '123456' })
    ).assertStatus(200)
    assert.isTrue(Boolean((await db.from('users').where('id', user.id).first()).is_verified))
  })

  test('OTP login accepts an eligible login code', async ({ client }) => {
    const user = await fixture()
    ;(
      await client.post('/api/v1/auth/request-otp').withCsrfToken().json({ mobile: user.mobile })
    ).assertStatus(200)
    await db
      .from('otp_challenges')
      .where({ mobile: user.mobile, purpose: 'login' })
      .update({ code_hash: await hash.make('123456') })
    ;(
      await client
        .post('/api/v1/auth/otp-login')
        .withCsrfToken()
        .json({ mobile: user.mobile, otp: '123456' })
    ).assertStatus(200)
    ;(
      await client
        .post('/api/v1/auth/otp-login')
        .withCsrfToken()
        .json({ mobile: user.mobile, otp: '123456' })
    ).assertStatus(401)
  })

  test('profile anonymization requires confirmation and preserves shared operational records', async ({
    client,
    assert,
  }) => {
    const user = await fixture()
    const other = await User.create({
      username: 'other_identity',
      mobile: '+201112345678',
      role: 'user',
    })
    const [conversation] = await db
      .table('conversations')
      .insert({ user1_id: user.id, user2_id: other.id })
      .returning('id')
    const id = typeof conversation === 'object' ? conversation.id : conversation
    const denied = await client
      .post('/api/v1/account/privacy-deletions')
      .withCsrfToken()
      .withSession(session(user))
      .json({ confirmation: 'DELETE', password: 'incorrect' })
    denied.assertStatus(422)
    const deleted = await client
      .post('/api/v1/account/privacy-deletions')
      .withCsrfToken()
      .withSession(session(user))
      .json({ confirmation: 'DELETE', password: 'password123' })
    deleted.assertStatus(200)
    const anonymous = await db.from('users').where('id', user.id).first()
    assert.equal(anonymous.status, 'anonymized')
    assert.isNull(anonymous.email)
    assert.exists(await db.from('conversations').where('id', id).first())
    ;(await client.get('/api/v1/auth/me').withSession(session(user))).assertStatus(401)
  })

  test('queues a private export and only the owner can download it', async ({ client, assert }) => {
    const user = await fixture()
    const other = await User.create({
      username: 'other_export',
      mobile: '+201112345678',
      password: 'password123',
      role: 'user',
      status: 'active',
    })
    const [conversation] = await db
      .table('conversations')
      .insert({ user1_id: user.id, user2_id: other.id })
      .returning('id')
    const conversationId = typeof conversation === 'object' ? conversation.id : conversation
    await db
      .table('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: other.id,
        content: 'shared conversation',
        type: 'text',
      })
    const queued = await client
      .post('/api/v1/account/privacy-exports')
      .withCsrfToken()
      .withSession(session(user))
      .json({})
    queued.assertStatus(202)
    const id = Number((queued.body() as { data: { id: number } }).data.id)
    try {
      const job = new PrivacyExport()
      job.$hydrate({ exportId: id, userId: user.id }, {} as never)
      await job.execute()
      const content = JSON.parse(await readFile(exportPath(id), 'utf8'))
      assert.equal(content.profile.username, user.username)
      assert.equal(content.messages[0].content, 'shared conversation')
      assert.notProperty(content.profile, 'password')
      ;(
        await client
          .get(`/api/v1/account/privacy-exports/${id}/download`)
          .withSession(session(user))
      ).assertStatus(200)
      ;(
        await client
          .get(`/api/v1/account/privacy-exports/${id}/download`)
          .withSession(session(other))
      ).assertStatus(404)
      await db
        .from('privacy_exports')
        .where('id', id)
        .update({ expires_at: new Date(0) })
      ;(
        await client
          .get(`/api/v1/account/privacy-exports/${id}/download`)
          .withSession(session(user))
      ).assertStatus(404)
    } finally {
      await rm(exportPath(id), { force: true })
    }
  })

  test('a deactivated user can request anonymization using their credentials', async ({
    client,
    assert,
  }) => {
    const user = await fixture()
    ;(
      await client
        .post('/api/v1/account/deactivate')
        .withCsrfToken()
        .withSession(session(user))
        .json({ confirmation: 'DEACTIVATE' })
    ).assertStatus(200)
    ;(
      await client
        .post('/api/v1/auth/deactivated-privacy-deletion')
        .withCsrfToken()
        .json({ mobile: user.mobile, password: 'wrongpassword', confirmation: 'DELETE' })
    ).assertStatus(401)
    ;(
      await client
        .post('/api/v1/auth/deactivated-privacy-deletion')
        .withCsrfToken()
        .json({ mobile: user.mobile, password: 'password123', confirmation: 'DELETE' })
    ).assertStatus(200)
    assert.equal((await db.from('users').where('id', user.id).first()).status, 'anonymized')
  })
})
