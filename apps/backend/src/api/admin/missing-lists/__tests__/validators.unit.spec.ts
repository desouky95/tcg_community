import { CreateMissingListSchema, UpdateMissingListSchema } from '../validators'

describe('missing list validation', () => {
  const card = { number: '001', name: 'Card', price: 1.25, quantity: 2, active: false }
  const input = { title: 'List', location_id: 'sloc_1', cards: [card] }
  it('accepts valid cards and preserves decimal prices', () => expect(CreateMissingListSchema.parse(input).cards[0]).toEqual(card))
  it.each([{ price: 0 }, { price: 1.234 }, { quantity: -1 }, { quantity: 1.5 }, { name: ' ' }])('rejects invalid card values %o', patch => expect(CreateMissingListSchema.safeParse({ ...input, cards: [{ ...card, ...patch }] }).success).toBe(false))
  it('requires cards and validates updates', () => {
    expect(CreateMissingListSchema.safeParse({ ...input, cards: [] }).success).toBe(false)
    expect(UpdateMissingListSchema.safeParse({ cards: [{ id: 'v', price: 1, quantity: 0, active: false }] }).success).toBe(true)
  })
})
