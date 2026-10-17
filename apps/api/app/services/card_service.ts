import Card from '#models/card'
import Checklist from '#models/checklist'
import filtering from './filtering_service.ts'

type FilterItem = {
  name: string
  display: string
  options: FilterOption[]
}
type FilterOption = {
  value: string
  display: string
}
export class CardService {
  async filterCards(slug: string, qs: Record<string, string>) {
    const checklist = await Checklist.findByOrFail('slug', slug)
    const query = Card.query().where('checklistId', checklist.id)
    const filtered = filtering
      .filter<typeof Card>(query, {
        defaultSearch: 'name',
        defaultSortDirection: 'asc',
        defaultSortField: 'order',
        qs,
        searchFields: ['name'],
        filterFields: ['type', 'section', 'name'],
        sortFields: ['number', 'order', 'needCount', 'holdCount', 'offerCount'],
      })
      .debug(true)

    return await filtered
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
        options: types.map(map),
      },
      {
        name: 'section',
        display: 'Section',

        options: sections.map(map),
      },
    ] as FilterItem[]

    return filters
  }
}
