import {
  scrapeJobRunner,
  UnknownScraperCollectionError,
} from '#services/scrapers/scrape_job_runner'
import { startScrapeJobValidator } from '#validators/scraper'
import type { HttpContext } from '@adonisjs/core/http'

export default class ScrappersController {
  collections({ response }: HttpContext) {
    return response.json({
      data: scrapeJobRunner.listCollections().map(({ key, source, url, enabled }) => ({
        key,
        source,
        url,
        enabled,
      })),
    })
  }

  async start({ request, response }: HttpContext) {
    const { collections } = await request.validateUsing(startScrapeJobValidator)

    try {
      const job = scrapeJobRunner.enqueue(collections)

      return response.status(202).json({ data: job })
    } catch (error) {
      if (error instanceof UnknownScraperCollectionError) {
        return response.status(422).json({
          error: { code: 'unknown_scraper_collection', message: error.message },
        })
      }

      throw error
    }
  }

  show({ params, response }: HttpContext) {
    const job = scrapeJobRunner.find(params.jobId)
    if (!job) {
      return response.status(404).json({
        error: { code: 'scrape_job_not_found', message: 'Scrape job not found' },
      })
    }

    return response.json({ data: job })
  }
}
