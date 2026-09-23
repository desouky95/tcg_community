import { CategorySchema } from '#database/schema'
import { belongsTo, hasMany, hasManyThrough, beforeSave, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import UserChecklist from './user_checklist.ts'
import Checklist from './checklist.ts'

export default class Category extends CategorySchema {
  @column()
  declare slug: string

  @beforeSave()
  public static async generateSlug(category: Category) {
    if (category.$dirty.name && !category.slug) {
      category.slug = category.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }

  @belongsTo(() => Category, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Category>

  @hasMany(() => Category, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Category>

  @hasMany(() => Checklist, { foreignKey: 'categoryId' })
  declare checklists: HasMany<typeof Checklist>

  @hasManyThrough([() => UserChecklist, () => Checklist], {
    foreignKey: 'subcategoryId',
  })
  declare userChecklists: HasManyThrough<typeof UserChecklist>
}
