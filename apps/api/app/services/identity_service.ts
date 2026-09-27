import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { randomInt } from 'node:crypto'
import User from '#models/user'

export type OtpPurpose = 'signup' | 'login' | 'password_recovery' | 'mobile_change'

export const IDENTITY_VERSION = 1

export function requestMeta(request: { header(name: string): string | undefined }) {
  return {
    requestId: request.header('x-request-id') ?? crypto.randomUUID(),
    serverTimestamp: DateTime.utc().toISO(),
  }
}

export function publicUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    governorate: user.governorate,
    isVerified: user.isVerified,
    status: user.status,
    createdAt: user.createdAt,
  }
}

export function errorBody(code: string, message: string, details?: unknown[]) {
  return { error: { code, message, ...(details ? { details } : {}) } }
}

export async function issueOtp(
  mobile: string,
  purpose: OtpPurpose,
  userId?: number,
  ttlMinutes = 10
) {
  const code = randomInt(100000, 1000000).toString()
  await db.transaction(async (trx) => {
    await trx
      .from('otp_challenges')
      .where({ mobile, purpose })
      .whereNull('consumed_at')
      .update({ consumed_at: DateTime.utc().toSQL() })

    await trx.table('otp_challenges').insert({
      user_id: userId ?? null,
      mobile,
      purpose,
      code_hash: await hash.make(code),
      attempts: 0,
      max_attempts: 5,
      expires_at: DateTime.utc().plus({ minutes: ttlMinutes }).toSQL(),
      created_at: DateTime.utc().toSQL(),
      updated_at: DateTime.utc().toSQL(),
    })
  })

  // The provider integration is intentionally asynchronous. The challenge is already durable.
  console.log(`[WHATSAPP MOCK] Sent ${purpose} OTP ${code} to ${mobile}`)
  return { expiresInSeconds: ttlMinutes * 60 }
}

export async function consumeOtp(mobile: string, purpose: OtpPurpose, code: string) {
  const challenge = await db
    .from('otp_challenges')
    .where({ mobile, purpose })
    .whereNull('consumed_at')
    .orderBy('created_at', 'desc')
    .first()

  if (!challenge) return { ok: false as const, reason: 'not_found' as const }
  const expiresAt =
    challenge.expires_at instanceof Date
      ? DateTime.fromJSDate(challenge.expires_at)
      : DateTime.fromISO(String(challenge.expires_at)).isValid
        ? DateTime.fromISO(String(challenge.expires_at))
        : DateTime.fromSQL(String(challenge.expires_at))
  if (expiresAt < DateTime.utc()) {
    return { ok: false as const, reason: 'expired' as const }
  }
  if (challenge.attempts >= challenge.max_attempts) {
    return { ok: false as const, reason: 'locked' as const }
  }

  const valid = await hash.verify(challenge.code_hash, code)
  if (!valid) {
    await db.from('otp_challenges').where('id', challenge.id).increment('attempts', 1)
    return { ok: false as const, reason: 'invalid' as const }
  }

  await db.from('otp_challenges').where('id', challenge.id).update({
    consumed_at: DateTime.utc().toSQL(),
    updated_at: DateTime.utc().toSQL(),
  })
  return { ok: true as const }
}

export async function issueSession(user: User) {
  const token = await User.accessTokens.create(user)
  return token.value!.release()
}

export async function revokeAllSessions(user: User) {
  await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
}
