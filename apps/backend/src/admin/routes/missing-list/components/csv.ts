export type DraftCard = { key: string; id?: string; number: string; name: string; price: string; quantity: string; active: boolean }

function parseRows(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let field = ""; let quoted = false; let closed = false
  const input = text.replace(/^\uFEFF/, "")
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') { quoted = false; closed = true }
      else field += c
    } else if (c === '"' && !field && !closed) quoted = true
    else if (c === ',') { row.push(field); field = ""; closed = false }
    else if (c === '\n' || c === '\r') { if (c === '\r' && input[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ""; closed = false }
    else if (closed || c === '"') throw new Error(`Malformed CSV near row ${rows.length + 1}`)
    else field += c
  }
  if (quoted) throw new Error(`Unclosed quote near row ${rows.length + 1}`)
  if (row.length || field) { row.push(field); rows.push(row) }
  return rows
}

export function parseCsv(text: string): DraftCard[] {
  const rows = parseRows(text)
  if (rows[0]?.join(',').toLowerCase() !== 'number,name,price,quantity') throw new Error('Expected header: number,name,price,quantity')
  const records = rows.slice(1).filter(r => r.some(v => v.trim()))
  if (!records.length) throw new Error('The file contains no cards')
  return records.map((r, i) => {
    if (r.length !== 4) throw new Error(`Row ${i + 2}: expected four columns`)
    return { key: `row-${i + 2}`, number: r[0].trim(), name: r[1].trim(), price: r[2].trim(), quantity: r[3].trim() || '0', active: false }
  })
}

export function serializeUpdateCsv(cards: DraftCard[]): string {
  const quote = (value: string) => `"${value.replace(/"/g, '""')}"`
  const safeText = (value: string) => /^[\s]*[=+@-]/.test(value) ? `'${value}` : value
  return [
    "variant_id,card_number,card_name,price,quantity,active",
    ...cards.map(card => [card.id!, safeText(card.number), safeText(card.name), card.price, card.quantity, String(card.active)].map(quote).join(",")),
  ].join("\r\n") + "\r\n"
}

export function parseUpdateCsv(text: string, current: DraftCard[]): DraftCard[] {
  const rows = parseRows(text)
  if (rows[0]?.join(",").toLowerCase() !== "variant_id,card_number,card_name,price,quantity,active") throw new Error("Unexpected CSV header. Download a fresh product CSV and keep its columns unchanged")
  const records = rows.slice(1).filter(row => row.some(value => value.trim()))
  if (records.length !== current.length) throw new Error(`Expected ${current.length} card rows`)
  const byId = new Map(current.map(card => [card.id, card]))
  const seen = new Set<string>()
  return records.map((row, index) => {
    if (row.length !== 6) throw new Error(`Row ${index + 2}: expected six columns`)
    const [id, , , price, quantity, rawActive] = row.map(value => value.trim())
    const active = rawActive.toLowerCase()
    const card = byId.get(id)
    if (!card || seen.has(id)) throw new Error(`Row ${index + 2}: unknown or duplicate variant ID`)
    if (active !== "true" && active !== "false") throw new Error(`Row ${index + 2}: active must be true or false`)
    seen.add(id)
    return { ...card, price, quantity, active: active === "true" }
  })
}

export function cardErrors(cards: DraftCard[], defaultPrice = '', external = false) {
  const counts = new Map<string, number>()
  cards.forEach(c => { const key = external ? c.id : c.number.trim().toLowerCase(); if (key) counts.set(key, (counts.get(key) || 0) + 1) })
  return cards.map(c => {
    const price = c.price.trim() || defaultPrice.trim()
    const key = external ? c.id : c.number.trim().toLowerCase()
    const errors: string[] = []
    if (!c.number.trim() || !c.name.trim()) errors.push('Number and name are required')
    if (!key || (counts.get(key) || 0) > 1) errors.push('Card identity must be unique')
    if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0 || !/^\d+(\.\d{1,2})?$/.test(price)) errors.push('Enter a positive price with at most two decimals')
    if (!/^\d+$/.test(c.quantity) || !Number.isSafeInteger(Number(c.quantity))) errors.push('Quantity must be a non-negative whole number')
    return errors.join('; ')
  })
}
