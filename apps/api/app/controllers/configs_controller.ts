import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConfigsController {
  async config({ response }: HttpContext) {
    const swaps = env.get('SWAPS_ENABLED')
    const collectorDisk = env.get('COLLECTOR_DISK_ENABLED')
    const flags = { swaps, collectorDisk }
    return response.json(flags)
  }
}
