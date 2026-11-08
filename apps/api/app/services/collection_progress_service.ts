import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import env from '#start/env'
import XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import UserChecklistCard from '#models/user_checklist_card'
import Checklist from '#models/checklist'
import UserChecklist from '#models/user_checklist'
import Card from '#models/card'

export type CollectionEntry = {
  cardId: number
  quantity: number
  offeredQuantity: number
  wanted: boolean
  wantedQuantity?: number
}
export class CollectionError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export type QuantityByNumber = Map<string, number>

/** Parses the list editor's `1, 2(3)` format without silently dropping bad input. */
export function parseQuantityList(
  value: string | null | undefined,
  cards: string[]
): QuantityByNumber {
  const quantities: QuantityByNumber = new Map()
  const normalizedCards = new Map(cards.map((number) => [number.toLocaleLowerCase(), number]))
  const parts = String(value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  for (const part of parts) {
    const match = part.match(/^(.+?)(?:\s*\((\d+)\))?$/)
    if (!match) throw new CollectionError(422, `Invalid card quantity: ${part}`)
    const submittedNumber = match[1].trim()
    const number = normalizedCards.get(submittedNumber.toLocaleLowerCase())
    const quantity = match[2] ? Number(match[2]) : 1
    if (!number) throw new CollectionError(422, `Unknown card or sticker: ${submittedNumber}`)
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000)
      throw new CollectionError(
        422,
        `Quantity for ${submittedNumber} must be a whole number between 1 and 1000`
      )
    quantities.set(number, (quantities.get(number) ?? 0) + quantity)
  }

  return quantities
}

export function serializeQuantityList(quantities: QuantityByNumber) {
  return [...quantities]
    .filter(([, quantity]) => quantity > 0)
    .map(([number, quantity]) => (quantity === 1 ? number : `${number}(${quantity})`))
    .join(',')
}

export function expandQuantityList(value: string | null | undefined) {
  const entries = String(value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  return entries.flatMap((part) => {
    const match = part.match(/^(.+?)(?:\s*\((\d+)\))?$/)
    if (!match) return []
    const quantity = match[2] ? Number(match[2]) : 1
    return Number.isSafeInteger(quantity) && quantity > 0
      ? Array(quantity).fill(match[1].trim())
      : []
  })
}

export function quantityMapFromList(value: string | null | undefined): QuantityByNumber {
  const quantities: QuantityByNumber = new Map()
  for (const number of expandQuantityList(value))
    quantities.set(number, (quantities.get(number) ?? 0) + 1)
  return quantities
}
export async function findChecklist(id: string) {
  const query = Checklist.query()
  return (/^\d+$/.test(id) ? query.where('id', Number(id)) : query.where('slug', id)).first()
}
export async function findOwned(userId: number, checklistId: number) {
  return db.from('user_checklists').where({ user_id: userId, checklist_id: checklistId }).first()
}
export async function startCollection(
  trx: TransactionClientContract,
  userId: number,
  checklistId: number
) {
  await trx
    .table('user_checklists')
    .insert({
      user_id: userId,
      checklist_id: checklistId,
      missing_list: '',
      collected_list: '',
      duplicates_list: '',
      created_at: DateTime.utc().toSQL(),
      updated_at: DateTime.utc().toSQL(),
    })
    .onConflict(['user_id', 'checklist_id'])
    .ignore()
  return trx.from('user_checklists').where({ user_id: userId, checklist_id: checklistId }).first()
}
export async function lockCollection(
  trx: TransactionClientContract,
  userId: number,
  checklistId: number,
  expectedVersion: number
) {
  // await Checklist.query({ client: trx }).where('id', checklistId).forUpdate().first()

  const collection = await UserChecklist.query({ client: trx })
    .where({ userId, checklistId })
    .forUpdate()
    .firstOrFail()

  // if (!collection) throw new CollectionError(404, 'Collection not found')
  // if (collection.version !== expectedVersion)
  //   throw new CollectionError(409, 'Collection changed; refresh and try again')
  return collection
}
export async function applyEntries(
  trx: TransactionClientContract,
  collection: UserChecklist,
  entries: CollectionEntry[]
) {
  if (new Set(entries.map((entry) => entry.cardId)).size !== entries.length)
    throw new CollectionError(422, 'Each card may appear only once')
  if (
    entries.some(
      (entry) =>
        !Number.isSafeInteger(entry.quantity) ||
        !Number.isSafeInteger(entry.offeredQuantity) ||
        (entry.wantedQuantity !== undefined && !Number.isSafeInteger(entry.wantedQuantity)) ||
        entry.quantity < 0 ||
        entry.offeredQuantity < 0 ||
        (entry.wantedQuantity ?? (entry.wanted ? 1 : 0)) < 0
      // ||
      // entry.offeredQuantity > entry.quantity
    )
  )
    throw new CollectionError(
      422,
      'Quantities must be whole numbers and offered quantity cannot exceed owned quantity'
    )
  const cards = await Card.query({ client: trx })
    .where('checklist_id', collection.checklistId)
    .whereIn(
      'id',
      entries.map((entry) => entry.cardId)
    )
    .select('id', 'number')

  if (cards.length !== entries.length)
    throw new CollectionError(422, 'All cards must belong to the checklist')
  const numbers = new Map(cards.map((card) => [card.id, card.number as string]))
  const wanted = quantityMapFromList(collection.missingList)
  const held = quantityMapFromList(collection.collectedList)
  const offered = quantityMapFromList(collection.duplicatesList)
  for (const entry of entries) {
    const number = numbers.get(entry.cardId)!
    const wantedQuantity = entry.wantedQuantity ?? (entry.wanted ? 1 : 0)
    wantedQuantity > 0 ? wanted.set(number, wantedQuantity) : wanted.delete(number)
    entry.quantity > 0 ? held.set(number, entry.quantity) : held.delete(number)
    entry.offeredQuantity > 0 ? offered.set(number, entry.offeredQuantity) : offered.delete(number)
    UserChecklistCard.updateOrCreate(
      {
        userChecklistId: collection.id,
        checklistId: collection.checklistId,
        cardId: entry.cardId,
      },
      {
        quantity: entry.quantity,
        offeredQuantity: entry.offeredQuantity,
        // duplicates: entry.offeredQuantity,
      },
      {
        client: trx,
      }
    )
  }
  await UserChecklist.updateOrCreate(
    {
      userId: collection.userId,
      checklistId: collection.checklistId,
    },
    {
      missingList: serializeQuantityList(wanted),
      collectedList: serializeQuantityList(held),
      duplicatesList: serializeQuantityList(offered),
      version: collection.version + 1,
    },
    { client: trx }
  )

  await recomputeCollectionCounts(trx, collection.checklistId)
  return collection.version + 1
}
export async function setVisibility(
  trx: TransactionClientContract,
  collection: any,
  visibility: string
) {
  const token =
    visibility === 'unlisted' ? (collection.share_token ?? randomBytes(32).toString('hex')) : null
  await trx
    .from('user_checklists')
    .where('id', collection.id)
    .update({
      visibility,
      share_token: token,
      version: collection.version + 1,
      updated_at: DateTime.utc().toSQL(),
    })
  await recomputeCollectionCounts(trx, collection.checklist_id)
  return { visibility, shareToken: token, version: collection.version + 1 }
}
export async function recomputeCollectionCounts(
  trx: TransactionClientContract,
  checklistId: number
) {
  const collections = await trx
    .from('user_checklists as uc')
    .join('users as u', 'u.id', 'uc.user_id')
    .where({
      'uc.checklist_id': checklistId,
      'uc.visibility': 'public',
      'u.status': 'active',
      'u.blocked': false,
    })
    .select('uc.missing_list', 'uc.collected_list', 'uc.duplicates_list', 'u.privacy_preferences')
  const counts = new Map<string, { need: number; hold: number; offer: number }>()
  for (const collection of collections) {
    const privacy = JSON.parse(collection.privacy_preferences ?? '{}') as {
      showProfile?: boolean
      showCollection?: boolean
    }
    if (privacy.showProfile === false || privacy.showCollection === false) continue
    for (const [field, kind] of [
      ['missing_list', 'need'],
      ['collected_list', 'hold'],
      ['duplicates_list', 'offer'],
    ] as const) {
      for (const number of new Set(expandQuantityList(collection[field] as string | null))) {
        const value = counts.get(number) ?? { need: 0, hold: 0, offer: 0 }
        value[kind] += 1
        counts.set(number, value)
      }
    }
  }
  const cards = await trx
    .from('cards')
    .where('checklist_id', checklistId)
    .whereNull('variant')
    .select('id', 'number')
    .orderBy('id')
  for (const card of cards) {
    const value = counts.get(card.number) ?? { need: 0, hold: 0, offer: 0 }
    await trx
      .from('cards')
      .where('id', card.id)
      .update({
        need_count: value.need,
        hold_count: value.hold,
        offer_count: value.offer,
        ratio: value.need / Math.max(value.offer, 1),
      })
  }
}
export async function recomputeForUser(trx: TransactionClientContract, userId: number) {
  const collections = await trx
    .from('user_checklists')
    .where('user_id', userId)
    .select('checklist_id')
    .orderBy('checklist_id')
  for (const collection of collections) {
    await trx.from('checklists').where('id', collection.checklist_id).forUpdate().first()
    await recomputeCollectionCounts(trx, collection.checklist_id)
  }
}
export async function previewSpreadsheet(
  file: MultipartFile,
  checklistId: number,
  treatEmptyAsMissing: boolean
) {
  if (!file.isValid || !file.tmpPath) throw new CollectionError(422, 'Upload a valid spreadsheet')
  let rows: unknown[][]
  try {
    const workbook = XLSX.read(await readFile(file.tmpPath), { type: 'buffer' })
    if (!workbook.SheetNames[0]) throw new Error('Empty workbook')
    rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      range: 1,
      defval: '',
    })
  } catch {
    throw new CollectionError(422, 'Could not read the spreadsheet')
  }
  const cards = await db
    .from('cards')
    .where('checklist_id', checklistId)
    .whereNull('variant')
    .select('id', 'number')
  const byNumber = new Map(cards.map((card) => [String(card.number).trim().toLowerCase(), card]))
  const seen = new Set<string>()
  const issues: { row: number; message: string }[] = []
  const entries: CollectionEntry[] = []
  rows.forEach((row, index) => {
    if (!row.some((cell) => String(cell).trim())) return
    const key = String(row[0] ?? '')
      .trim()
      .toLowerCase()
    const card = byNumber.get(key)
    if (!card) {
      issues.push({ row: index + 2, message: 'Card number is not in this checklist' })
      return
    }
    if (seen.has(key)) {
      issues.push({ row: index + 2, message: 'Duplicate card number' })
      return
    }
    seen.add(key)
    const raw = row[4]
    if (raw === '' || raw === null || raw === undefined) {
      if (treatEmptyAsMissing)
        entries.push({ cardId: card.id, quantity: 0, offeredQuantity: 0, wanted: true })
      return
    }
    const quantity = Number(raw)
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      issues.push({ row: index + 2, message: 'Hold must be a nonnegative whole number' })
      return
    }
    const offeredValue = row[5]
    const offeredQuantity =
      offeredValue === '' || offeredValue === null || offeredValue === undefined
        ? Math.max(0, quantity - 1)
        : Number(offeredValue)
    if (
      !Number.isSafeInteger(offeredQuantity) ||
      offeredQuantity < 0 ||
      offeredQuantity > quantity
    ) {
      issues.push({
        row: index + 2,
        message: 'Offer must be a nonnegative whole number no greater than Hold',
      })
      return
    }
    const wantedValue = String(row[6] ?? '')
      .trim()
      .toLowerCase()
    if (wantedValue && !['yes', 'no', 'true', 'false', '1', '0'].includes(wantedValue)) {
      issues.push({ row: index + 2, message: 'Wanted must be yes or no' })
      return
    }
    entries.push({
      cardId: card.id,
      quantity,
      offeredQuantity,
      wanted: wantedValue ? ['yes', 'true', '1'].includes(wantedValue) : quantity === 0,
    })
  })
  if (!entries.length && !issues.length) issues.push({ row: 0, message: 'No card rows found' })
  return { entries, issues, totalRows: rows.length }
}

export async function importPreviewToken(
  file: MultipartFile,
  userId: number,
  checklistId: number,
  version: number,
  emptyAsMissing: boolean
) {
  if (!file.tmpPath) throw new CollectionError(422, 'Upload a valid spreadsheet')
  const digest = createHash('sha256')
    .update(await readFile(file.tmpPath))
    .digest('hex')
  return createHmac('sha256', env.get('APP_KEY').release())
    .update(`${userId}:${checklistId}:${version}:${emptyAsMissing}:${digest}`)
    .digest('hex')
}
export function validPreviewToken(expected: string, actual: string) {
  const first = Buffer.from(expected, 'utf8')
  const second = Buffer.from(actual, 'utf8')
  return first.length === second.length && timingSafeEqual(first, second)
}
