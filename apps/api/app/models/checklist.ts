import { ChecklistSchema } from '#database/schema'
import { belongsTo, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Card from '#models/card'
import Category from '#models/category'
import UserChecklist from './user_checklist.ts'

export default class Checklist extends ChecklistSchema {
  @belongsTo(() => Category, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Category, { foreignKey: 'subcategoryId' })
  declare subcategory: BelongsTo<typeof Category>

  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>

  @hasMany(() => UserChecklist)
  declare userChecklist: HasMany<typeof UserChecklist>
}
