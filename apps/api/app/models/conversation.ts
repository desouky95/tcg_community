import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Message from './message.js'
import SwapDeal from './swap_deal.js'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user1_id' })
  declare user1Id: number

  @column({ columnName: 'user2_id' })
  declare user2Id: number

  @belongsTo(() => User, { foreignKey: 'user1Id' })
  declare user1: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'user2Id' })
  declare user2: BelongsTo<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @hasMany(() => SwapDeal)
  declare swapDeals: HasMany<typeof SwapDeal>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
