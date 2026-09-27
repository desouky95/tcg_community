import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user'
import { issueOtp } from '#services/identity_service'

export default class ProfileController {
  async update({ auth, request, response, serialize }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(updateProfileValidator, {
      meta: { userId: user.id },
    })

    // If mobile changed, unverify user and send a bounded challenge.
    if (data.mobile && data.mobile !== user.mobile) {
      user.isVerified = false
      await issueOtp(data.mobile, 'mobile_change', user.id)
    }

    user.merge(data)
    await user.save()

    return response.json({
      data: {
        message: 'Profile updated successfully',
        user: serialize(UserTransformer.transform(user)),
      },
      message: 'Profile updated successfully',
      user: serialize(UserTransformer.transform(user)),
    })
  }

  async show({ auth, params, serialize }: HttpContext) {
    const id = params.id
    if (id) {
      const user = await User.findByOrFail('id', id)
      await user.load('checklists', (q) => q.preload('checklist').preload('subCategory'))
      return serialize({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        governorate: user.governorate,
        isVerified: user.isVerified,
        status: user.status,
      })
    }
    const user = await auth.authenticate()

    await (user as User).load('checklists', (q) =>
      q.preload('checklist', (c) => c.preload('category').preload('subcategory'))
    )

    return serialize(UserTransformer.transform(user).useVariant('toExtendedProfile'))
  }
}
