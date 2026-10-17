import Category from '#models/category'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import stringHelpers from '@adonisjs/core/helpers/string'

@inject()
export class CategoryService {
  protected ctx: HttpContext
  constructor() {
    this.ctx = HttpContext.getOrFail()
  }
  async findBySlug(slug: string) {
    return await Category.query().where('slug', slug).firstOrFail()
  }

  async #validateCategorySlug(category: Category, slug: string) {
    const matchedCategoryWithSlug = await Category.query()
      .where('slug', slug)
      .where('name', '!=', category.name)
      .first()
    if (matchedCategoryWithSlug)
      throw new Exception(`A category with this name already exists`, { status: 409 })
  }

  async updateCategoryName(category: Category, newName: string) {
    const slug = stringHelpers.slug(newName)
    await this.#validateCategorySlug(category, slug)
    category.slug = slug
    category.name = newName
    category.version += 1
    await category.save()
  }

  async canCategoryEdited(category: Category, withThrowException: boolean = false) {
    const isArchived = category.status === 'archived'
    if (isArchived && withThrowException)
      throw new Exception('Category is archived', { status: 404, code: 'not_found' })
    return !isArchived
  }

  #checkVersion(current: number) {
    const expected = this.ctx.request.input('expectedVersion')
    if (expected !== undefined && Number(expected) !== current)
      throw new Exception(`Expected version ${expected}, current version is ${current}`)
  }

  async updateCategory(slug: string, data: any) {
    const category = await this.findBySlug(slug)
    this.#checkVersion(category.version)
    await this.canCategoryEdited(category, true)
    await this.updateCategoryName(category, data.name)
    return category
  }
}

const categoryService = new CategoryService()

export { categoryService }
