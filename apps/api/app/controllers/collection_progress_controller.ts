import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import ExcelJS from 'exceljs'
import { DateTime } from 'luxon'
import Checklist from '#models/checklist'
import UserChecklist from '#models/user_checklist'
import {
  collectionBatchValidator,
  collectionVisibilityValidator,
  collectionResetValidator,
  collectionImportValidator,
} from '#validators/collection'
import {
  CollectionError,
  applyEntries,
  findChecklist,
  findOwned,
  lockCollection,
  previewSpreadsheet,
  setVisibility,
  startCollection,
  recomputeCollectionCounts,
  importPreviewToken,
  validPreviewToken,
  expandQuantityList,
  quantityMapFromList,
} from '#services/collection_progress_service'

export default class CollectionProgressController {
  private async run(ctx: HttpContext, fn: () => Promise<unknown>) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof CollectionError)
        return ctx.response
          .status(error.status)
          .json({ error: { code: 'collection_error', message: error.message } })
      throw error
    }
  }
  private async checklist(id: string) {
    const checklist = await findChecklist(id)
    if (!checklist) throw new CollectionError(404, 'Checklist not found')
    return checklist
  }
  async dashboard(ctx: HttpContext) {
    const collections = await db
      .from('user_checklists as uc')
      .join('checklists as c', 'c.id', 'uc.checklist_id')
      .where('uc.user_id', ctx.auth.user!.id)
      .select(
        'uc.id',
        'uc.version',
        'uc.visibility',
        'uc.missing_list',
        'uc.collected_list',
        'uc.duplicates_list',
        'c.id as checklist_id',
        'c.slug',
        'c.name',
        'c.total_cards'
      )
      .orderBy('uc.updated_at', 'desc')
    const count = (value: string | null) => new Set(expandQuantityList(value)).size
    return ctx.response.json({
      data: collections.map((row) => ({
        id: row.id,
        slug: row.slug ?? String(row.checklist_id),
        name: row.name,
        totalCards: row.total_cards,
        owned: count(row.collected_list),
        wanted: count(row.missing_list),
        offered: count(row.duplicates_list),
        visibility: row.visibility,
        version: row.version,
      })),
    })
  }
  async start(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const checklist = await this.checklist(ctx.params.id)
      const collection = await db.transaction((trx) =>
        startCollection(trx, ctx.auth.user!.id, checklist.id)
      )
      return ctx.response.json({ data: collection })
    })
  }
  async details(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const checklist = /^\d+$/.test(ctx.params.id)
        ? await Checklist.find(Number(ctx.params.id))
        : await Checklist.findBy('slug', ctx.params.id)
      if (!checklist) throw new CollectionError(404, 'Checklist not found')
      const collection = await UserChecklist.query()
        .where('userId', ctx.auth.user!.id)
        .where('checklistId', checklist.id)
        .preload('userCards')
        .first()
      if (!collection) throw new CollectionError(404, 'Collection not found')
      await checklist.load('cards', (cards) =>
        cards.whereNull('variant').orderBy('order').orderBy('id')
      )
      const progressByCardId = new Map(
        collection.userCards
          .filter((progress) => progress.cardId !== null)
          .map((progress) => [progress.cardId, progress])
      )
      const wanted = quantityMapFromList(collection.missingList)
      const held = quantityMapFromList(collection.collectedList)
      const offered = quantityMapFromList(collection.duplicatesList)
      const entries = checklist.cards.map((card) => {
        const progress = progressByCardId.get(card.id)
        const offeredQuantity = progress?.offeredQuantity ?? offered.get(card.number) ?? 0
        const wantedQuantity = progress?.wantedQuantity ?? wanted.get(card.number) ?? 0
        return {
          cardId: card.id,
          number: card.number,
          name: card.name,
          quantity:
            progress?.quantity ??
            Math.max(held.get(card.number) ?? 0, offeredQuantity > 0 ? offeredQuantity + 1 : 0),
          offeredQuantity,
          wanted: wantedQuantity > 0,
          wantedQuantity,
        }
      })
      return ctx.response.json({
        data: {
          id: collection.id,
          checklistId: checklist.id,
          version: collection.version,
          visibility: collection.visibility,
          shareToken: collection.shareToken,
          missingList: collection.missingList,
          entries,
        },
      })
    })
  }
  async batch(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const input = await ctx.request.validateUsing(collectionBatchValidator)
      const checklist = await this.checklist(ctx.params.id)
      const version = await db.transaction(async (trx) => {
        const collection = await lockCollection(
          trx,
          ctx.auth.user!.id,
          checklist.id,
          input.expectedVersion
        )
        return applyEntries(trx, collection, input.entries)
      })
      return ctx.response.json({ data: { version } })
    })
  }
  async visibility(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const input = await ctx.request.validateUsing(collectionVisibilityValidator)
      const checklist = await this.checklist(ctx.params.id)
      const result = await db.transaction(async (trx) =>
        setVisibility(
          trx,
          await lockCollection(trx, ctx.auth.user!.id, checklist.id, input.expectedVersion),
          input.visibility
        )
      )
      return ctx.response.json({ data: result })
    })
  }
  async reset(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const input = await ctx.request.validateUsing(collectionResetValidator)
      if (input.confirmation !== 'RESET') throw new CollectionError(422, 'Type RESET to confirm')
      const checklist = await this.checklist(ctx.params.id)
      await db.transaction(async (trx) => {
        const collection = await lockCollection(
          trx,
          ctx.auth.user!.id,
          checklist.id,
          input.expectedVersion
        )
        await trx.table('collection_audits').insert({
          user_id: ctx.auth.user!.id,
          checklist_id: checklist.id,
          action: 'reset',
          version: collection.version,
          created_at: DateTime.utc().toSQL(),
        })
        await trx.from('user_checklists').where('id', collection.id).delete()
        await recomputeCollectionCounts(trx, checklist.id)
      })
      return ctx.response.json({ data: { removed: true } })
    })
  }
  async preview(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const input = await ctx.request.validateUsing(collectionImportValidator)
      const checklist = await this.checklist(ctx.params.id)
      const collection = await findOwned(ctx.auth.user!.id, checklist.id)
      if (!collection) throw new CollectionError(404, 'Collection not found')
      const result = await previewSpreadsheet(
        input.file,
        checklist.id,
        input.treatEmptyAsMissing ?? false
      )
      const previewToken = await importPreviewToken(
        input.file,
        ctx.auth.user!.id,
        checklist.id,
        collection.version,
        input.treatEmptyAsMissing ?? false
      )
      return ctx.response.json({ data: { ...result, version: collection.version, previewToken } })
    })
  }
  async commit(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const input = await ctx.request.validateUsing(collectionImportValidator)
      if (!input.expectedVersion || !input.previewToken)
        throw new CollectionError(422, 'A preview is required')
      const checklist = await this.checklist(ctx.params.id)
      const expectedToken = await importPreviewToken(
        input.file,
        ctx.auth.user!.id,
        checklist.id,
        input.expectedVersion,
        input.treatEmptyAsMissing ?? false
      )
      if (!validPreviewToken(expectedToken, input.previewToken))
        throw new CollectionError(422, 'The file or preview has changed')
      const preview = await previewSpreadsheet(
        input.file,
        checklist.id,
        input.treatEmptyAsMissing ?? false
      )
      if (preview.issues.length)
        return ctx.response.status(422).json({
          error: {
            code: 'import_invalid',
            message: 'Fix the invalid rows',
            details: preview.issues,
          },
        })
      const result = await db.transaction(async (trx) => {
        const version = await applyEntries(
          trx,
          await lockCollection(trx, ctx.auth.user!.id, checklist.id, input.expectedVersion!),
          preview.entries
        )
        const [audit] = await trx
          .table('collection_audits')
          .insert({
            user_id: ctx.auth.user!.id,
            checklist_id: checklist.id,
            action: 'import',
            version,
            created_at: DateTime.utc().toSQL(),
          })
          .returning('id')
        return { version, auditId: typeof audit === 'object' ? audit.id : audit }
      })
      return ctx.response.json({ data: { imported: preview.entries.length, ...result } })
    })
  }
  async export(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const checklist = await this.checklist(ctx.params.id)
      const snapshot = await db.transaction(async (trx) => {
        const collection = await trx
          .from('user_checklists')
          .where({ user_id: ctx.auth.user!.id, checklist_id: checklist.id })
          .forUpdate()
          .first()
        if (!collection) throw new CollectionError(404, 'Collection not found')
        const cards = await trx
          .from('cards')
          .where('cards.checklist_id', checklist.id)
          .whereNull('cards.variant')
          .leftJoin('user_checklist_cards as uc', (join) =>
            join
              .on('uc.card_id', '=', 'cards.id')
              .andOnVal('uc.user_checklist_id', '=', collection.id)
          )
          .select(
            'cards.number',
            'cards.name',
            'cards.type',
            'cards.section',
            'uc.quantity',
            'uc.offered_quantity',
            'uc.wanted_quantity'
          )
          .orderBy('cards.order')
        return { collection, cards }
      })
      const { collection, cards } = snapshot
      const quantities = (value: string | null) => {
        const result = new Map<string, number>()
        for (const number of expandQuantityList(value))
          result.set(number, (result.get(number) ?? 0) + 1)
        return result
      }
      const wanted = quantities(collection.missing_list)
      const held = quantities(collection.collected_list)
      const offered = quantities(collection.duplicates_list)
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('Collection')
      sheet.columns = [
        { header: 'Number', key: 'number' },
        { header: 'Name', key: 'name' },
        { header: 'Type', key: 'type' },
        { header: 'Section', key: 'section' },
        { header: 'Hold', key: 'quantity' },
        { header: 'Offer', key: 'offer' },
        { header: 'Wanted quantity', key: 'wanted' },
      ]
      cards.forEach((card) =>
        sheet.addRow({
          ...card,
          quantity:
            card.quantity ??
            Math.max(
              held.get(card.number) ?? 0,
              (offered.get(card.number) ?? 0) > 0 ? (offered.get(card.number) ?? 0) + 1 : 0
            ),
          offer: card.offered_quantity ?? offered.get(card.number) ?? 0,
          wanted: card.wanted_quantity ?? wanted.get(card.number) ?? 0,
        })
      )
      const info = workbook.addWorksheet('Metadata')
      info.addRow(['Checklist', checklist.name])
      info.addRow(['Version', collection.version])
      const buffer = await workbook.xlsx.writeBuffer()
      ctx.response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      ctx.response.header('Content-Disposition', 'attachment; filename="collection.xlsx"')
      ctx.response.header('Cache-Control', 'no-store')
      return ctx.response.send(Buffer.from(buffer))
    })
  }
  async sharedView(ctx: HttpContext) {
    return this.publicView(ctx)
  }
  async legacyImport(ctx: HttpContext) {
    return this.commit(ctx)
  }
  async publicView(ctx: HttpContext) {
    return this.run(ctx, async () => {
      const query = db
        .from('user_checklists as uc')
        .join('users as u', 'u.id', 'uc.user_id')
        .join('checklists as c', 'c.id', 'uc.checklist_id')
        .where('u.status', 'active')
        .where('u.blocked', false)
      if (ctx.params.token) {
        if (!/^[a-f0-9]{64}$/.test(ctx.params.token))
          throw new CollectionError(404, 'Collection not found')
        query.where('uc.visibility', 'unlisted').where('uc.share_token', ctx.params.token)
      } else {
        if (!/^\d+$/.test(ctx.params.userId)) throw new CollectionError(404, 'Collection not found')
        const checklist = await this.checklist(ctx.params.checklistId)
        query
          .where('uc.visibility', 'public')
          .where('uc.user_id', ctx.params.userId)
          .where('uc.checklist_id', checklist.id)
      }
      const collection = await query
        .select(
          'uc.id',
          'uc.checklist_id',
          'uc.missing_list',
          'uc.duplicates_list',
          'u.username',
          'u.privacy_preferences',
          'c.name as checklist_name'
        )
        .first()
      if (!collection) throw new CollectionError(404, 'Collection not found')
      const privacy = JSON.parse(collection.privacy_preferences ?? '{}') as {
        showProfile?: boolean
        showCollection?: boolean
      }
      if (privacy.showProfile === false || privacy.showCollection === false)
        throw new CollectionError(404, 'Collection not found')
      // Catalogue order is authoritative; card numbers can be non-numeric or out of sequence.
      const cards = await db
        .from('cards')
        .where('checklist_id', collection.checklist_id)
        .whereNull('variant')
        .select('id', 'number', 'name')
        .orderBy('order')
        .orderBy('id')
      const entries = await db
        .from('user_checklist_cards')
        .where('user_checklist_id', collection.id)
        .select('card_id', 'offered_quantity', 'wanted_quantity')
      const offered = new Map(
        entries.map((entry) => [entry.card_id, Number(entry.offered_quantity)])
      )
      const wanted = new Map(entries.map((entry) => [entry.card_id, Number(entry.wanted_quantity)]))
      const quantities = (value: string | null) => {
        const result = new Map<string, number>()
        for (const number of expandQuantityList(value))
          result.set(number, (result.get(number) ?? 0) + 1)
        return result
      }
      const missingCounts = quantities(collection.missing_list)
      const duplicateCounts = quantities(collection.duplicates_list)
      const missing = cards.flatMap((card) => {
        const quantity = wanted.get(card.id) ?? missingCounts.get(card.number) ?? 0
        return quantity > 0 ? [{ ...card, quantity }] : []
      })
      const duplicates = cards.flatMap((card) => {
        const quantity = offered.get(card.id) ?? duplicateCounts.get(card.number) ?? 0
        return quantity > 0 ? [{ ...card, quantity }] : []
      })
      return ctx.response.json({
        data: {
          checklistId: collection.checklist_id,
          checklistName: collection.checklist_name,
          username: collection.username,
          missing,
          duplicates,
        },
      })
    })
  }
}
