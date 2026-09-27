import { CardSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Checklist from '#models/checklist'

export default class Card extends CardSchema {
  @column()
  declare status: 'draft' | 'published' | 'archived'
  @column()
  declare version: number

  @belongsTo(() => Checklist)
  declare checklist: BelongsTo<typeof Checklist>
}
