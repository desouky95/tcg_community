import scrapersConfig from '#config/scrapers'
import Card from '#models/card'
import Checklist from '#models/checklist'
import {
  collectionKey,
  scrapeJobId,
  type ScrapeJobResult,
  type ScrapeJobSnapshot,
  type ScraperCollectionConfig,
  type ScrapedCollection,
} from '#services/scrapers/contracts'
import LastStickerScraper from '#services/scrapers/laststicker_scraper'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import { randomUUID } from 'node:crypto'
import { readdir, readdirSync } from 'node:fs'
import { mkdir, writeFile, glob } from 'node:fs/promises'
import { join } from 'node:path'

export class UnknownScraperCollectionError extends Error {}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown scraper failure'
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

class ScrapeJobRunner {
  readonly #jobs = new Map<string, ScrapeJobSnapshot>()
  readonly #pending: string[] = []
  #draining = false
  #lastRequestAt = 0

  listCollections(): readonly ScraperCollectionConfig[] {
    return scrapersConfig.collections
  }

  listJobs() {
    const relativeDirectory = join(scrapersConfig.outputDirectory)
    const directory = app.tmpPath(relativeDirectory)

    const jobs = readdirSync(directory, { recursive: true, withFileTypes: true })

    return jobs
  }

  enqueue(requestedCollections?: readonly string[]): ScrapeJobSnapshot {
    const collections = this.#resolveCollections(requestedCollections)
    const id = scrapeJobId(randomUUID())
    const job = {
      id,
      collections: collections.map(({ key }) => key),
      createdAt: new Date().toISOString(),
      status: 'queued',
    } as const satisfies ScrapeJobSnapshot

    this.#jobs.set(id, job)
    this.#pending.push(id)
    queueMicrotask(() => void this.#drain())

    return job
  }

  find(id: string): ScrapeJobSnapshot | undefined {
    return this.#jobs.get(id)
  }

  #resolveCollections(requested?: readonly string[]): readonly ScraperCollectionConfig[] {
    const enabledCollections = scrapersConfig.collections.filter(({ enabled }) => enabled)
    if (!requested?.length) return enabledCollections

    const requestedKeys = new Set(requested.map(collectionKey))
    const selected = enabledCollections.filter(({ key }) => requestedKeys.has(key))
    const missing = [...requestedKeys].filter((key) => !selected.some((item) => item.key === key))

    if (missing.length > 0) {
      throw new UnknownScraperCollectionError(
        `Unknown or disabled scraper collections: ${missing.join(', ')}`
      )
    }

    return selected
  }

  async #drain(): Promise<void> {
    if (this.#draining) return
    this.#draining = true

    try {
      while (this.#pending.length > 0) {
        const id = this.#pending.shift()
        if (!id) continue
        await this.#run(id)
      }
    } finally {
      this.#draining = false
    }
  }

  async #run(id: string): Promise<void> {
    const queued = this.#jobs.get(id)
    if (!queued || queued.status !== 'queued') return

    const startedAt = new Date().toISOString()
    this.#jobs.set(id, { ...queued, status: 'running', startedAt })
    const results: ScrapeJobResult[] = []

    try {
      for (const key of queued.collections) {
        const config = scrapersConfig.collections.find((item) => item.key === key)
        if (!config) throw new UnknownScraperCollectionError(`Missing scraper config: ${key}`)
        await this.#respectRequestInterval(config.request.minIntervalMs)

        const collection = await this.#scrape(config)
        results.push(await this.#writeArtifact(id, collection, config))
      }

      this.#jobs.set(id, {
        ...queued,
        status: 'completed',
        startedAt,
        finishedAt: new Date().toISOString(),
        results,
      })
      logger.info({ scrapeJobId: id, results }, 'Scrape job completed')
    } catch (error) {
      const message = errorMessage(error)
      this.#jobs.set(id, {
        ...queued,
        status: 'failed',
        startedAt,
        finishedAt: new Date().toISOString(),
        error: message,
      })
      logger.error({ error: message, scrapeJobId: id }, 'Scrape job failed')
    }
  }

  #scrape(config: ScraperCollectionConfig): Promise<ScrapedCollection> {
    return new LastStickerScraper().scrape(config)
  }

  async #respectRequestInterval(minimumIntervalMs: number): Promise<void> {
    const remainingDelay = minimumIntervalMs - (Date.now() - this.#lastRequestAt)
    if (remainingDelay > 0) await wait(remainingDelay)
    this.#lastRequestAt = Date.now()
  }

  async #writeArtifact(
    id: string,
    collection: ScrapedCollection,
    config: ScraperCollectionConfig
  ): Promise<ScrapeJobResult> {
    const relativeDirectory = join(scrapersConfig.outputDirectory, id)
    const directory = app.tmpPath(relativeDirectory)
    const filename = `${collection.key}.json`
    await mkdir(directory, { recursive: true })
    await writeFile(join(directory, filename), `${JSON.stringify(collection, null, 2)}\n`, 'utf8')

    if (scrapersConfig.insertIntoDb) {
      const slug = collection.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .replace(/\s+/g, '-')
      let checklist = await Checklist.findBy('slug', slug)

      if (!checklist) {
        checklist = await Checklist.create({
          slug,
          name: collection.title,
          year: collection.year ?? 0,
          status: 'draft',
          totalCards: collection.checklistCardCount,
          type: config.type,
        })
      } else {
        checklist.merge({
          name: collection.title,
          year: collection.year ?? 0,
          totalCards: collection.checklistCardCount,
          type: config.type,
        })
        await checklist.save()
      }
      await Card.query().where('checklist_id', checklist.id).delete()
      await Card.createMany(
        collection.cards.map((card, index) => ({
          checklistId: checklist.id,
          name: card.title,
          number: card.number,
          section: card.section ?? null,
          type: card.type ?? null,
          order: index + 1,
          status: 'draft',
        }))
      )
    }
    return {
      collection: collection.key,
      cardCount: collection.checklistCardCount,
      artifact: join('tmp', relativeDirectory, filename),
    }
  }
}

export const scrapeJobRunner = new ScrapeJobRunner()
