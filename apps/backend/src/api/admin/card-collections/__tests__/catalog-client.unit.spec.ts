import CardCatalogService from "../../../../modules/card-catalog/service"

describe("card catalog client configuration", () => {
  const originalFetch = global.fetch
  afterEach(() => { global.fetch = originalFetch })

  it("uses the configured catalog URL and service key", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ collections: [], total: 0 }) })
    global.fetch = fetchMock as any
    const service = new CardCatalogService({}, { baseUrl: "http://api:3333/api/v1/internal/card-catalog/", apiKey: "test-service-key" })
    await service.listCollections("", 1)
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api:3333/api/v1/internal/card-catalog/collections?search=&page=1&limit=50",
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer test-service-key" }) })
    )
  })

  it("reports authentication failures without exposing the key", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 }) as any
    const service = new CardCatalogService({}, { baseUrl: "http://api:3333/api/v1/internal/card-catalog", apiKey: "test-service-key" })
    await expect(service.listCollections()).rejects.toThrow("CARD_CATALOG_API_KEY matches")
  })
})
