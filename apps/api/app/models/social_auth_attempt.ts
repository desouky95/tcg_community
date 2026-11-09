import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class SocialAuthAttempt extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column({ serializeAs: null }) declare nonceHash: string
  @column() declare provider: string
  @column() declare destination: string
  @column() declare returnTo: string
  @column.dateTime() declare expiresAt: DateTime
  @column.dateTime() declare consumedAt: DateTime | null
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
}
