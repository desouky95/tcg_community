import Card from '#models/card'
import Checklist from '#models/checklist'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import filtering from './filtering_service.ts'
import type User from '#models/user'

type FilterItem = {
  name: string
  type: 'select' | 'checkbox'
  display: string
  options: FilterOption[]
}
type FilterOption = {
  value: string
  display: string
}
export class CardService {
  async filterCards(
    slug: string,
    qs: Record<string, string>,
    user?: User
  ): Promise<ModelQueryBuilderContract<typeof Card, Card>> {
    const checklist = await Checklist.findByOrFail('slug', slug)
    const query = Card.query()
      .where('checklistId', checklist.id)
      .whereHas('checklist', (c) =>
        c.whereHas('userChecklist', (uc) =>
          uc.where('user_id', user?.id!).andWhere('checklist_id', checklist.id)
        )
      )
    const filtered = filtering.filter<typeof Card>(query, {
      defaultSearch: 'name',
      defaultSortDirection: 'asc',
      defaultSortField: 'order',
      qs,
      searchFields: ['name'],
      filterFields: ['type', 'section', 'name'],
      sortFields: ['number', 'order', 'needCount', 'holdCount', 'offerCount'],
      user,
    })

    return filtered.clone() as ModelQueryBuilderContract<typeof Card, Card>
  }

  async getFiltersOptions(slug: string) {
    const checklist = await Checklist.findByOrFail('slug', slug)
    const query = Card.query().where('checklistId', checklist.id)

    const types = await query
      .clone()
      .groupBy('type')
      .select('type as value')
      .pojo<{ value: string }>()
    const sections = await query
      .clone()
      .groupBy('section')
      .select('section as value')
      .pojo<{ value: string }>()

    const map = (val: { value: string }) => ({ value: val.value, display: val.value })
    const filters = [
      {
        name: 'type',
        display: 'Type',
        type: 'select',
        options: types.map(map),
      },
      {
        name: 'section',
        display: 'Section',
        type: 'select',
        options: sections.map(map),
      },
    ] as FilterItem[]

    return filters
  }
}
