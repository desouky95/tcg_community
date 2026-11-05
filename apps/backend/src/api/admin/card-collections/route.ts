import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { CARD_CATALOG_MODULE } from "../../../modules/card-catalog"
import CardCatalogService from "../../../modules/card-catalog/service"
import type { CreateCardCollection } from "./validators"

export async function POST(req: MedusaRequest<CreateCardCollection>, res: MedusaResponse) {
  const { title, description, collection_id, cards } = req.validatedBody
  const ids = cards.map((card) => card.id)
  if (new Set(ids).size !== ids.length) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "A card can only be selected once")
  }
  const catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE)
  const [collection, catalogCards] = await Promise.all([
    catalog.retrieveCollection(collection_id), catalog.retrieveCards(ids),
  ])
  const byId = new Map(catalogCards.map((card) => [card.id, card]))
  if (ids.some((id) => !byId.has(id) || byId.get(id)!.collection_id !== collection_id)) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "A selected card is missing or belongs to another checklist")
  }
  const { result } = await createProductsWorkflow(req.scope).run({
    input: { products: [{
      title, description, status: ProductStatus.DRAFT,
      metadata: { type: "card_collection", catalog_collection_id: collection.id, catalog_collection_name: collection.name },
      options: [{ title: "Card", values: ids }],
      variants: cards.map(({ id, price }) => {
        const card = byId.get(id)!
        return {
          title: `${card.number} — ${card.name}`,
          options: { Card: id },
          prices: [{ currency_code: "egp", amount: price }],
          manage_inventory: true,
          allow_backorder: false,
          metadata: { catalog_card_id: id, catalog_collection_id: collection_id, card_number: card.number, card_name: card.name, card_image_url: card.image_url ?? null },
        }
      }),
    }] },
  })
  res.status(201).json({ product: result[0] })
}
