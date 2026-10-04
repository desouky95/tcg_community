import { CardSchema } from '#database/schema'
import { beforeSave, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Checklist from '#models/checklist'

export default class Card extends CardSchema {
  static baseCards = scope((query) => query.whereNull('variant'))

  @column()
  declare status: 'draft' | 'published' | 'archived'
  @column()
  declare version: number
  @column()
  declare variant: string | null
  @column()
  declare baseCardId: number | null

  @beforeSave()
  static validateVariant(card: Card) {
    if (typeof card.variant === 'string') card.variant = card.variant.trim()
    if (typeof card.baseCardId === 'number' && card.baseCardId === card.id) {
      throw new Error('A card cannot be its own base card')
    }
  }

  @belongsTo(() => Checklist)
  declare checklist: BelongsTo<typeof Checklist>

  @belongsTo(() => Card, { foreignKey: 'baseCardId' })
  declare baseCard: BelongsTo<typeof Card>

  @hasMany(() => Card, { foreignKey: 'baseCardId' })
  declare variants: HasMany<typeof Card>
}
