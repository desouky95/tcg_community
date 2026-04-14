import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index() {
    return await Category.query().where('parentId', -1).preload('children')
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
      parentId: category.id 
    })
    return response.status(201).json(subcategory)
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.noContent()
  }
}
