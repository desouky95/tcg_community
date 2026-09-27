import { http, HttpResponse } from 'msw'

const user = {
  id: '1',
  mobile: '01000000000',
  fullName: 'Demo Collector',
  username: 'collector',
  role: 'user',
  points: 120,
  blocked: false,
}

export const legacyHandlers = [
  http.post('*/api/auth/request-otp', () => HttpResponse.json({ message: 'OTP sent to WhatsApp' })),
  http.post('*/api/auth/signup', () => HttpResponse.json({ message: 'OTP sent to WhatsApp' })),
  http.post('*/api/auth/verify-otp', () => HttpResponse.json({ token: 'mock-jwt-token-for-1', user })),
  http.get('*/api/categories', () => HttpResponse.json([{ id: '1', name: 'Pokémon TCG', subcategories: ['Base Set'] }])),
  http.post('*/api/categories', () => HttpResponse.json({ id: '2', name: 'Yu-Gi-Oh!', subcategories: [] }, { status: 201 })),
  http.post('*/api/categories/:id/subcategories', () => HttpResponse.json({ id: '1', name: 'Pokémon TCG', subcategories: ['Base Set', 'Jungle'] })),
  http.delete('*/api/categories/:id', () => new HttpResponse(null, { status: 204 })),
  http.get('*/api/checklists', () => HttpResponse.json([{ id: '101', game: 'Pokémon TCG', name: 'Base Set', totalCards: 102 }])),
  http.get('*/api/checklists/:id', ({ params }) => HttpResponse.json({ id: String(params.id), game: 'Pokémon TCG', name: 'Base Set', totalCards: 102 })),
  http.post('*/api/checklists', () => HttpResponse.json({ id: '102', game: 'Pokémon TCG', name: 'Jungle', totalCards: 64 })),
  http.get('*/api/admin/users', () => HttpResponse.json([user])),
  http.post('*/api/admin/users/:id/block', () => HttpResponse.json({ ...user, blocked: true })),
  http.get('*/api/users/:id', ({ params }) => HttpResponse.json({ ...user, id: String(params.id) })),
  http.get('*/api/users/:id/reviews', () => HttpResponse.json([{ id: 'review-1', reviewerId: '2', targetUserId: '1', type: 'positive', comment: 'Great trader' }])),
  http.post('*/api/users/:targetUserId/reviews', ({ params }) => HttpResponse.json({ review: { id: 'review-3', reviewerId: '2', targetUserId: String(params.targetUserId), type: 'positive', comment: 'Great trader' }, newPoints: 130 })),
]
