import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

@inject()
export class PaginationService {
  #ctx!: HttpContext
  constructor() {}

  #loadHttpContext() {
    this.#ctx = HttpContext.getOrFail()
  }
  #getPaginationParams() {
    return {
      page: Number(this.#ctx.request.input('page', 1)),
      limit: Number(this.#ctx.request.input('limit', 10)),
    }
  }

  async paginate<T extends LucidModel>(query: ModelQueryBuilderContract<T, InstanceType<T>>) {
    this.#loadHttpContext()
    const { limit, page } = this.#getPaginationParams()
    const result = await query.paginate(page, limit)
    return { data: result.all(), meta: result.getMeta() }
  }

  async filters<T extends LucidModel>(query: ModelQueryBuilderContract<T, InstanceType<T>>) {
    this.#loadHttpContext()
  }
}

let pagination: PaginationService

await app.booted(async (handler) => {
  pagination = await handler.container.make(PaginationService)
  handler.container.alias('pagination', PaginationService)
})

export { pagination as default }
