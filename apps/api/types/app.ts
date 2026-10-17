import { type FilesService } from '#services/files_service'
import { type FilteringService } from '#services/filtering_service'
import { type PaginationService } from '#services/pagination_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    pagination: PaginationService
    filtering: FilteringService
    filesService: FilesService
  }
}
