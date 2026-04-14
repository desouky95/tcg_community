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
import { randomInt } from 'node:crypto'
import axios from 'axios'
import env from '#start/env'
import { DateTime } from 'luxon'
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

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    user.otpCode = otp
    await user.save()

    console.log(`[WHATSAPP MOCK] Sent Login OTP ${otp} to ${mobile}`)
    return response.json({ message: 'OTP sent to WhatsApp' })
  }

  /**
   * Start Registration Flow (Signup)
   */
  async signup({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    // Generate random 4-digit OTP
    // const otp = Math.floor(1000 + Math.random() * 9000).toString()

    const otp = randomInt(100000, 999999).toString()

    // Create user record immediately (unverified)
    const user = await User.create({
      fullName: data.fullName!,
      username: data.username,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      governorate: data.governorate,
      role: 'user',
      blocked: false,
      isVerified: false,
      otpCode: otp,
    })

    axios.post(
      `https://api.textbee.dev/api/v1/gateway/devices/${env.get('TEXT_BEE_DEVICE_ID')}/send-sms`,
      {
        recipients: [data.mobile],
        message: `Your verification code is ${otp}`,
      },
      {
        headers: {
          'x-api-key': env.get('TEXT_BEE_API_KEY'),
        },
      }
    )
    console.log(`[WHATSAPP MOCK] Sent Verification OTP ${otp} to ${data.mobile}`)

    return response.json({
      message: 'OTP sent to WhatsApp',
      user: UserTransformer.transform(user),
    })
  }

  /**
   * Verify OTP (Dual Purpose: Mobile Login OR Signup Completion)
   */
  async verifyOtp({ request, response, serialize }: HttpContext) {
    const { mobile, otp } = await request.validateUsing(verifyOtpValidator)

    const user = await User.query().where('mobile', mobile).first()
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (user.otpCode !== otp) {
      return response.status(401).json({ error: 'Invalid OTP' })
    }

    if (user.blocked) {
      return response.status(403).json({ error: 'User is blocked by admin' })
    }

    // Complete verification
    user.isVerified = true
    user.otpCode = null
    user.lastLoginAt = DateTime.now()
    await user.save()

    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  /**
   * Email/Mobile & Password Login
   */
  async login({ request, response, serialize }: HttpContext) {
    const { uid, password } = await request.validateUsing(loginValidator)

    // Find user by email or mobile
    const user = await User.query().where('email', uid).orWhere('mobile', uid).first()

    if (!user) {
      return response.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password manually
    const isValid = await hash.verify(user.password!, password)
    console.log({ isValid })
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

    if (user.blocked) {
      return response.status(403).json({ error: 'User is blocked by admin' })
    }

    user.lastLoginAt = DateTime.now()
    await user.save()

    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  /**
   * Token Revocation
   */
  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user as any, user.currentAccessToken.identifier)
    }

    return { message: 'Logged out successfully' }
  }
}
