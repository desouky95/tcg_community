import { collectionKey, type LastStickerCollectionConfig } from '#services/scrapers/contracts'
import { parseLastStickerCollection } from '#services/scrapers/laststicker_scraper'
import { test } from '@japa/runner'

const config = {
  source: 'laststicker',
  key: collectionKey('test-collection'),
  enabled: true,
  url: 'https://www.laststicker.com/cards/test_collection/',
  request: {
    timeoutMs: 1_000,
    minIntervalMs: 1_000,
  },
} as const satisfies LastStickerCollectionConfig

test.group('LastSticker scraper', () => {
  test('parses collection metadata and checklist rows', ({ assert }) => {
    const collection = parseLastStickerCollection(
      config,
      `
        <div id="content">
          <h1>Test Collection</h1>
          <p class="big_text"><span>Year: 2026</span><span>Total cards: 15,856</span></p>
          <img src="/i/album/123.jpg">
          <table id="checklist"><tbody>
            <tr><td>1</td><td><a href="/cards/test_collection/1/">Player One</a></td><td>Egypt</td><td>Base</td><td>17</td><td>11</td><td>9</td><td>1.55</td></tr>
            <tr><td>O1</td><td><a href="/cards/test_collection/o1/">Player Two</a></td><td>Egypt</td><td>Optic</td><td></td><td>2</td><td>0</td><td></td></tr>
          </tbody></table>
        </div>
      `
    )

    assert.equal(collection.title, 'Test Collection')
    assert.equal(collection.year, 2026)
    assert.equal(collection.advertisedCardCount, 15_856)
    assert.equal(collection.checklistCardCount, 2)
    assert.equal(collection.cards[0]?.title, 'Player One')
    assert.equal(collection.cards[0]?.stats.needOfferRatio, 1.55)
    assert.equal(collection.cards[1]?.stats.need, null)
    assert.equal(collection.imageUrl, 'https://www.laststicker.com/i/album/123.jpg')
  })

  test('fails when LastSticker changes the expected markup', ({ assert }) => {
    assert.throws(
      () => parseLastStickerCollection(config, '<html><body>No checklist</body></html>'),
      /expected collection markup/
    )
  })
})
