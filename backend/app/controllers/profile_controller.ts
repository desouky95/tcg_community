import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user'
import { randomInt } from 'node:crypto'
import axios from 'axios'
import env from '#start/env'

export default class ProfileController {
  async update({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(updateProfileValidator, {
      meta: { userId: user.id },
    })

    // If mobile changed, unverify user and send OTP
    if (data.mobile && data.mobile !== user.mobile) {
      const otp = randomInt(100000, 999999).toString()
      user.isVerified = false
      user.otpCode = otp

      // Send SMS via TextBee
      try {
        await axios.post(
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
      } catch (error) {
        console.error('Failed to send OTP SMS', error)
      }
    }

    user.merge(data)
    await user.save()

    return response.json({
      message: 'Profile updated successfully',
      user: serialize(UserTransformer.transform(user)),
    })
  }

  async show({ auth, params, serialize }: HttpContext) {
    const id = params.id
    if (id) {
      const user = await User.findByOrFail('id', id)
      await user.load('checklists', (q) => q.preload('checklist').preload('subCategory'))
      return serialize(UserTransformer.transform(user).useVariant('toExtendedProfile'))
    }
    const user = await auth.authenticate()

    await (user as User).load('checklists', (q) =>
      q.preload('checklist', (c) => c.preload('category').preload('subcategory'))
    )

    return serialize(UserTransformer.transform(user).useVariant('toExtendedProfile'))
  }
}
