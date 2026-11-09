import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { createHash, randomInt } from 'node:crypto'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export type OtpPurpose = 'signup' | 'facebook_signup' | 'google_signup' | 'login' | 'password_recovery' | 'mobile_change'

export function sessionFingerprint(password: string | null) {
  return createHash('sha256').update(password ?? '').digest('hex')
}

export const IDENTITY_VERSION = 1
export const OTP_RESEND_COOLDOWN_SECONDS = 60

export class OtpCooldownError extends Error {
  constructor(public retryAfterSeconds: number) {
    super('Please wait before requesting another code')
  }
}

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

export function ensureOtpDeliveryAvailable() {
  if (app.inProduction) {
    throw Object.assign(new Error('Verification delivery is unavailable'), { status: 503 })
  }
}

export async function createOtpChallenge(
  trx: TransactionClientContract,
  mobile: string,
  purpose: OtpPurpose,
  userId?: number,
  ttlMinutes = 10,
  cooldownSeconds = 0
) {
  const code = randomInt(100000, 1000000).toString()
  // Serialize issuance for this account so overlapping requests cannot leave two active challenges.
  if (userId !== undefined) await trx.from('users').where('id', userId).forUpdate().first()
  if (cooldownSeconds > 0) {
    const latest = await trx.from('otp_challenges').where({ mobile, purpose }).orderBy('created_at', 'desc').first()
    if (latest) {
      const createdAt = latest.created_at instanceof Date ? DateTime.fromJSDate(latest.created_at) : DateTime.fromSQL(String(latest.created_at), { zone: 'utc' })
      const remaining = Math.ceil(createdAt.plus({ seconds: cooldownSeconds }).diff(DateTime.utc(), 'seconds').seconds)
      if (remaining > 0) throw new OtpCooldownError(remaining)
    }
  }
  await trx.from('otp_challenges').where({ mobile, purpose }).whereNull('consumed_at')
    .update({ consumed_at: DateTime.utc().toSQL() })
  await trx.table('otp_challenges').insert({
    user_id: userId ?? null, mobile, purpose, code_hash: await hash.make(code),
    attempts: 0, max_attempts: 5, expires_at: DateTime.utc().plus({ minutes: ttlMinutes }).toSQL(),
    created_at: DateTime.utc().toSQL(), updated_at: DateTime.utc().toSQL(),
  })
  return { code, expiresInSeconds: ttlMinutes * 60 }
}

export function deliverMockOtp(mobile: string, purpose: OtpPurpose, code: string) {
  ensureOtpDeliveryAvailable()
  if (app.inDev) console.info(`[DEV OTP] ${purpose} code for ${mobile}: ${code}`)
}

export async function issueOtp(mobile: string, purpose: OtpPurpose, userId?: number, ttlMinutes = 10, cooldownSeconds = 0) {
  ensureOtpDeliveryAvailable()
  const challenge = await db.transaction((trx) => createOtpChallenge(trx, mobile, purpose, userId, ttlMinutes, cooldownSeconds))
  deliverMockOtp(mobile, purpose, challenge.code)
  return { expiresInSeconds: challenge.expiresInSeconds }
}

export async function consumeOtp(mobile: string, purpose: OtpPurpose, code: string, transaction?: TransactionClientContract): Promise<{ ok: true } | { ok: false; reason: 'not_found' | 'expired' | 'locked' | 'invalid' }> {
  if (!transaction) return db.transaction((trx) => consumeOtp(mobile, purpose, code, trx))
  const challenge = await transaction
    .from('otp_challenges')
    .where({ mobile, purpose })
    .whereNull('consumed_at')
    .orderBy('created_at', 'desc')
    .forUpdate()
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
    await transaction.from('otp_challenges').where('id', challenge.id).increment('attempts', 1)
    return { ok: false as const, reason: 'invalid' as const }
  }

  await transaction.from('otp_challenges').where('id', challenge.id).update({
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
