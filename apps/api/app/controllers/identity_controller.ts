import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import PrivacyExport, { exportPath } from '#jobs/privacy_export'
import CleanupPrivacyExport from '#jobs/privacy_export_cleanup'
import { access, rm } from 'node:fs/promises'
import { recomputeForUser } from '#services/collection_progress_service'
import UserTransformer from '#transformers/user_transformer'
import {
  accountActionValidator,
  deactivatedDeletionValidator,
  otpLoginValidator,
  passwordRecoveryValidator,
  preferencesValidator,
  profileVersionValidator,
} from '#validators/identity'
import {
  consumeOtp,
  errorBody,
  issueOtp,
  requestMeta,
  sessionFingerprint,
  OTP_RESEND_COOLDOWN_SECONDS,
  OtpCooldownError,
} from '#services/identity_service'

export default class IdentityController {
  private success(
    request: HttpContext['request'],
    data: unknown,
    meta: Record<string, unknown> = {}
  ) {
    return { data, ...requestMeta(request), ...meta }
  }

  async otpLogin({ request, response, serialize, auth, session }: HttpContext) {
    const data = await request.validateUsing(otpLoginValidator)
    const outcome = await db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('mobile', data.mobile).forUpdate().first()
      if (!user || !user.isVerified || user.blocked || user.status !== 'active') return null
      const result = await consumeOtp(data.mobile, 'login', data.otp, trx)
      if (!result.ok) return null
      user.lastLoginAt = DateTime.now()
      user.version += 1
      await user.save()
      return user
    })
    if (!outcome) return response.status(401).json(errorBody('invalid_otp', 'Invalid or expired verification code'))
    const user = outcome
    await auth.use('web').login(user)
    session.put('auth_password_fingerprint', sessionFingerprint(user.password))
    return response.json(
      this.success(
        request,
        {
          user: await serialize(UserTransformer.transform(user)),
        },
        { version: user.version }
      )
    )
  }

  async recoverPassword({ request, response }: HttpContext) {
    const data = await request.validateUsing(passwordRecoveryValidator)
    if (Boolean(data.otp) !== Boolean(data.password) || (data.password && !data.passwordConfirmation)) {
      return response.status(422).json(errorBody('validation_error', 'Provide the code, password and confirmation together'))
    }
    if (!data.otp || !data.password) {
      const user = await User.query().where('mobile', data.mobile).first()
      if (user?.isVerified && !user.blocked && user.status === 'active') {
        try {
          await issueOtp(user.mobile, 'password_recovery', user.id, 10, OTP_RESEND_COOLDOWN_SECONDS)
        } catch (error) {
          if (error instanceof OtpCooldownError) {
            response.header('Retry-After', String(error.retryAfterSeconds))
            return response.status(429).json(errorBody('otp_cooldown', 'Please wait before requesting another code'))
          }
          throw error
        }
      }
      return response.status(202).json(this.success(request, { challenge: 'requested' }))
    }
    const result = await db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('mobile', data.mobile).forUpdate().first()
      if (!user || !user.isVerified || user.blocked || user.status !== 'active') return false
      const verified = await consumeOtp(user.mobile, 'password_recovery', data.otp!, trx)
      if (!verified.ok) return false
      user.password = data.password!
      user.version += 1
      await user.save()
      await trx.from('auth_access_tokens').where('tokenable_id', user.id).delete()
      return true
    })
    if (!result) return response.status(401).json(errorBody('invalid_otp', 'Invalid or expired verification code'))
    return response.json(this.success(request, { passwordReset: true }))
  }

  async getPreferences({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    return response.json(this.success(request, {
      locale: user.locale, theme: user.theme,
      privacy: JSON.parse(user.privacyPreferences ?? '{}'),
      communication: JSON.parse(user.communicationPreferences ?? '{}'),
    }, { version: user.version }))
  }

  async preferences({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const data = await request.validateUsing(preferencesValidator)
    const currentPrivacy = user.privacyPreferences ? JSON.parse(user.privacyPreferences) : {}
    const currentCommunication = user.communicationPreferences
      ? JSON.parse(user.communicationPreferences)
      : {}
    await db.transaction(async (trx) => {
      user.useTransaction(trx)
      user.merge({
      locale: data.locale ?? user.locale,
      theme: data.theme ?? user.theme,
      privacyPreferences: data.privacy
        ? JSON.stringify({ ...currentPrivacy, ...data.privacy })
        : user.privacyPreferences,
      communicationPreferences: data.communication
        ? JSON.stringify({ ...currentCommunication, ...data.communication })
        : user.communicationPreferences,
      version: user.version + 1,
    })
      await user.save()
      if (data.privacy) await recomputeForUser(trx, user.id)
    })
    return response.json(
      this.success(
        request,
        {
          locale: user.locale,
          theme: user.theme,
          privacy: JSON.parse(user.privacyPreferences ?? '{}'),
          communication: JSON.parse(user.communicationPreferences ?? '{}'),
        },
        { version: user.version }
      )
    )
  }

  async deactivate({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const data = await request.validateUsing(accountActionValidator)
    if (data.confirmation !== 'DEACTIVATE') return response.status(422).json(errorBody('confirmation_required', 'Type DEACTIVATE to confirm'))
    if (data.expectedVersion !== undefined && data.expectedVersion !== user.version) {
      return response
        .status(409)
        .json(errorBody('stale_version', 'Account changed; refresh and try again'))
    }
    await db.transaction(async (trx) => {
      user.useTransaction(trx)
      user.status = 'deactivated'
      user.deactivatedAt = DateTime.now()
      user.version += 1
      await user.save()
      await trx.from('auth_access_tokens').where('tokenable_id', user.id).delete()
      await recomputeForUser(trx, user.id)
    })
    await auth.use('web').logout()
    return response.json(this.success(request, { status: user.status }, { version: user.version }))
  }

  async exportPersonalData({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const expiresAt = DateTime.utc().plus({ days: 7 })
    const [record] = await db.table('privacy_exports').insert({
      user_id: user.id, status: 'queued', expires_at: expiresAt.toSQL(),
      created_at: DateTime.utc().toSQL(), updated_at: DateTime.utc().toSQL(),
    }).returning('id')
    const id = typeof record === 'object' ? record.id : record
    try {
      await CleanupPrivacyExport.dispatch({ exportId: Number(id) }).in('7d')
      await PrivacyExport.dispatch({ exportId: Number(id), userId: user.id })
    } catch {
      await db.from('privacy_exports').where('id', id).update({ status: 'failed' })
      return response.status(503).json(errorBody('export_unavailable', 'Could not queue the export'))
    }
    return response.status(202).json(this.success(request, { id, status: 'queued', expiresAt }))
  }

  async listPersonalExports({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const rows = await db.from('privacy_exports').where('user_id', user.id).select('id', 'status', 'expires_at', 'created_at').orderBy('created_at', 'desc').limit(20)
    return response.json(this.success(request, rows.map((row) => ({ id: row.id, status: DateTime.fromJSDate(row.expires_at) <= DateTime.utc() ? 'expired' : row.status, expiresAt: row.expires_at, createdAt: row.created_at }))))
  }

  async getPersonalExport({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id <= 0) return response.notFound()
    const record = await db.from('privacy_exports').where({ id, user_id: user.id }).first()
    if (!record) return response.notFound()
    const expired = DateTime.fromJSDate(record.expires_at) <= DateTime.utc()
    if (expired) await rm(exportPath(id), { force: true })
    return response.json(this.success(request, { id, status: expired ? 'expired' : record.status, expiresAt: record.expires_at }))
  }

  async downloadPersonalExport({ auth, params, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id <= 0) return response.notFound()
    const record = await db.from('privacy_exports').where({ id, user_id: user.id }).first()
    if (!record || record.status !== 'ready' || DateTime.fromJSDate(record.expires_at) <= DateTime.utc()) return response.notFound()
    try { await access(exportPath(id)) } catch { return response.notFound() }
    response.header('Cache-Control', 'no-store')
    response.header('Content-Disposition', 'attachment; filename="nextpull-personal-data.json"')
    return response.download(exportPath(id))
  }

  async deletePersonalData({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const data = await request.validateUsing(accountActionValidator)
    if (data.confirmation !== 'DELETE' || !data.password || !user.password || !(await hash.verify(user.password, data.password))) {
      return response.status(422).json(errorBody('confirmation_required', 'Enter your password and type DELETE to confirm'))
    }
    if (data.expectedVersion !== undefined && data.expectedVersion !== user.version) {
      return response
        .status(409)
        .json(errorBody('stale_version', 'Account changed; refresh and try again'))
    }
    await this.anonymize(user)
    await auth.use('web').logout()
    return response.json(this.success(request, { status: user.status }, { version: user.version }))
  }

  async deleteDeactivatedAccount({ request, response }: HttpContext) {
    const data = await request.validateUsing(deactivatedDeletionValidator)
    const user = await User.query().where('mobile', data.mobile).first()
    if (data.confirmation !== 'DELETE' || !user || user.status !== 'deactivated' || !user.password || !(await hash.verify(user.password, data.password))) {
      return response.status(401).json(errorBody('invalid_credentials', 'Could not verify this account'))
    }
    await this.anonymize(user)
    return response.json(this.success(request, { status: 'anonymized' }))
  }

  private async anonymize(user: User) {
    await db.transaction(async (trx) => {
      await trx.from('users').where('id', user.id).forUpdate().first()
      const exports = await trx.from('privacy_exports').where('user_id', user.id).select('id')
      for (const record of exports) await rm(exportPath(Number(record.id)), { force: true })
      await trx.from('privacy_exports').where('user_id', user.id).update({ status: 'cancelled', updated_at: DateTime.utc().toSQL() })
      user.fullName = 'Deleted collector'
      user.username = `deleted-${user.id}`
      user.email = null
      user.mobile = `deleted-${user.id}`
      user.password = null
      user.governorate = null
      user.privacyPreferences = null
      user.communicationPreferences = null
      user.status = 'anonymized'
      user.isVerified = false
      user.anonymizedAt = DateTime.now()
      user.version += 1
      await user.useTransaction(trx).save()
      await recomputeForUser(trx, user.id)
      await trx.from('auth_access_tokens').where('tokenable_id', user.id).delete()
      await trx.from('otp_challenges').where('user_id', user.id).delete()
    })
  }

  async viewOwnProfile({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    return response.json(
      this.success(request, await serialize(UserTransformer.transform(user)), {
        version: user.version,
      })
    )
  }

  async editProfile({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const data = await request.validateUsing(profileVersionValidator, { meta: { userId: user.id } })
    if (data.expectedVersion !== undefined && data.expectedVersion !== user.version) {
      return response
        .status(409)
        .json(errorBody('stale_version', 'Profile changed; refresh and try again'))
    }
    if (data.mobile && data.mobile !== user.mobile) {
      user.isVerified = false
      await issueOtp(data.mobile, 'mobile_change', user.id)
    }
    user.merge({ ...data, version: user.version + 1 })
    await user.save()
    return response.json(
      this.success(request, await serialize(UserTransformer.transform(user)), {
        version: user.version,
      })
    )
  }
}
