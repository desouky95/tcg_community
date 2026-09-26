import { CardSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Checklist from '#models/checklist'

export default class Card extends CardSchema {
  @belongsTo(() => Checklist)
  declare checklist: BelongsTo<typeof Checklist>
}