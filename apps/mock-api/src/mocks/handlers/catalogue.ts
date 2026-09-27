import { http, HttpResponse } from 'msw'
import { meta } from './shared.js'

const category = {
  id: 1,
  name: 'Pokémon TCG',
  slug: 'pokemon-tcg',
  parentId: -1,
  status: 'published',
  version: 3,
  children: [],
}

const checklist = {
  id: 101,
  name: 'Base Set',
  year: 1999,
  type: 'card',
  totalCards: 102,
  categoryId: 1,
  status: 'published',
  version: 2,
}

const card = {
  id: 1001,
  checklistId: 101,
  number: '4/102',
  name: 'Charizard',
  type: 'Holo Rare',
  section: 'Pokémon',
  status: 'published',
  version: 1,
}

const ok = (request: Request, data: unknown, init?: ResponseInit) =>
  HttpResponse.json({ data, meta: meta(request.headers.get('x-request-id') || 'mock-request'), requestId: request.headers.get('x-request-id') || 'mock-request' }, init)

export const catalogueHandlers = [
  http.get('*/api/v1/categories', ({ request }) => ok(request, [category], { status: 200 })),
  http.get('*/api/v1/categories/:id', ({ request, params }) => ok(request, { ...category, id: Number(params.id) || category.id, checklists: [checklist] })),
  http.get('*/api/v1/checklists', ({ request }) => ok(request, [checklist], { status: 200 })),
  http.get('*/api/v1/checklists/:id', ({ request, params }) => ok(request, { ...checklist, id: Number(params.id) || checklist.id, cards: [card] })),
  http.get('*/api/v1/catalogue/cards', ({ request }) => ok(request, [card], { status: 200 })),
  http.get('*/api/v1/catalogue/cards/:id', ({ request, params }) => ok(request, { ...card, id: Number(params.id) || card.id })),
  http.post('*/api/v1/categories', async ({ request }) => ok(request, { ...category, id: 2, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/api/v1/categories/:id', async ({ request, params }) => ok(request, { ...category, id: Number(params.id) || category.id, ...(await request.json() as object) })),
  http.delete('*/api/v1/categories/:id', ({ request, params }) => ok(request, { ...category, id: Number(params.id) || category.id, status: 'archived', version: 4 })),
  http.post('*/api/v1/categories/:id/subcategories', async ({ request, params }) => ok(request, { id: 3, parentId: Number(params.id), status: 'draft', ...(await request.json() as object) }, { status: 201 })),
  http.post('*/api/v1/checklists', async ({ request }) => ok(request, { ...checklist, id: 102, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/api/v1/checklists/:id', async ({ request, params }) => ok(request, { ...checklist, id: Number(params.id) || checklist.id, ...(await request.json() as object) })),
  http.delete('*/api/v1/checklists/:id', ({ request, params }) => ok(request, { ...checklist, id: Number(params.id) || checklist.id, status: 'archived', version: 3 })),
  http.post('*/api/v1/admin/catalogue-imports/validate', async ({ request }) => ok(request, { id: 9001, status: 'validated', summary: { rows: ((await request.json() as { rows?: unknown[] }).rows || []).length, errors: [], valid: true } }, { status: 202 })),
  http.post('*/api/v1/admin/catalogue-imports/:id/commit', ({ request, params }) => ok(request, { id: Number(params.id), status: 'committed' }, { status: 202 })),
  http.post('*/api/v1/admin/catalogue-imports/:id/rollback', ({ request, params }) => ok(request, { id: Number(params.id), status: 'rolled_back' }, { status: 202 })),
]
