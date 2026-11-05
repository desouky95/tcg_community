import { POST } from "../route"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

jest.mock("@medusajs/medusa/core-flows", () => ({ createProductsWorkflow: jest.fn() }))

describe("card collection product creation", () => {
  const run = jest.fn()
  const catalog = {
    retrieveCollection: jest.fn(),
    retrieveCards: jest.fn(),
  }
  const response = { status: jest.fn().mockReturnThis(), json: jest.fn() }
  const request = (cards: { id: string; price: number }[]) => ({
    validatedBody: { title: "Checklist", collection_id: "7", cards },
    scope: { resolve: jest.fn().mockReturnValue(catalog) },
  }) as any

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createProductsWorkflow as unknown as jest.Mock).mockReturnValue({ run })
    run.mockResolvedValue({ result: [{ id: "prod_1" }] })
    catalog.retrieveCollection.mockResolvedValue({ id: "7", name: "Checklist" })
    catalog.retrieveCards.mockResolvedValue([{ id: "10", collection_id: "7", number: "A1", name: "Player" }])
  })

  it("creates a draft with a priced, inventory-managed variant and catalog identity", async () => {
    await POST(request([{ id: "10", price: 12.5 }]), response as any)
    const product = run.mock.calls[0][0].input.products[0]
    expect(product.status).toBe("draft")
    expect(product.variants).toEqual([expect.objectContaining({
      title: "A1 — Player", manage_inventory: true, allow_backorder: false,
      prices: [{ currency_code: "egp", amount: 12.5 }],
      metadata: expect.objectContaining({ catalog_card_id: "10", catalog_collection_id: "7" }),
    })])
    expect(response.status).toHaveBeenCalledWith(201)
  })

  it("rejects duplicate cards before creating anything", async () => {
    await expect(POST(request([{ id: "10", price: 1 }, { id: "10", price: 2 }]), response as any)).rejects.toThrow("only be selected once")
    expect(run).not.toHaveBeenCalled()
  })

  it("rejects cards from another checklist", async () => {
    catalog.retrieveCards.mockResolvedValue([{ id: "10", collection_id: "8" }])
    await expect(POST(request([{ id: "10", price: 1 }]), response as any)).rejects.toThrow("belongs to another checklist")
    expect(run).not.toHaveBeenCalled()
  })
})
