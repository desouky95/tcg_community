import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async listUsers({ serialize }: HttpContext) {
    return serialize(UserTransformer.transform(await User.query(),))
  }

  async blockUser({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const { blocked } = request.only(['blocked'])

    user.blocked = !!blocked
    await user.save()

    return response.json(user)
  }
}
