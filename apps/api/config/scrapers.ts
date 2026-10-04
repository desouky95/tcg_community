import { collectionKey, type ScraperConfig } from '#services/scrapers/contracts'

const scrapersConfig = {
  maxConcurrentJobs: 2,
  outputDirectory: 'scrapes',
  insertIntoDb: true,
  collections: [
    {
      source: 'laststicker',
      url: 'https://www.laststicker.com/cards/topps_premier_league_2026-2027_flagship_edition/',
      key: collectionKey('topps-premier-league-2026-2027-flagship-edition'),
      enabled: true,
      type: 'card',
      request: {
        timeoutMs: 30_000,
        minIntervalMs: 1_500,
      },
    },
    {
      source: 'laststicker',
      url: 'https://www.laststicker.com/cards/panini_world_cup_2026/',
      key: collectionKey('panini-world-cup-2026'),
      enabled: true,
      type: 'sticker',
      request: {
        timeoutMs: 30_000,
        minIntervalMs: 1_500,
      },
    },
  ],
} as const satisfies ScraperConfig

export default scrapersConfig
