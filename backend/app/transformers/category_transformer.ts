import { BaseTransformer } from '@adonisjs/core/transformers'
import type Category from '#models/category'
import UserChecklistTransformer from './user_checklist_transformer.ts'

export default class CategoryTransformer extends BaseTransformer<Category> {
  toObject() {
    const userChecklists = UserChecklistTransformer.transform(
      this.whenLoaded(this.resource.userChecklists)
    )
    // const children = CategoryTransformer.transform(this.resource.children)
    return {
      ...this.pick(this.resource, ['id', 'name', 'parentId', 'children']),
      userChecklists,
    }
  }
}
