export type CardImportRow = {
  number: string
  name: string
  type: string | null
  section: string | null
  variant: string | null
  baseNumber: string | null
  order: number
}

const aliases = {
  number: ['number', 'card_number', '#'],
  name: ['name', 'card_name', 'title', 'card_title'],
  type: ['type', 'card_type', 'rarity'],
  section: ['section', 'set_section', 'subset'],
  variant: ['variant', 'variation'],
  baseNumber: ['base_number', 'base_card_number', 'parent_number'],
} as const

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[\s_]/g, '')
}

function getValue(row: Record<string, unknown>, keys: readonly string[]) {
  const normalizedKeys = new Set(keys.map(normalizeHeader))
  const key = Object.keys(row).find((candidate) => normalizedKeys.has(normalizeHeader(candidate)))
  if (!key || row[key] === null || row[key] === undefined) return null
  const value = String(row[key]).trim()
  return value || null
}

export function parseCardImportRows(rows: Record<string, unknown>[]): CardImportRow[] {
  const parsed = rows.map((row, index) => ({
    number: getValue(row, aliases.number) ?? '',
    name: getValue(row, aliases.name) ?? '',
    type: getValue(row, aliases.type),
    section: getValue(row, aliases.section),
    variant: getValue(row, aliases.variant),
    baseNumber: getValue(row, aliases.baseNumber),
    order: index,
  }))

  const numbers = new Set<string>()
  for (const row of parsed) {
    if (!row.number) throw new Error(`Card number is required at row ${row.order + 2}`)
    if (!row.name) throw new Error(`Card name is required at row ${row.order + 2}`)
    if (numbers.has(row.number)) throw new Error(`Duplicate card number: ${row.number}`)
    numbers.add(row.number)

    if (row.variant && !row.baseNumber) {
      throw new Error(`Variant ${row.number} requires base_number`)
    }
    if (!row.variant && row.baseNumber) {
      throw new Error(`Card ${row.number} has base_number but no variant`)
    }
  }

  const baseRows = new Map(parsed.filter((row) => !row.variant).map((row) => [row.number, row]))
  const variantKeys = new Set<string>()
  for (const row of parsed.filter((candidate) => candidate.variant)) {
    const base = baseRows.get(row.baseNumber!)
    if (!base) {
      throw new Error(`Variant ${row.number} references missing base card ${row.baseNumber}`)
    }

    const key = `${base.number}\u0000${row.variant}`
    if (variantKeys.has(key)) {
      throw new Error(`Duplicate variant ${row.variant} for base card ${base.number}`)
    }
    variantKeys.add(key)
  }

  return parsed
}
