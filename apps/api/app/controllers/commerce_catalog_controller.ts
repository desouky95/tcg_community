import Card from '#models/card'
import Checklist from '#models/checklist'
import type { HttpContext } from '@adonisjs/core/http'

const asCollection = (item: Checklist) => ({
  id: String(item.id),
  name: item.name,
  year: item.year,
  image_url: item.coverImageUrl,
})
const asCard = (card: Card) => ({
  id: String(card.id),
  collection_id: String(card.checklistId),
  number: card.number,
  name: card.name,
  section: card.section,
  variant: card.variant,
  rarity: card.type,
  image_url: null,
})

function paging(request: HttpContext['request']) {
  const page = Number(request.input('page', 1))
  const limit = Number(request.input('limit', 50))
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100)
    return null
  return { page, limit }
}

export default class CommerceCatalogController {
  async collections({ request, response }: HttpContext) {
    const p = paging(request)
    if (!p) return response.badRequest({ error: 'Invalid pagination' })
    const search = String(request.input('search', '')).trim().slice(0, 100)
    const query = Checklist.query().whereNot('status', 'archived').orderBy('id')
    if (search) query.whereILike('name', `%${search}%`)
    const result = await query.paginate(p.page, p.limit)
    return { collections: result.all().map(asCollection), total: result.total, ...p }
  }

  async collection({ params, response }: HttpContext) {
    if (!/^[1-9]\d*$/.test(String(params.id)))
      return response.badRequest({ error: 'Invalid collection ID' })
    if (!/^[1-9]\d*$/.test(String(params.id)))
      return response.badRequest({ error: 'Invalid collection ID' })
    const item = await Checklist.query()
      .where('id', params.id)
      .whereNot('status', 'archived')
      .first()
    if (!item) return response.notFound({ error: 'Collection not found' })
    return { collection: asCollection(item) }
  }

  async cards({ params, request, response }: HttpContext) {
    const p = paging(request)
    if (!p) return response.badRequest({ error: 'Invalid pagination' })
    if (!/^[1-9]\d*$/.test(String(params.id)))
      return response.badRequest({ error: 'Invalid collection ID' })
    if (!/^[1-9]\d*$/.test(String(params.id)))
      return response.badRequest({ error: 'Invalid collection ID' })
    const item = await Checklist.query()
      .where('id', params.id)
      .whereNot('status', 'archived')
      .first()
    if (!item) return response.notFound({ error: 'Collection not found' })
    const search = String(request.input('search', '')).trim().slice(0, 100)

    console.log(request.qs().search)
    const query = Card.query()
      .where('checklistId', item.id)
      .whereNot('status', 'archived')
      .orderBy('order')
      .orderBy('id')
    if (search)
      query.where((q) => q.whereILike('name', `%${search}%`).orWhereILike('number', `%${search}%`))
    // const result = await query.paginate(p.page, request.input('page') ? p.limit : undefined)
    const result = await query
    // return { collection: item, cards: result.all().map(asCard), total: result.total, ...p }
    return { collection: item, cards: result.map(asCard), total: result.length, ...p }
  }

  async batch({ request, response }: HttpContext) {
    const ids: unknown = request.input('ids')
    if (
      !Array.isArray(ids) ||
      ids.length > 100 ||
      ids.some((id) => typeof id !== 'string' || !/^[1-9]\d*$/.test(id))
    ) {
      return response.badRequest({ error: 'ids must be an array of at most 100 card IDs' })
    }
    if (!ids.length) return { cards: [] }
    const cards = await Card.query()
      .whereIn('id', ids)
      .whereNot('status', 'archived')
      .whereHas('checklist', (q) => q.whereNot('status', 'archived'))
    return { cards: cards.map(asCard) }
  }
}
