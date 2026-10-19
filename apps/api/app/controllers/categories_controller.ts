import Category from '#models/category'
import filtering from '#services/filtering_service'
import pagination from '#services/pagination_service'
import type { HttpContext } from '@adonisjs/core/http'
import { ControllerWithPagination, type FilterItem } from '../interfaces/pagination.controller.ts'
import string from '@adonisjs/core/helpers/string'
import CategoryTransformer from '#transformers/category_transformer'

export default class CategoriesController extends ControllerWithPagination {
  protected allowedColumns: string[] = ['status']
  async getFiltersOptions(): Promise<Array<FilterItem>> {
    const filters: Array<FilterItem> = []
    for (const column of this.allowedColumns) {
      const values = await Category.query().groupBy(column).select(column)
      filters.push({
        name: column,
        display: string.capitalCase(column),
        options: values.map((value) => ({
          value: value[column as keyof Category] as string,
          display: string.capitalCase(value[column as keyof Category] as string),
        })),
      })
    }
    return filters
  }
  async index({ response }: HttpContext) {
    const filters = await this.getFiltersOptions()
    const query = Category.query()
      .where('parentId', -1)
      .whereNot('status', 'archived')
      .preload('children', (children) => children.whereNot('status', 'archived'))
      .orderBy('id', 'asc')
    // filtering.filter(query, { allowedFields: ['status'] })
    const result = await pagination.paginate<typeof Category>(query)

    return response.paginated(result.data, result.meta, filters)
  }

  async show({ params, response, request }: HttpContext) {
    const qs = request.qs()
    const query = Category.query().where('slug', params.id)
    const filtered = filtering.filter(query, {
      qs,
      expandableFields: ['checklists', 'parent', 'children'],
      defaultSortField: 'id',
    })
    const category = await filtered.first()

    if (!category) {
      return response.notFound({ error: 'Category not found' })
    }

    return response.api(category)
  }

  async store({ request, response }: HttpContext) {
    const name = request.input('name')
    const parentId = request.input('parentId', -1)

    if (!name) {
      return response.badRequest({ error: 'Name is required' })
    }

    const category = await Category.create({ name, parentId })
    return response.status(201).json(category)
  }

  async addSubcategory({ request, params, response }: HttpContext) {
    const name = request.input('name')
    if (!name) {
      return response.badRequest({ error: 'Name is required' })
    }

    const category = await Category.findOrFail(params.id)

    const subcategory = await Category.create({
      name,
      parentId: category.id,
    })
    return response.status(201).json(subcategory)
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.noContent()
  }
}
