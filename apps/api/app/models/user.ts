import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { afterFetch, afterFind, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Review from './review.ts'
import UserChecklist from './user_checklist.ts'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'mobile'],
  passwordColumnName: 'password',
})

export default class User extends compose(UserSchema, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @hasMany(() => Review, { foreignKey: 'targetUserId' })
  declare reviews: HasMany<typeof Review>

  @hasMany(() => UserChecklist, {
    foreignKey: 'userId',
  })
  declare checklists: HasMany<typeof UserChecklist>

  @afterFind()
  static async calculateUserReputation(user: User) {
    await user.load('reviews')
    const positive = user.reviews.filter((review) => review.type === 'positive').length
    const negative = user.reviews.filter((review) => review.type === 'negative').length
    user.$extras.points = positive - negative
    user.$extras.positiveReviewsCount = positive
    user.$extras.negativeReviewsCount = negative
  }
  @afterFetch()
  static calculateReputation(users: User[]) {
    Promise.all(
      users.map(async (user) => {
        await user.load('reviews')
        const positive = user.reviews.filter((review) => review.type === 'positive').length
        const negative = user.reviews.filter((review) => review.type === 'negative').length
        user.$extras.points = positive - negative
        user.$extras.positiveReviewsCount = positive
        user.$extras.negativeReviewsCount = negative
      })
    )
  }
}
