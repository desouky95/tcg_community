import { http } from '#config/app'
import { PaginationService } from '#services/pagination_service'
import { HttpContext, HttpRequest, HttpResponse } from '@adonisjs/core/http'
import server from '@adonisjs/core/services/server'
import type { ApplicationService } from '@adonisjs/core/types'
import { randomUUID } from 'node:crypto'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    HttpResponse.macro('api', function (this: HttpResponse, data, meta) {
      const requestId = this.request.headers['x-request-id'] || randomUUID()
      return this.json({
        data,
        meta: { requestId, serverTimestamp: new Date().toISOString(), ...meta },
      })
    })

    HttpResponse.macro('paginated', function (this: HttpResponse, items, pagination, filters) {
      const requestId = this.request.headers['x-request-id'] || randomUUID()
      return this.json({
        data: items,
        meta: { requestId, serverTimestamp: new Date().toISOString(), ...pagination, filters },
      })
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
