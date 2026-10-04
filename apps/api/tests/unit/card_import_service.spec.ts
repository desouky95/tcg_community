import { parseCardImportRows } from '#services/card_import_service'
import { test } from '@japa/runner'

test.group('Card import service', () => {
  test('keeps exact source numbers and resolves a valid variant family', ({ assert }) => {
    const rows = parseCardImportRows([
      { number: '10', name: 'Base card' },
      { number: '10bu', name: 'Blue card', variant: ' Blue ', base_number: '10' },
      {
        card_number: '10amd',
        card_name: 'Aqua card',
        variation: 'Aqua Mini Diamond',
        base_card_number: '10',
      },
    ])

    assert.deepInclude(rows[0], { number: '10', variant: null, baseNumber: null })
    assert.deepInclude(rows[1], { number: '10bu', variant: 'Blue', baseNumber: '10' })
    assert.deepInclude(rows[2], {
      number: '10amd',
      variant: 'Aqua Mini Diamond',
      baseNumber: '10',
    })
  })

  test('rejects duplicate source numbers', ({ assert }) => {
    assert.throws(
      () =>
        parseCardImportRows([
          { number: '10', name: 'First' },
          { number: '10', name: 'Second' },
        ]),
      /Duplicate card number: 10/
    )
  })

  test('rejects variants without a base and duplicate labels per base', ({ assert }) => {
    assert.throws(
      () =>
        parseCardImportRows([
          { number: '10', name: 'Base' },
          { number: '10bu', name: 'Blue', variant: 'Blue', base_number: 'missing' },
        ]),
      /references missing base card missing/
    )

    assert.throws(
      () =>
        parseCardImportRows([
          { number: '10', name: 'Base' },
          { number: '10bu', name: 'Blue one', variant: 'Blue', base_number: '10' },
          { number: '10bu2', name: 'Blue two', variant: 'Blue', base_number: '10' },
        ]),
      /Duplicate variant Blue for base card 10/
    )
  })

  test('rejects incomplete variant metadata', ({ assert }) => {
    assert.throws(
      () => parseCardImportRows([{ number: '10bu', name: 'Blue', variant: 'Blue' }]),
      /requires base_number/
    )
    assert.throws(
      () => parseCardImportRows([{ number: '10bu', name: 'Blue', base_number: '10' }]),
      /has base_number but no variant/
    )
  })
})
