import { UserChecklistSchema } from '#database/schema'
import { belongsTo, computed, hasMany, hasManyThrough, scope } from '@adonisjs/lucid/orm'
import Checklist from './checklist.ts'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import Category from './category.ts'
import UserChecklistCard from './user_checklist_card.ts'
import Card from './card.ts'

export default class UserChecklist extends UserChecklistSchema {
  @belongsTo(() => Checklist, {
    foreignKey: 'checklistId',
  })
  declare checklist: BelongsTo<typeof Checklist>

  @hasManyThrough([() => Category, () => Checklist], {
    localKey: 'checklistId',
    foreignKey: 'id',
    throughForeignKey: 'id',
  })
  declare subCategory: HasManyThrough<typeof Category>

  @computed()
  get collectedListArray() {
    return (this.collectedList || '').split(',').filter(Boolean)
  }

  @computed()
  get missingListArray() {
    return (this.missingList || '').split(',').filter(Boolean)
  }

  @computed()
  get duplicateListArray() {
    return (this.duplicatesList || '')
      .split(',')
      .filter(Boolean)
      .map((i) => ({
        id: i.match(/^[^,\(]+/g)?.[0] ?? i,
        count: i.match(/(?<=\()\d+(?=\))/g)?.[0],
      }))
  }

  @hasManyThrough([() => Card, () => UserChecklistCard], {
    throughForeignKey: 'id',
    // foreignKey: 'id',
  })
  declare cards: HasManyThrough<typeof Card>

  @hasMany(() => UserChecklistCard)
  declare userCards: HasMany<typeof UserChecklistCard>
}
