import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Conversation from './conversation.js'
import User from './user.js'

export default class SwapDeal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare conversationId: number

  @column()
  declare createdByUserId: number

  @column()
  declare status: 'pending' | 'accepted' | 'in_progress' | 'shipping' | 'completed' | 'cancelled'

  @column()
  declare swapType: 'in_person' | 'postal'

  @column()
  declare offeredCards: string

  @column()
  declare requestedCards: string

  // In-person tracking
  @column()
  declare user1QrScanned: boolean

  @column()
  declare user2QrScanned: boolean

  // Postal tracking
  @column()
  declare user1PhotoUrl: string | null

  @column()
  declare user2PhotoUrl: string | null

  @column()
  declare user1Tracking: string | null

  @column()
  declare user2Tracking: string | null

  @column()
  declare user1Received: boolean

  @column()
  declare user2Received: boolean

  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare creator: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}