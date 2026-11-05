import User from '#models/user'
import {
  requestOtpValidator,
  signupValidator,
  verifyOtpValidator,
  loginValidator,
} from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { consumeOtp, errorBody, issueOtp, requestMeta, createOtpChallenge, deliverMockOtp, ensureOtpDeliveryAvailable } from '#services/identity_service'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'

export default class AuthController {
  /**
   * Request OTP for Mobile Login
   */
  async requestOtp({ request, response }: HttpContext) {
    const { mobile } = await request.validateUsing(requestOtpValidator)

    // Check if user exists for login flow
    const user = await User.query().where('mobile', mobile).first()
    if (!user) {
      return response
        .status(404)
        .json({ error: 'No account found with this mobile number. Please sign up first.' })
    }

    if (user.status !== 'active' || user.blocked) {
      return response
        .status(403)
        .json(errorBody('account_unavailable', 'This account is not available'))
    }
    if (app.inProduction) return response.status(503).json(errorBody('delivery_unavailable', 'Verification delivery is unavailable'))
    const challenge = await issueOtp(mobile, user.isVerified ? 'login' : 'signup', user.id)
    return response.json({ data: { challenge: 'issued', ...challenge }, ...requestMeta(request) })
  }

  /**
   * Start Registration Flow (Signup)
   */
  async signup({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    if (app.inProduction) return response.status(503).json(errorBody('delivery_unavailable', 'Verification delivery is unavailable'))
    ensureOtpDeliveryAvailable()
    try {
      const { user, challenge } = await db.transaction(async (trx) => {
        const user = await User.create({
          fullName: data.fullName, username: data.username, email: data.email,
          mobile: data.mobile, password: data.password, governorate: data.governorate,
          role: 'user', blocked: false, isVerified: false, otpCode: null,
          status: 'active', locale: 'en', theme: 'system', version: 1,
        }, { client: trx })
        const challenge = await createOtpChallenge(trx, data.mobile, 'signup', user.id)
        return { user, challenge }
      })
      deliverMockOtp(data.mobile, 'signup', challenge.code)
      return response.status(202).send(await serialize({
        challenge: 'issued', expiresInSeconds: challenge.expiresInSeconds,
        user: UserTransformer.transform(user), ...requestMeta(request),
      }))
    } catch (error) {
      const candidate = error as { code?: string; constraint?: string }
      if (candidate.code === '23505' && /^users_(username|email|mobile)_unique$/.test(candidate.constraint ?? '')) {
        const field = candidate.constraint!.split('_')[1]
        return response.status(422).json(errorBody('validation_error', 'Request validation failed', [
          { field, message: 'This value is already in use', code: 'unique' },
        ]))
      }
      throw error
    }
  }

  /**
   * Verify OTP (Dual Purpose: Mobile Login OR Signup Completion)
   */
  async verifyOtp({ request, response, serialize, auth }: HttpContext) {
    const { mobile, otp } = await request.validateUsing(verifyOtpValidator)

    const user = await User.query().where('mobile', mobile).first()
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    let result = await consumeOtp(mobile, user.isVerified ? 'login' : 'signup', otp)
    if (!result.ok && !user.isVerified) {
      result = await consumeOtp(mobile, 'mobile_change', otp)
    }
    if (!result.ok) {
      return response
        .status(401)
        .json(errorBody('invalid_otp', 'Invalid or expired verification code'))
    }

    if (user.blocked || user.status !== 'active') {
      return response
        .status(403)
        .json(errorBody('account_unavailable', 'This account is not available'))
    }

    // Complete verification
    user.isVerified = true
    user.otpCode = null
    user.lastLoginAt = DateTime.now()
    user.version += 1
    await user.save()
    await auth.use('web').login(user)
    return serialize({
      user: UserTransformer.transform(user),
      ...requestMeta(request),
      version: user.version,
    })
  }

  /**
   * Email/Mobile & Password Login
   */
  async login({ request, response, serialize, auth }: HttpContext) {
    const { uid, password } = await request.validateUsing(loginValidator)

    // Find user by email or mobile
    const user = await User.query().where('email', uid).orWhere('mobile', uid).first()

    if (!user) {
      return response.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password manually
    const isValid = await hash.verify(user.password!, password)
    if (!isValid) {
      return response.status(401).json({ error: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      return response.status(403).json({
        error: 'Account not verified. Please verify your mobile number.',
        mobile: user.mobile,
        unverified: true,
      })
    }

    if (user.blocked || user.status !== 'active') {
      return response
        .status(403)
        .json(errorBody('account_unavailable', 'This account is not available'))
    }

    user.lastLoginAt = DateTime.now()
    await user.save()

    user.version += 1
    await user.save()
    await auth.use('web').login(user)

    return serialize({
      data: UserTransformer.transform(user),
      // token,
      ...requestMeta(request),
      version: user.version,
    })
  }

  /**
   * Token Revocation
   */
  async logout({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await auth.use('web').logout()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user as any, user.currentAccessToken.identifier)
    }

    return response.json({ data: { loggedOut: true }, ...requestMeta(request) })
  }
  async me({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    return response.json({
      data: user,
      ...requestMeta(request),
      version: user.version,
    })
  }
}
