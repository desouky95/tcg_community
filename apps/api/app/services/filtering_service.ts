import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type {
  LucidModel,
  ModelQueryBuilderContract,
  ExtractModelColumns,
} from '@adonisjs/lucid/types/model'

type FilterFnConfig<T extends LucidModel> = {
  defaultSearch: keyof ExtractModelColumns<InstanceType<T>>
  defaultSortField: keyof ExtractModelColumns<InstanceType<T>>
  defaultSortDirection: 'asc' | 'desc'

  filterFields?: (keyof ExtractModelColumns<InstanceType<T>>)[]
  qs: Record<string, string>
  sortFields?: (keyof ExtractModelColumns<InstanceType<T>>)[]
  searchFields?: (keyof ExtractModelColumns<InstanceType<T>>)[]
  defaultLimit?: number
  defaultPage?: number
  expandableFields?: (keyof ExtractModelColumns<InstanceType<T>>)[]
}
type IndexParams = {
  q?: string
  limit?: number
  page?: number
}
export class FilteringService {
  #ctx!: HttpContext
  #config!: FilterFnConfig<any>

  #preload(query: ModelQueryBuilderContract<LucidModel>) {
    const expand = this.#config.qs.expand ?? ''
    const available = expand.trim().split(',').filter(Boolean)
    if (available.length === 0) return
    for (const field of available) {
      if (!this.#config.expandableFields?.includes(field)) {
        throw new Error(`Field ${field} is not expandable`)
      }
      query.preload(field as never)
    }
  }

  #search(query: ModelQueryBuilderContract<LucidModel>) {
    const search = this.#config.qs.search
    if (!search) return

    for (const field of this.#config.searchFields ?? []) {
      query.whereILike(field, `%${search}%`)
    }
  }

  #sort(query: ModelQueryBuilderContract<LucidModel>) {
    const sort = this.#config.qs.sort
    if (!sort) {
      query.orderBy(this.#config.defaultSortField, this.#config.defaultSortDirection)
      return
    }
    const sortDirection = sort.startsWith('-') ? 'desc' : 'asc'
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort
    if (!this.#config.sortFields?.includes(sortField))
      throw new Error(`Field ${sortField} is not sortable`)
    query.orderBy(sortField, sortDirection)
  }

  #where(query: ModelQueryBuilderContract<LucidModel>) {
    const filters = this.#config.qs.filters ?? ''
    const filterFields = (filters.split(',') as string[]).filter(Boolean).map((f) => ({
      field: f.split(':')[0],
      value: f.split(':')[1],
    }))
    for (const { field, value } of filterFields) {
      if (!this.#config.filterFields?.includes(field))
        throw new Error(`Field ${field} is not filterable`)
      query.where(field, value)
    }
  }

  filter<T extends LucidModel>(
    query: ModelQueryBuilderContract<T, InstanceType<T>>,
    config: FilterFnConfig<T>
  ) {
    this.#config = config
    this.#preload(query)
    this.#search(query)
    this.#where(query)
    this.#sort(query)
    return query
  }
}

let filtering: FilteringService

await app.booted(async (handler) => {
  filtering = await handler.container.make(FilteringService)
  handler.container.alias('filtering', FilteringService)
})

export { filtering as default }
