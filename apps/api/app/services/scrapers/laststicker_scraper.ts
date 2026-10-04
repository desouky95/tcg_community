import type {
  CollectionScraper,
  LastStickerCollectionConfig,
  ScrapedCard,
  ScrapedCollection,
} from '#services/scrapers/contracts'
import env from '#start/env'
import axios from 'axios'
import { load } from 'cheerio'

function nullableNumber(value: string | undefined): number | null {
  if (!value) return null

  const parsed = Number(value.replaceAll(',', '').trim())
  return Number.isFinite(parsed) ? parsed : null
}

function absoluteUrl(value: string | undefined, baseUrl: string): string {
  return value ? new URL(value, baseUrl).toString() : baseUrl
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function firecrawlHtml(value: unknown): string {
  if (
    isRecord(value) &&
    value.success === true &&
    isRecord(value.data) &&
    typeof value.data.html === 'string'
  ) {
    return value.data.html
  }

  const error = isRecord(value) && typeof value.error === 'string' ? value.error : 'unknown error'
  throw new Error(`Firecrawl did not return HTML: ${error}`)
}

export function parseLastStickerCollection(
  config: LastStickerCollectionConfig,
  html: string
): ScrapedCollection {
  const $ = load(html)
  const title = $('#content h1').first().text().trim()
  const metadata = $('#content .big_text').first().text()
  const year = nullableNumber(metadata.match(/Year:\s*([0-9]{4})/i)?.[1])
  const advertisedCardCount = nullableNumber(metadata.match(/Total cards:\s*([0-9,]+)/i)?.[1])
  const imageSource = $('#content img[src*="/i/album/"]').first().attr('src')
  const cards: ScrapedCard[] = []

  $('#checklist tbody tr').each((_index, row) => {
    const cells = $(row).find('td')
    if (cells.length < 4) return

    const number = cells.eq(0).text().trim()
    const titleCell = cells.eq(1)
    const cardTitle = titleCell.find('a').first().text().trim()
    if (!number || !cardTitle) return

    cards.push({
      number,
      title: cardTitle,
      section: cells.eq(2).text().trim(),
      type: cells.eq(3).text().trim(),
      sourceUrl: absoluteUrl(titleCell.find('a').first().attr('href'), config.url),
      stats: {
        need: nullableNumber(cells.eq(4).text()),
        offer: nullableNumber(cells.eq(5).text()),
        hold: nullableNumber(cells.eq(6).text()),
        needOfferRatio: nullableNumber(cells.eq(7).text()),
      },
    })
  })

  if (!title || cards.length === 0) {
    throw new Error(
      `LastSticker page did not contain the expected collection markup: ${config.url}`
    )
  }

  return {
    source: config.source,
    key: config.key,
    sourceUrl: config.url,
    scrapedAt: new Date().toISOString(),
    title,
    year,
    advertisedCardCount,
    checklistCardCount: cards.length,
    imageUrl: imageSource ? absoluteUrl(imageSource, config.url) : null,
    cards,
  }
}

export default class LastStickerScraper implements CollectionScraper<LastStickerCollectionConfig> {
  async scrape(config: LastStickerCollectionConfig): Promise<ScrapedCollection> {
    const url = new URL(config.url)
    if (url.protocol !== 'https:' || url.hostname !== 'www.laststicker.com') {
      throw new Error(`Refusing to scrape an untrusted LastSticker URL: ${config.url}`)
    }

    const apiKey = env.get('FIRECRAWL_API_KEY')
    const response = await axios.post<unknown>(
      'https://api.firecrawl.dev/v2/scrape',
      {
        url: config.url,
        formats: ['html'],
        onlyMainContent: false,
        timeout: config.request.timeoutMs,
      },
      {
        headers: {
          Accept: 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        maxContentLength: 10 * 1024 * 1024,
        timeout: config.request.timeoutMs + 5_000,
      }
    )

    return parseLastStickerCollection(config, firecrawlHtml(response.data))
  }
}
