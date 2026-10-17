import { BaseModel } from '@adonisjs/lucid/orm'

export type FilterOption = {
  value: number | string
  display: string
}

export type FilterItem = {
  name: string
  display: string
  options: FilterOption[]
}

export abstract class ControllerWithPagination extends BaseModel {
  constructor() {
    super()
  }
  protected allowedColumns: string[] = []
  protected getFiltersOptions(): Promise<Array<FilterItem>> {
    return Promise.resolve([])
  }
}
