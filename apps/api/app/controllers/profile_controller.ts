import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user'
import { createOtpChallenge, deliverMockOtp, ensureOtpDeliveryAvailable } from '#services/identity_service'
import db from '@adonisjs/lucid/services/db'

export default class ProfileController {
  async update({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticateUsing(['web'])
    const data = await request.validateUsing(updateProfileValidator, {
      meta: { userId: user.id },
    })

    const changedMobile = Boolean(data.mobile && data.mobile !== user.mobile)
    if (changedMobile) ensureOtpDeliveryAvailable()
    const challenge = await db.transaction(async (trx) => {
      user.useTransaction(trx)
      let otp: Awaited<ReturnType<typeof createOtpChallenge>> | undefined
      if (changedMobile && data.mobile) {
        user.isVerified = false
        otp = await createOtpChallenge(trx, data.mobile, 'mobile_change', user.id)
      }
      user.merge(data)
      await user.save()
      return otp
    })
    if (challenge && data.mobile) deliverMockOtp(data.mobile, 'mobile_change', challenge.code)
    const updated = (await serialize(UserTransformer.transform(user))).data

    return response.json({
      data: {
        message: 'Profile updated successfully',
        user: updated,
      },
      message: 'Profile updated successfully',
      user: updated,
    })
  }

  async show({ auth, params, serialize }: HttpContext) {
    const id = params.id
    if (id) {
      const user = await User.findByOrFail('id', id)
      const privacy = JSON.parse(user.privacyPreferences ?? '{}') as { showProfile?: boolean }
      if (user.status !== 'active' || user.blocked || privacy.showProfile === false) return { data: null }
      return serialize({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        governorate: user.governorate,
        isVerified: user.isVerified,
        status: user.status,
      })
    }
    const user = await auth.authenticateUsing(['web'])

    await (user as User).load('checklists', (q) =>
      q.preload('checklist', (c) => c.preload('category').preload('subcategory'))
    )

    return serialize(UserTransformer.transform(user).useVariant('toExtendedProfile'))
  }
}
