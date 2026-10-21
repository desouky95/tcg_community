import { UserChecklistCardSchema } from '#database/schema'
import { belongsTo, computed } from '@adonisjs/lucid/orm'
import Card from './card.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import UserChecklist from './user_checklist.ts'

export default class UserChecklistCard extends UserChecklistCardSchema {
  declare cardId: number

  @belongsTo(() => Card, { foreignKey: 'cardId' })
  declare card: BelongsTo<typeof Card>

  declare checklistId: number
  declare quantity: number

  declare userChecklistId: number
  @belongsTo(() => UserChecklist, { foreignKey: 'userChecklistId' })
  declare userChecklist: BelongsTo<typeof UserChecklist>

  @computed()
  get duplicates() {
    return this.quantity < 2 ? 0 : this.quantity - 1
  }
}
