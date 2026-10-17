import { ChecklistSchema } from '#database/schema'
import { afterFetch, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { appUrl } from '#config/app'
import Card from '#models/card'
import Category from '#models/category'
import UserChecklist from './user_checklist.ts'

export default class Checklist extends ChecklistSchema {
  @column()
  declare status: 'draft' | 'published' | 'archived'
  @column()
  declare version: number
  @column({ serializeAs: null })
  declare coverImagePath: string | null

  @computed()
  get coverImageUrl() {
    if (!this.coverImagePath) return null
    const version = this.updatedAt?.toMillis() ?? 0
    return `${appUrl.replace(/\/$/, '')}/api/v1/checklists/${this.id}/cover?v=${version}`
  }

  @belongsTo(() => Category, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Category, { foreignKey: 'subcategoryId' })
  declare subcategory: BelongsTo<typeof Category>

  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>

  @hasMany(() => UserChecklist)
  declare userChecklist: HasMany<typeof UserChecklist>

  @computed()
  get needs() {
    return this.cards ? this.cards.reduce((prev, curr) => prev + curr.needCount, 0) : 0
  }

  @computed()
  get holds() {
    return this.cards ? this.cards.reduce((prev, curr) => prev + curr.holdCount, 0) : 0
  }

  @computed()
  get offers() {
    return this.cards ? this.cards.reduce((prev, curr) => prev + curr.offerCount, 0) : 0
  }
}
