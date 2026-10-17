import type { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import XLSX from 'xlsx'
type XlsxParserOptions = {
  type: 'xlsx'
  columns: string[]
}
type FileParserOptions = XlsxParserOptions

type XlsxParserReturn = Record<string, unknown>[]
type FileParseReturn = XlsxParserReturn
abstract class FileParser {
  parse(file: MultipartFile, options: FileParserOptions): FileParseReturn {
    throw new Error('Method not implemented')
  }
}

class XlsxParser extends FileParser {
  parse(file: MultipartFile, options: XlsxParserOptions) {
    const workbook = XLSX.readFile(file.tmpPath!)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    if (!sheet) throw new Error('Sheet not found')
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
    if (data.length === 0) throw new Error('Sheet is empty')
    const parsed = data.map((row, index) => {
      const parsedRow: Record<string, unknown> = {}
      for (const column of options.columns) {
        parsedRow[column] = row[column]
      }
      return parsedRow
    })
    return parsed
  }
}
class FileParserFactory {
  static create(type: 'xlsx') {
    switch (type) {
      case 'xlsx':
        return new XlsxParser()
      default:
        throw new Error('File type not supported')
    }
  }
}
export class FilesService {
  parse(type: 'xlsx', file: MultipartFile, options: XlsxParserOptions) {
    const parser = FileParserFactory.create(type)
    return parser.parse(file, options)
  }
}

let filesService: FilesService

await app.booted(async (handler) => {
  filesService = await handler.container.make(FilesService)
  handler.container.alias('filesService', FilesService)
})

export { filesService as default }
