import type User from '#models/user'
import { BaseTransformer, Collection } from '@adonisjs/core/transformers'
import UserChecklistTransformer from './user_checklist_transformer.ts'
import Category from '#models/category'
import UserChecklist from '#models/user_checklist'
import CategoryTransformer from './category_transformer.ts'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'fullName',
        'username',
        'mobile',
        'email',
        'role',
        'blocked',
        'username',
        'governorate',
        'lastLoginAt',
        'createdAt',
        'updatedAt',
      ]),
      ...this.resource.$extras,

      // checklists: UserChecklistTransformer.transform(this.resource.checklists),
    }
  }
  toProfile() {
    return {
      ...this.toObject(),
      positiveReviewsCount: Number(this.resource.$extras.positiveReviewsCount || 0),
      negativeReviewsCount: Number(this.resource.$extras.negativeReviewsCount || 0),
      points: Number(this.resource.$extras.points || 0),
      checklists: UserChecklistTransformer.transform(this.resource.checklists),
    }
  }

  async toExtendedProfile() {
    const userCollections = await UserChecklist.query()
      .where('user_id', this.resource.id)
      .preload('checklist', (q) => q.preload('category').preload('subcategory'))
      .where('user_id', this.resource.id)
    const userCategories = userCollections
      .map((_) => _.checklist.categoryId)
      .filter((_) => _) as number[]
    const userSubCategories = userCollections
      .map((_) => _.checklist.subcategoryId)
      .map((_) => _) as number[]

    const categories = await Category.query()
      .whereIn('id', userCategories)
      .preload('children', (q) =>
        q
          .preload('userChecklists', (uc) =>
            uc.where('user_id', this.resource.id).preload('checklist')
          )
          .whereIn('id', userSubCategories)
      )
    return { ...this.toProfile(), categories: CategoryTransformer.transform(categories) }
  }
}
