import { createHash } from 'node:crypto'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import PendingExternalIdentity, { type PendingSignupData } from '#models/pending_external_identity'
import ExternalIdentity from '#models/external_identity'
import User from '#models/user'
import { consumeOtp, createOtpChallenge } from '#services/identity_service'

export const facebookBinding = (session: HttpContext['session']) => {
  const nonce = session.get('facebook_pending_nonce')
  return typeof nonce === 'string' ? createHash('sha256').update(nonce).digest('hex') : null
}

export type SocialProvider = 'facebook' | 'google'
const purpose = (provider: SocialProvider) =>
  provider === 'facebook' ? 'facebook_signup' : 'google_signup'

export async function pendingFacebook(session: HttpContext['session'], provider?: SocialProvider) {
  const binding = facebookBinding(session)
  if (!binding) return null
  const query = PendingExternalIdentity.query()
    .where('binding_hash', binding)
    .where('expires_at', '>', new Date())
  if (provider) query.where('provider', provider)
  return query.first()
}

export async function startSocialSignup(
  binding: string,
  provider: SocialProvider,
  mobile: string,
  data: PendingSignupData
) {
  return db.transaction(async (trx) => {
    const pending = await PendingExternalIdentity.query({ client: trx })
      .where('binding_hash', binding)
      .where('provider', provider)
      .where('expires_at', '>', new Date())
      .whereNull('signup_data')
      .forUpdate()
      .first()
    if (!pending) return null
    pending.signupMobile = mobile
    pending.signupData = data
    await pending.save()
    return createOtpChallenge(trx, mobile, purpose(provider))
  })
}

export async function verifySocialSignup(
  binding: string,
  provider: SocialProvider,
  mobile: string,
  otp: string
) {
  return db.transaction(async (trx) => {
    const pending = await PendingExternalIdentity.query({ client: trx })
      .where('binding_hash', binding)
      .where('provider', provider)
      .where('expires_at', '>', new Date())
      .where('signup_mobile', mobile)
      .forUpdate()
      .first()
    if (!pending || !pending.signupData) return { kind: 'expired' as const }
    if (
      await ExternalIdentity.query({ client: trx })
        .where('provider', provider)
        .where('provider_subject', pending.providerSubject)
        .first()
    )
      return { kind: 'conflict' as const }
    const verified = await consumeOtp(mobile, purpose(provider), otp, trx)
    if (!verified.ok) return { kind: 'invalid' as const }
    const data = pending.signupData
    // The pending password is already hashed; do not pass it through User's password hook.
    const user = await User.create(
      {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        mobile,
        governorate: data.governorate,
        isVerified: true,
        lastLoginAt: DateTime.now(),
      },
      { client: trx }
    )
    await User.query({ client: trx }).where('id', user.id).update({ password: data.passwordHash })
    await ExternalIdentity.create(
      { provider, providerSubject: pending.providerSubject, userId: user.id },
      { client: trx }
    )
    await pending.delete()
    return { kind: 'success' as const, id: user.id }
  })
}

export async function linkSocialIdentity(
  binding: string,
  provider: SocialProvider,
  userId: number
) {
  return db.transaction(async (trx) => {
    const pending = await PendingExternalIdentity.query({ client: trx })
      .where('binding_hash', binding)
      .where('provider', provider)
      .where('expires_at', '>', new Date())
      .forUpdate()
      .first()
    if (!pending || pending.signupData) return null
    await ExternalIdentity.create(
      { provider, providerSubject: pending.providerSubject, userId },
      { client: trx }
    )
    const returnTo = pending.returnTo
    await pending.delete()
    return returnTo
  })
}

export function safeFacebookReturn(value: unknown) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    [...value].some(
      (character) =>
        character === '\\' || character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127
    )
  )
    return '/'
  return value
}
