import type { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { mkdir, unlink } from 'node:fs/promises'
import { basename, extname } from 'node:path'

const coverMimeTypes = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
} as const satisfies Record<string, string>

export class ChecklistCoverStorage {
  async store(checklistId: number, file: MultipartFile) {
    if (!file.isValid) {
      throw new Error(file.errors.map((error) => error.message).join(', '))
    }

    const extension = `.${file.extname?.toLowerCase()}`
    if (!(extension in coverMimeTypes)) {
      throw new Error('Unsupported checklist cover image type')
    }

    const directory = app.makePath('storage', 'checklist-covers')
    const fileName = `${checklistId}-${randomUUID()}${extension}`
    await mkdir(directory, { recursive: true })
    await file.move(directory, { name: fileName })
    return fileName
  }

  path(fileName: string) {
    if (basename(fileName) !== fileName) {
      throw new Error('Invalid checklist cover image path')
    }
    return app.makePath('storage', 'checklist-covers', fileName)
  }

  contentType(fileName: string) {
    const extension = extname(fileName).toLowerCase()
    return coverMimeTypes[extension as keyof typeof coverMimeTypes] ?? 'application/octet-stream'
  }

  async remove(fileName: string | null | undefined) {
    if (!fileName) return
    try {
      await unlink(this.path(fileName))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
}

export const checklistCoverStorage = new ChecklistCoverStorage()
