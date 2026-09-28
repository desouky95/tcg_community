import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import {
  accountActionValidator,
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
  revokeAllSessions,
} from '#services/identity_service'

export default class IdentityController {
  private success(
    request: HttpContext['request'],
    data: unknown,
    meta: Record<string, unknown> = {}
  ) {
    return { data, ...requestMeta(request), ...meta }
  }

  async otpLogin({ request, response, serialize, auth }: HttpContext) {
    const data = await request.validateUsing(otpLoginValidator)
    const user = await User.query().where('mobile', data.mobile).first()
    if (!user)
      return response.status(401).json(errorBody('invalid_credentials', 'Invalid credentials'))
    const result = await consumeOtp(data.mobile, 'login', data.otp)
    if (!result.ok)
      return response
        .status(401)
        .json(errorBody('invalid_otp', 'Invalid or expired verification code'))
    if (user.blocked || user.status !== 'active') {
      return response
        .status(403)
        .json(errorBody('account_unavailable', 'This account is not available'))
    }
    user.lastLoginAt = DateTime.now()
    user.isVerified = true
    user.version += 1
    await user.save()
    await auth.use('web').login(user)
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
    const user = await User.query().where('mobile', data.mobile).first()
    if (!user) return response.status(404).json(errorBody('not_found', 'Account not found'))

    if (!data.otp || !data.password) {
      await issueOtp(user.mobile, 'password_recovery', user.id)
      return response.status(202).json(this.success(request, { challenge: 'issued' }))
    }

    const result = await consumeOtp(user.mobile, 'password_recovery', data.otp)
    if (!result.ok)
      return response
        .status(401)
        .json(errorBody('invalid_otp', 'Invalid or expired verification code'))
    user.password = await hash.make(data.password)
    user.version += 1
    await user.save()
    await revokeAllSessions(user)
    return response.json(this.success(request, { passwordReset: true }, { version: user.version }))
  }

  async preferences({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(preferencesValidator)
    const currentPrivacy = user.privacyPreferences ? JSON.parse(user.privacyPreferences) : {}
    const currentCommunication = user.communicationPreferences
      ? JSON.parse(user.communicationPreferences)
      : {}
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
    const user = await auth.authenticate()
    const data = await request.validateUsing(accountActionValidator)
    if (data.expectedVersion !== undefined && data.expectedVersion !== user.version) {
      return response
        .status(409)
        .json(errorBody('stale_version', 'Account changed; refresh and try again'))
    }
    user.status = 'deactivated'
    user.deactivatedAt = DateTime.now()
    user.version += 1
    await user.save()
    await revokeAllSessions(user)
    return response.json(this.success(request, { status: user.status }, { version: user.version }))
  }

  async exportPersonalData({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const expiresAt = DateTime.utc().plus({ days: 7 })
    const [id] = await db.table('privacy_exports').insert({
      user_id: user.id,
      status: 'queued',
      expires_at: expiresAt.toSQL(),
      created_at: DateTime.utc().toSQL(),
      updated_at: DateTime.utc().toSQL(),
    })
    return response.status(202).json(
      this.success(request, {
        id,
        status: 'queued',
        expiresAt,
      })
    )
  }

  async deletePersonalData({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(accountActionValidator)
    if (data.expectedVersion !== undefined && data.expectedVersion !== user.version) {
      return response
        .status(409)
        .json(errorBody('stale_version', 'Account changed; refresh and try again'))
    }
    await db.transaction(async (trx) => {
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
      await trx.from('auth_access_tokens').where('tokenable_id', user.id).delete()
    })
    return response.json(this.success(request, { status: user.status }, { version: user.version }))
  }

  async viewOwnProfile({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticate()
    return response.json(
      this.success(request, await serialize(UserTransformer.transform(user)), {
        version: user.version,
      })
    )
  }

  async editProfile({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticate()
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
