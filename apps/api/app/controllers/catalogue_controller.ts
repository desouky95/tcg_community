import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import Category from '#models/category'
import Checklist from '#models/checklist'
import Card from '#models/card'

export default class CatalogueController {
  private requestId(request: HttpContext['request']) {
    return request.header('x-request-id') || randomUUID()
  }

  private envelope(request: HttpContext['request'], data: unknown, meta?: Record<string, unknown>) {
    return {
      data,
      meta: { version: 1, serverTimestamp: new Date().toISOString(), ...meta },
      requestId: this.requestId(request),
    }
  }

  private error(response: HttpContext['response'], code: string, message: string, status = 422) {
    return response.status(status).json({ error: { code, message } })
  }

  private page(request: HttpContext['request']) {
    const limit = Math.min(Math.max(Number(request.input('limit', 20)) || 20, 1), 100)
    const cursor = String(request.input('cursor', ''))
    const offset = cursor
      ? Number.parseInt(Buffer.from(cursor, 'base64url').toString(), 10) || 0
      : 0
    return { limit, offset }
  }

  private nextCursor(offset: number, limit: number, count: number) {
    return count === limit ? Buffer.from(String(offset + limit)).toString('base64url') : null
  }

  async categories({ request }: HttpContext) {
    const { limit, offset } = this.page(request)
    const query = Category.query()
      .where('parentId', -1)
      .whereNot('status', 'archived')
      .preload('children', (children) => children.whereNot('status', 'archived'))
      .orderBy('id', 'asc')
    const categories = await query.offset(offset).limit(limit)
    return this.envelope(request, categories, {
      nextCursor: this.nextCursor(offset, limit, categories.length),
    })
  }

  async category({ request, params, response }: HttpContext) {
    const category = await Category.query()
      .where((query) => query.where('id', params.id).orWhere('slug', params.id))
      .whereNot('status', 'archived')
      .preload('children', (children) => children.whereNot('status', 'archived'))
      .preload('checklists', (checklists) => checklists.whereNot('status', 'archived'))
      .first()
    if (!category) return this.error(response, 'not_found', 'Category not found', 404)
    return this.envelope(request, category)
  }

  async checklists({ request }: HttpContext) {
    const { limit, offset } = this.page(request)
    const query = Checklist.query()
      .whereNot('status', 'archived')
      .preload('category')
      .preload('subcategory')
      .orderBy('id', 'asc')
    const q = request.input('q')
    const categoryId = request.input('categoryId')
    const subcategoryId = request.input('subcategoryId')
    if (q) query.whereILike('name', `%${q}%`)
    if (categoryId) query.where('categoryId', categoryId)
    if (subcategoryId) query.where('subcategoryId', subcategoryId)
    const checklists = await query.offset(offset).limit(limit)
    return this.envelope(request, checklists, {
      nextCursor: this.nextCursor(offset, limit, checklists.length),
    })
  }

  async checklist({ request, params, response }: HttpContext) {
    const checklist = await Checklist.query()
      .where('id', params.id)
      .whereNot('status', 'archived')
      .preload('category')
      .preload('subcategory')
      .preload('cards', (cards) =>
        cards.whereNull('variant').whereNot('status', 'archived').orderBy('order', 'asc')
      )
      .first()
    if (!checklist) return this.error(response, 'not_found', 'Checklist not found', 404)
    return this.envelope(request, checklist)
  }

  async cards({ request }: HttpContext) {
    const { limit, offset } = this.page(request)
    const query = Card.query()
      .withScopes((scopes) => scopes.baseCards())
      .whereNot('status', 'archived')
      .preload('checklist')
      .orderBy('id', 'asc')
    const q = request.input('q') || request.input('search')
    if (q)
      query.where((builder) =>
        builder.whereILike('name', `%${q}%`).orWhereILike('number', `%${q}%`)
      )
    if (request.input('checklistId')) query.where('checklistId', request.input('checklistId'))
    if (request.input('type')) query.where('type', request.input('type'))
    if (request.input('section')) query.where('section', request.input('section'))
    const cards = await query.offset(offset).limit(limit)
    return this.envelope(request, cards, {
      nextCursor: this.nextCursor(offset, limit, cards.length),
    })
  }

  async card({ request, params, response }: HttpContext) {
    const card = await Card.query()
      .where('id', params.id)
      .whereNot('status', 'archived')
      .preload('checklist')
      .first()
    if (!card) return this.error(response, 'not_found', 'Card not found', 404)

    const baseCardId = card.baseCardId ?? card.id
    const baseCard = await Card.query()
      .where('id', baseCardId)
      .whereNull('variant')
      .whereNot('status', 'archived')
      .preload('checklist')
      .first()
    if (!baseCard) return this.error(response, 'not_found', 'Card not found', 404)

    const variants = await Card.query()
      .where('baseCardId', baseCard.id)
      .whereNot('status', 'archived')
      .orderBy('variant', 'asc')
      .orderBy('id', 'asc')

    return this.envelope(request, { card, baseCard, variants })
  }

  async createCategory({ request, response }: HttpContext) {
    const name = String(request.input('name', '')).trim()
    if (!name) return this.error(response, 'validation_error', 'Name is required')
    const parentId = Number(request.input('parentId', -1))
    const category = await Category.create({
      name,
      parentId,
      status: request.input('status', 'draft'),
      version: 1,
    })
    return response.status(201).json(this.envelope(request, category))
  }

  async updateCategory({ request, params, response }: HttpContext) {
    const category = await Category.find(params.id)
    if (!category || category.status === 'archived')
      return this.error(response, 'not_found', 'Category not found', 404)
    const conflict = this.checkVersion(request, category.version)
    if (conflict) return this.error(response, 'conflict', conflict, 409)
    const name = request.input('name')
    if (name !== undefined && !String(name).trim())
      return this.error(response, 'validation_error', 'Name is required')
    category.merge({
      name: name === undefined ? category.name : String(name).trim(),
      status: request.input('status', category.status),
    })
    category.version += 1
    await category.save()
    return response.json(this.envelope(request, category))
  }

  async archiveCategory({ request, params, response }: HttpContext) {
    const category = await Category.find(params.id)
    if (!category || category.status === 'archived')
      return this.error(response, 'not_found', 'Category not found', 404)
    const conflict = this.checkVersion(request, category.version)
    if (conflict) return this.error(response, 'conflict', conflict, 409)
    category.status = 'archived'
    category.version += 1
    await category.save()
    return response.json(this.envelope(request, category))
  }

  async createSubcategory({ request, params, response }: HttpContext) {
    const parent = await Category.find(params.id)
    if (!parent || parent.status === 'archived')
      return this.error(response, 'not_found', 'Parent category not found', 404)
    const name = String(request.input('name', '')).trim()
    if (!name) return this.error(response, 'validation_error', 'Name is required')
    const category = await Category.create({
      name,
      parentId: parent.id,
      status: request.input('status', 'draft'),
      version: 1,
    })
    return response.status(201).json(this.envelope(request, category))
  }

  async createChecklist({ request, response }: HttpContext) {
    const name = String(request.input('name', '')).trim()
    const categoryId = Number(request.input('categoryId'))
    if (!name || !categoryId || !request.input('year') || !request.input('type')) {
      return this.error(
        response,
        'validation_error',
        'name, categoryId, year, and type are required'
      )
    }
    const checklist = await Checklist.create({
      name,
      categoryId,
      subcategoryId: request.input('subcategoryId'),
      year: Number(request.input('year')),
      type: request.input('type'),
      totalCards: Number(request.input('totalCards', 0)),
      status: request.input('status', 'draft'),
      version: 1,
    })
    return response.status(201).json(this.envelope(request, checklist))
  }

  async updateChecklist({ request, params, response }: HttpContext) {
    const checklist = await Checklist.find(params.id)
    if (!checklist || checklist.status === 'archived')
      return this.error(response, 'not_found', 'Checklist not found', 404)
    const conflict = this.checkVersion(request, checklist.version)
    if (conflict) return this.error(response, 'conflict', conflict, 409)
    checklist.merge(
      request.only(['name', 'year', 'type', 'totalCards', 'categoryId', 'subcategoryId', 'status'])
    )
    checklist.version += 1
    await checklist.save()
    return response.json(this.envelope(request, checklist))
  }

  async archiveChecklist({ request, params, response }: HttpContext) {
    const checklist = await Checklist.find(params.id)
    if (!checklist || checklist.status === 'archived')
      return this.error(response, 'not_found', 'Checklist not found', 404)
    const conflict = this.checkVersion(request, checklist.version)
    if (conflict) return this.error(response, 'conflict', conflict, 409)
    checklist.status = 'archived'
    checklist.version += 1
    await checklist.save()
    return response.json(this.envelope(request, checklist))
  }

  async validateImport({ request, response, auth }: HttpContext) {
    const rows = request.input('rows', [])
    const errors: Array<{ row: number; field: string; message: string }> = []
    if (!Array.isArray(rows) || rows.length === 0)
      errors.push({ row: 0, field: 'rows', message: 'At least one row is required' })
    for (const [index, row] of rows.entries()) {
      if (!row.name) errors.push({ row: index + 1, field: 'name', message: 'Name is required' })
      if (!row.type) errors.push({ row: index + 1, field: 'type', message: 'Type is required' })
    }
    const checksum = String(request.input('checksum', randomUUID()))
    const summary = {
      rows: Array.isArray(rows) ? rows.length : 0,
      errors,
      valid: errors.length === 0,
    }
    const [importRecord] = await db
      .table('catalogue_imports')
      .insert({
        actor_id: auth.user?.id,
        checksum,
        status: errors.length ? 'invalid' : 'validated',
        summary: JSON.stringify(summary),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*')
    return response
      .status(errors.length ? 422 : 202)
      .json(this.envelope(request, { id: importRecord.id, status: importRecord.status, summary }))
  }

  async commitImport({ request, params, response }: HttpContext) {
    const record = await db.from('catalogue_imports').where('id', params.id).first()
    if (!record) return this.error(response, 'not_found', 'Catalogue import not found', 404)
    if (record.status !== 'validated')
      return this.error(response, 'conflict', 'Only validated imports can be committed', 409)
    await db
      .from('catalogue_imports')
      .where('id', params.id)
      .update({ status: 'committed', updated_at: new Date() })
    return response.status(202).json(this.envelope(request, { ...record, status: 'committed' }))
  }

  async rollbackImport({ request, params, response }: HttpContext) {
    const record = await db.from('catalogue_imports').where('id', params.id).first()
    if (!record) return this.error(response, 'not_found', 'Catalogue import not found', 404)
    if (record.status !== 'committed')
      return this.error(response, 'conflict', 'Only committed imports can be rolled back', 409)
    await db
      .from('catalogue_imports')
      .where('id', params.id)
      .update({ status: 'rolled_back', updated_at: new Date() })
    return response.status(202).json(this.envelope(request, { ...record, status: 'rolled_back' }))
  }

  private checkVersion(request: HttpContext['request'], current: number) {
    const expected = request.input('expectedVersion')
    return expected !== undefined && Number(expected) !== current
      ? `Expected version ${expected}, current version is ${current}`
      : null
  }
}
