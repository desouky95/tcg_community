import { CategorySchema } from '#database/schema'
import { belongsTo, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import UserChecklist from './user_checklist.ts'
import Checklist from './checklist.ts'

export default class Category extends CategorySchema {
  @belongsTo(() => Category, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Category>

  @hasMany(() => Category, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Category>

  @hasManyThrough([() => UserChecklist, () => Checklist], {
    foreignKey: 'subcategoryId',
  })
  declare userChecklists: HasManyThrough<typeof UserChecklist>
}
