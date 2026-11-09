import { PendingExternalIdentitySchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export type PendingSignupData = {
  fullName: string
  username: string
  email: string
  governorate: string
  passwordHash: string
}

export default class PendingExternalIdentity extends PendingExternalIdentitySchema {
  @column({
    serializeAs: null,
    prepare: (value: PendingSignupData | null) => (value === null ? null : JSON.stringify(value)),
    consume: (value: PendingSignupData | string | null) =>
      typeof value === 'string' ? (JSON.parse(value) as PendingSignupData) : value,
  })
  declare signupData: PendingSignupData | null
}
