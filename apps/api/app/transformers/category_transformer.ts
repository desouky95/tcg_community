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

  show() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'parentId', 'children', 'slug', 'checklists']),
      // checklists: [
      //   ...this.resource.checklists,
      //   ...((this.whenLoaded(this.resource.children.flatMap((child) => child.checklists))
      //     .value as any) || []),
      // ],
    }
  }
}
