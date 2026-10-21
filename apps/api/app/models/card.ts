import { CardSchema } from '#database/schema'
import { beforeSave, belongsTo, column, hasMany, hasOne, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Checklist from '#models/checklist'
import User from './user.ts'
import { ModelQueryBuilderContract, QueryScopeCallback } from '@adonisjs/lucid/types/model'
import UserChecklistCard from './user_checklist_card.ts'

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

  @hasOne(() => UserChecklistCard, { foreignKey: 'cardId' })
  declare userCard: HasOne<typeof UserChecklistCard>

  static missing = scope<typeof Card, QueryScopeCallback<typeof Card>>((query, user: User) => {})

  static withUserCards = scope((scopeQuery, user: User, checklist: Checklist) => {
    const query = scopeQuery as any as Card
    query.preload('userCard', (q) =>
      q
        .where('checklist_id', checklist.id)
        .whereHas('userChecklist', (uc) => uc.where('user_id', user.id))
    )
  })
}
