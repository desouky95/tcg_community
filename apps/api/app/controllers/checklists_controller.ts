import Checklist from '#models/checklist'
import Card from '#models/card'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import XLSX from 'xlsx'
import {
  createChecklistValidator,
  importChecklistValidator,
  updateChecklistValidator,
} from '#validators/checklist'
import { parseCardImportRows } from '#services/card_import_service'
import { categoryService } from '#services/category_service'
import stringHelpers from '@adonisjs/core/helpers/string'
import { slugService } from '#services/slug_service'
import { inject } from '@adonisjs/core'
import { ChecklistService } from '#services/checklist_service'
import { checklistCoverStorage } from '#services/checklist_cover_storage'
import { createReadStream } from 'node:fs'
import { access } from 'node:fs/promises'

@inject()
export default class ChecklistsController {
  constructor(private service: ChecklistService) {}
  async index({ response, request, auth }: HttpContext) {
    const category = request.input('category')
    const q = request.input('q')
    const params = {
      category,
      q,
    }

    const query = Checklist.query().preload('category')
    if (params.category) {
      query.if(params.category, (c) =>
        c.whereHas('category', (cat) =>
          cat.where('slug', category).orWhereHas('parent', (p) => p.where('slug', category))
        )
      )
    }

    if (params.q) {
      query.andWhere((_qs) => {
        _qs.if(params.q, (search) =>
          search.andWhereILike('name', `%${q}%`).orWhereILike('slug', `%${q}%`)
        )
      })
    }

    const result = await query

    return response.api(result)
  }

  async show({ params, auth, response, request }: HttpContext) {
    const id = params.id
    const qs = request.qs()
    const user = auth.user
    const checklist = await this.service.get(id, qs, user)

    return response.api(checklist)
  }

  async cover({ params, response }: HttpContext) {
    const checklist = await Checklist.find(params.id)
    if (!checklist?.coverImagePath) {
      return response.notFound({ error: 'Checklist cover image not found.' })
    }

    const coverPath = checklistCoverStorage.path(checklist.coverImagePath)
    try {
      await access(coverPath)
    } catch {
      return response.notFound({ error: 'Checklist cover image not found.' })
    }

    response.header('Content-Type', checklistCoverStorage.contentType(checklist.coverImagePath))
    response.header('Cache-Control', 'public, max-age=31536000, immutable')
    return response.stream(createReadStream(coverPath))
  }

  private async importCards(checklist: Checklist, file: any, trx: any) {
    if (!file || !file.isValid) return

    const workbook = XLSX.readFile(file.tmpPath!)
    const cardsSheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!cardsSheet) return

    const cardsData = XLSX.utils.sheet_to_json<Record<string, unknown>>(cardsSheet)
    if (cardsData.length === 0) return
    const cards = parseCardImportRows(cardsData)
    const baseRows = cards.filter((card) => !card.variant)
    const variantRows = cards.filter((card) => card.variant)

    await Card.query({ client: trx }).where('checklistId', checklist.id).delete()

    const bases = await Card.createMany(
      baseRows.map((card) => ({
        checklistId: checklist.id,
        number: card.number,
        name: card.name,
        type: card.type,
        section: card.section,
        variant: null,
        baseCardId: null,
        order: card.order,
      })),
      { client: trx }
    )
    const baseIds = new Map(bases.map((card) => [card.number, card.id]))

    await Card.createMany(
      variantRows.map((card) => ({
        checklistId: checklist.id,
        number: card.number,
        name: card.name,
        type: card.type,
        section: card.section,
        variant: card.variant,
        baseCardId: baseIds.get(card.baseNumber!)!,
        order: card.order,
      })),
      { client: trx }
    )

    checklist.totalCards = baseRows.length
    await checklist.save()
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const data = await request.validateUsing(createChecklistValidator)
    const file = request.file('file', {
      size: '10mb',
      extnames: ['xlsx', 'xls', 'zip'],
    })
    const coverImage = request.file('coverImage', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (coverImage && !coverImage.isValid) {
      return response.unprocessableEntity({ errors: coverImage.errors })
    }

    let storedCoverImage: string | null = null
    try {
      const category = await categoryService.findBySlug(data.categoryId)
      const slug = stringHelpers.slug(data.name)
      const checklist = await db.transaction(async (trx) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const _checklist = await Checklist.create(
          {
            name: data.name,
            year: data.year as unknown as number,
            type: data.type,
            totalCards: data.totalCards,
            categoryId: category.id,
            slug,
          },
          { client: trx }
        )

        if (coverImage) {
          storedCoverImage = await checklistCoverStorage.store(_checklist.id, coverImage)
          _checklist.coverImagePath = storedCoverImage
          await _checklist.save()
        }

        if (file) {
          await this.importCards(_checklist, file, trx)
        }

        return _checklist
      })

      return response.status(201).json(checklist)
    } catch (err) {
      await checklistCoverStorage.remove(storedCoverImage).catch(console.error)
      console.error('Submission error:', err)
      return response.internalServerError({
        error: 'Failed to publish checklist. Check file format.',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const coverImage = request.file('coverImage', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (coverImage && !coverImage.isValid) {
      return response.unprocessableEntity({ errors: coverImage.errors })
    }

    let storedCoverImage: string | null = null
    let previousCoverImage: string | null = null
    try {
      const data = await request.validateUsing(updateChecklistValidator, {
        meta: { id: params.id },
      })
      const category = await categoryService.findBySlug(data.categoryId)
      const result = await db.transaction(async (trx) => {
        const checklist = await Checklist.findOrFail(params.id, { client: trx })
        const slug = stringHelpers.slug(data.name)

        await slugService.checkSlug(checklist.id, slug, Checklist)
        checklist.merge({
          name: data.name,
          year: data.year as unknown as number,
          type: data.type,
          totalCards: data.totalCards,
          categoryId: category.id,
          slug,
        })

        if (coverImage) {
          previousCoverImage = checklist.coverImagePath
          storedCoverImage = await checklistCoverStorage.store(checklist.id, coverImage)
          checklist.coverImagePath = storedCoverImage
        }
        await checklist.save()

        return checklist
      })

      if (storedCoverImage && previousCoverImage) {
        await checklistCoverStorage.remove(previousCoverImage).catch(console.error)
      }
      return response.api(result)
    } catch (err) {
      await checklistCoverStorage.remove(storedCoverImage).catch(console.error)
      console.error('Update error:', err)
      return response.internalServerError({ error: 'Failed to update checklist.' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const checklist = await Checklist.findOrFail(params.id)
    await Card.query().where('checklistId', checklist.id).delete()
    await checklist.delete()
    return response.ok({ message: 'Checklist deleted successfully' })
  }

  async download({ request, response }: HttpContext) {
    const id = request.param('id')
    const checklist = await this.service.get(id, {})
    const file = await this.service.download(checklist)

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename="report.xlsx"')
    return response.stream(file)
  }

  async import({ request, response, params, auth }: HttpContext) {
    const data = await request.validateUsing(importChecklistValidator)
    const slug = params.di
    const checklist = await this.service.get(slug, {})
    const user = auth.user
    this.service.import(user!, checklist, data.file)

    return response.ok('')
  }
}
