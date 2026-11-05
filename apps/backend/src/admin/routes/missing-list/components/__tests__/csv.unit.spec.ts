import { cardErrors, parseCsv } from '../csv'

describe('missing list CSV', () => {
  it('parses quoted names and validates prices and quantities', () => {
    const cards = parseCsv('number,name,price,quantity\r\n001,"Smith, ""Junior""",12.50,2\r\n')
    expect(cards[0]).toMatchObject({ number: '001', name: 'Smith, "Junior"', price: '12.50', quantity: '2', active: false })
    expect(cardErrors(cards)).toEqual([''])
  })
  it('rejects malformed, empty, and incorrectly headed files', () => {
    for (const csv of ['number,name,price,quantity\n', 'number,name,price\n1,a,1', 'number,name,price,quantity\n1,"broken,1,1', 'number,name,price,quantity\n1,a,1']) expect(() => parseCsv(csv)).toThrow()
  })
  it('reports duplicates and invalid numeric values and uses the external fallback', () => {
    const cards = parseCsv('number,name,price,quantity\n1,A,,2\n1,B,-1,1.5')
    const errors = cardErrors(cards, '4')
    expect(errors[0]).toContain('unique')
    expect(errors[1]).toContain('positive price')
    expect(errors[1]).toContain('whole number')
    expect(cardErrors([{ ...cards[0], id: '10' }], '4', true)).toEqual([''])
  })
})
