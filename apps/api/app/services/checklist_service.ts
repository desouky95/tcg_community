import Checklist from '#models/checklist'
import UserChecklist from '#models/user_checklist'
import { inject } from '@adonisjs/core'
import pagination from './pagination_service.ts'
import * as fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import { Exception } from '@adonisjs/core/exceptions'
import { access } from 'node:fs/promises'
import drive from '@adonisjs/drive/services/main'
import ExcelJS from 'exceljs'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import * as xlsx from 'xlsx'
import User from '#models/user'
import Card from '#models/card'
import stringHelpers from '@adonisjs/core/helpers/string'
import UserChecklistCard from '#models/user_checklist_card'
xlsx.set_fs(fs)
@inject()
export class ChecklistService {
  async reCalculate(checklistId: string) {
    console.log('CalcChecklist started')
    const checklist = await Checklist.findOrFail(checklistId)
    await checklist.load('cards', (cards) => cards.whereNull('variant'))
    const usersChecklists = await UserChecklist.query().where('checklist_id', checklistId)

    const missingLists = usersChecklists.map((_) => (_.missingList || '').split(','))
    const duplicatesLists = usersChecklists.map((_) => (_.duplicatesList || '').split(','))
    const collectedLists = usersChecklists.map((_) => (_.collectedList || '').split(','))

    for (const index in checklist.cards) {
      const card = checklist.cards[index]
      const missingCount = missingLists.reduce((prev, curr) => {
        return curr.find((_) => _ === card.number) ? prev + 1 : prev
      }, 0)
      let duplicatesCount =
        duplicatesLists.reduce((prev, curr) => {
          return curr.find((_) => _ === card.number) ? prev + 1 : prev
        }, 0) || 0
      const collectedCount = collectedLists.reduce((prev, curr) => {
        return curr.find((_) => _ === card.number) ? prev + 1 : prev
      }, 0)

      duplicatesCount = duplicatesCount === 0 ? 1 : duplicatesCount
      await card.lockForUpdate(async (release) => {
        const ratio = missingCount / duplicatesCount
        release.needCount = missingCount
        release.holdCount = collectedCount
        release.offerCount = duplicatesCount
        release.ratio = ratio.toFixed(2)
        await release.save()
      })
    }
    console.log('CalcChecklist finished')
  }

  async getUserChecklists(userId: number) {
    return UserChecklist.query().preload('checklist').where('userId', userId)
  }

  async getAll() {
    const query = Checklist.query().preload('category', (q) => {
      q.preload('parent')
    })
    const result = await pagination.paginate(query)
    return result
  }

  async get(slug: string, qs: Record<string, any>, user?: User) {
    const expand = qs.expand ?? ''
    const expendedFields = expand.split(',') as string[]
    const query = Checklist.query()
      .where('slug', slug)

      .if(expendedFields.includes('cards'), (q) => q.preload('cards'))
      .if(expendedFields.includes('category'), (q) =>
        q.preload('category', (c) =>
          c.if(expendedFields.includes('category.parent'), (cp) => cp.preload('parent'))
        )
      )
      .if(expendedFields.includes('userChecklist'), (q) => q.preload('userChecklist'))

    const result = await query.firstOrFail()
    return result
  }

  async download(checklist: Checklist) {
    try {
      const directory = app.makePath('storage', 'checklists')
      const filename = `${checklist.slug}.xlsx`
      const filePath = `checklists/${filename}`
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
      }

      try {
        await access(directory)
      } catch {
        throw new Error('Checklist not found.')
      }

      await checklist.load('cards', (cards) => cards.whereNull('variant').orderBy('order'))
      const cards = checklist.cards.map((card) => ({
        number: card.number,
        name: card.name,
        type: card.type,
        section: card.section,
      }))

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet(checklist.name)
      worksheet.columns = [
        { header: 'Number', key: 'number', width: 14 },
        { header: 'Name', key: 'name', width: 34 },
        { header: 'Type', key: 'type', width: 18 },
        { header: 'Section', key: 'section', width: 22 },
        { header: 'Hold', key: 'holdCount', width: 12 },
      ]
      cards.forEach((card) => worksheet.addRow(card))
      const header = worksheet.getRow(1)
      header.font = { bold: true, color: { argb: 'FFF6F0E6' } }
      header.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF17385E' },
      }
      header.height = 24
      worksheet.views = [{ state: 'frozen', ySplit: 1 }]
      const buffer = await workbook.xlsx.writeBuffer()

      await drive.use('fs').put(filePath, Buffer.from(buffer))
      return await drive.use().getStream(filePath)
    } catch (error: Error | any) {
      throw new Exception(error.message)
    }
  }

  async import(user: User, checklist: Checklist, file: MultipartFile, treatEmptyAsMissing = false) {
    const fileName = `${Date.now()}.${file.extname}`
    await file.move(app.tmpPath('uploads'), { name: fileName })

    const filePath = app.tmpPath(`uploads/${fileName}`)
    if (!filePath) throw new Error('File not found')

    try {
      const workbook = xlsx.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json<string[]>(worksheet, { header: 1, range: 1 })
      const cards = await Promise.all(
        data.map(async (row) => {
          const id = row[0]
          const cardDb = await Card.findByOrFail('number', id)
          const hold = row[4]
          return {
            id,
            cardDb,
            hold: Number(hold),
          }
        })
      )

      const missingCards = cards.filter((_) => !_.hold)
      const collectedCards = cards.filter((_) => _.hold > 0)
      const duplicatesCards = cards.filter((_) => _.hold > 1)

      const userChecklist = await UserChecklist.updateOrCreate(
        {
          checklistId: checklist.id,
          userId: user.id,
        },
        {
          userId: user.id,
          checklistId: checklist.id,
          missingList: treatEmptyAsMissing ? missingCards.map((_) => _.id).join(',') : '',
          collectedList: collectedCards.map((_) => _.id).join(','),
          duplicatesList: duplicatesCards.map((_) => _.id).join(','),
        }
      )

      await UserChecklistCard.query().where('userChecklistId', userChecklist!.id).delete()

      await UserChecklistCard.createMany(
        collectedCards.map((card) => ({
          checklistId: checklist.id,
          quantity: card.hold,
          userChecklistId: userChecklist!.id,
          cardId: card.cardDb?.id!,
        }))
      )

      userChecklist.load('cards')
      return userChecklist
    } catch (error) {
      throw new Exception('Failed to parse file', { status: 400 })
    }
  }
}
