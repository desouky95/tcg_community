import type { FilterItem } from '../app/interfaces/pagination.controller.ts'

declare module '@adonisjs/core/http' {
  export interface HttpResponse {
    /**
     * Send a standardized API response
     */
    api(data: any, meta?: Record<string, any>): void

    /**
     * Send a paginated response
     */
    paginated(items: any[], pagination?: Record<string, any>, filters?: Array<FilterItem>): void
  }
}
