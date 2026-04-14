import Review from '#models/review'
import User from '#models/user'
import { addReviewValidator } from '#validators/review'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReviewsController {
  async index({ params }: HttpContext) {
    return await Review.query()
      .where('targetUserId', params.id)
      .preload('reviewer')
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { targetUserId, type, comment } = await request.validateUsing(addReviewValidator)

    const targetUser = await User.findOrFail(targetUserId)
    
    // Check for existing review (Upsert)
    let review = await Review.query()
      .where('reviewerId', user.id)
      .where('targetUserId', targetUserId)
      .first()

    if (review) {
      // Update existing review
      review.type = type
      review.comment = comment
      await review.save()
    } else {
      // Create new review
      review = await Review.create({
        reviewerId: user.id,
        targetUserId,
        type,
        comment
      })
    }

    // Recalculate points after update
    await targetUser.loadCount('reviews', (q) => q.where('type', 'positive').as('positiveReviewsCount'))
    await targetUser.loadCount('reviews', (q) => q.where('type', 'negative').as('negativeReviewsCount'))

    const newPoints = (Number(targetUser.$extras.positiveReviewsCount || 0) * 10) - (Number(targetUser.$extras.negativeReviewsCount || 0) * 5)

    return response.status(review.$isPersisted ? 200 : 201).json({ review, newPoints })
  }
}
