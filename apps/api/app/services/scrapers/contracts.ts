type Brand<T, Name extends string> = T & { readonly __brand: Name }

export type CollectionKey = Brand<string, 'CollectionKey'>
export type ScrapeJobId = Brand<string, 'ScrapeJobId'>

export function collectionKey(value: string): CollectionKey {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    throw new Error(`Invalid scraper collection key: ${value}`)
  }

  return value as CollectionKey
}

export function scrapeJobId(value: string): ScrapeJobId {
  if (!/^[0-9a-f-]{36}$/.test(value)) {
    throw new Error(`Invalid scrape job id: ${value}`)
  }

  return value as ScrapeJobId
}

export interface ScraperRequestConfig {
  readonly timeoutMs: number
  readonly minIntervalMs: number
}

export interface LastStickerCollectionConfig {
  readonly source: 'laststicker'
  readonly key: CollectionKey
  readonly enabled: boolean
  readonly url: string
  readonly type?: 'sticker' | 'card'
  readonly request: ScraperRequestConfig
  readonly insertIntoDb?: boolean
  readonly updateDb?: boolean
}

export type ScraperCollectionConfig = LastStickerCollectionConfig

export interface ScraperConfig {
  readonly maxConcurrentJobs: number
  readonly outputDirectory: string
  readonly insertIntoDb?: boolean
  readonly collections: readonly ScraperCollectionConfig[]
}

export interface ScrapedCardStats {
  readonly need: number | null
  readonly offer: number | null
  readonly hold: number | null
  readonly needOfferRatio: number | null
}

export interface ScrapedCard {
  readonly number: string
  readonly title: string
  readonly section: string
  readonly type: string
  readonly sourceUrl: string
  readonly stats: ScrapedCardStats
}

export interface ScrapedCollection {
  readonly source: ScraperCollectionConfig['source']
  readonly key: CollectionKey
  readonly sourceUrl: string
  readonly scrapedAt: string
  readonly title: string
  readonly year: number | null
  readonly advertisedCardCount: number | null
  readonly checklistCardCount: number
  readonly imageUrl: string | null
  readonly cards: readonly ScrapedCard[]
}

export interface ScrapeJobResult {
  readonly collection: CollectionKey
  readonly cardCount: number
  readonly artifact: string
}

interface BaseScrapeJob {
  readonly id: ScrapeJobId
  readonly collections: readonly CollectionKey[]
  readonly createdAt: string
}

export type ScrapeJobSnapshot =
  | (BaseScrapeJob & { readonly status: 'queued' })
  | (BaseScrapeJob & { readonly status: 'running'; readonly startedAt: string })
  | (BaseScrapeJob & {
      readonly status: 'completed'
      readonly startedAt: string
      readonly finishedAt: string
      readonly results: readonly ScrapeJobResult[]
    })
  | (BaseScrapeJob & {
      readonly status: 'failed'
      readonly startedAt: string
      readonly finishedAt: string
      readonly error: string
    })

export interface CollectionScraper<TConfig extends ScraperCollectionConfig> {
  scrape(config: TConfig): Promise<ScrapedCollection>
}
