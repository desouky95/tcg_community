import { createStep, createWorkflow, StepResponse, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, MedusaError, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow, createInventoryLevelsWorkflow, updateInventoryLevelsWorkflow, updateProductVariantsWorkflow } from "@medusajs/medusa/core-flows"
import { CARD_CATALOG_MODULE } from "../modules/card-catalog"
import CardCatalogService from "../modules/card-catalog/service"
import type { CreateMissingList, UpdateMissingList } from "../api/admin/missing-lists/validators"

const prepare = createStep("prepare", async (input: CreateMissingList, { container }) => {
  const keys = input.cards.map(c => input.collection_id ? c.id : c.number.toLocaleLowerCase())
  if (keys.some(k => !k) || new Set(keys).size !== keys.length) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Cards must have unique identities")
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: locations } = await query.graph({ entity: "stock_location", fields: ["id"], filters: { id: input.location_id } })
  if (!locations.length) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Stock location not found")
  let cards = input.cards.map(c => input.collection_id ? c : { ...c, id: undefined })
  let collectionName: string | undefined
  if (input.collection_id) {
    const catalog = container.resolve<CardCatalogService>(CARD_CATALOG_MODULE)
    const [collection, catalogCards] = await Promise.all([catalog.retrieveCollection(input.collection_id), catalog.retrieveCards(keys as string[])])
    const byId = new Map(catalogCards.map(c => [c.id, c]))
    if (keys.some(id => !byId.has(id!) || byId.get(id!)!.collection_id !== input.collection_id)) throw new MedusaError(MedusaError.Types.INVALID_DATA, "A card is missing or belongs to another collection")
    collectionName = collection.name
    cards = cards.map(c => ({ ...c, number: byId.get(c.id!)!.number, name: byId.get(c.id!)!.name }))
  }
  return new StepResponse({ ...input, cards, collectionName })
})

const inventoryInput = createStep("inventory-input", async (input: { productId: string; locationId: string }, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({ entity: "product_variant", fields: ["id", "metadata", "inventory_items.inventory_item_id"], filters: { product_id: input.productId } })
  const levels = data.map((v: any) => {
    if (v.inventory_items?.length !== 1) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, "Variant inventory item not found")
    return { inventory_item_id: v.inventory_items[0].inventory_item_id, location_id: input.locationId, stocked_quantity: v.metadata.active ? v.metadata.quantity : 0 }
  })
  return new StepResponse({ inventory_levels: levels })
})

export const createMissingListWorkflow = createWorkflow("create-missing-list", function (input: CreateMissingList) {
  const prepared = prepare(input)
  const productInput = transform({ prepared }, ({ prepared }) => ({ products: [{
    title: prepared.title, status: ProductStatus.DRAFT,
    metadata: { type: "missing_list", location_id: prepared.location_id, catalog_collection_id: prepared.collection_id ?? null, catalog_collection_name: prepared.collectionName ?? null },
    options: [{ title: "Card", values: prepared.cards.map((c, i) => c.id ?? String(i + 1)) }],
    variants: prepared.cards.map((c, i) => ({ title: `${c.number} — ${c.name}`, options: { Card: c.id ?? String(i + 1) }, prices: [{ currency_code: "egp", amount: c.price }], manage_inventory: true, allow_backorder: false, metadata: { card_number: c.number, card_name: c.name, catalog_card_id: c.id ?? null, active: c.active, quantity: c.quantity, price: c.price } })),
  }] }))
  const products = createProductsWorkflow.runAsStep({ input: productInput })
  const ids = transform({ products, prepared }, ({ products, prepared }) => ({ productId: products[0].id, locationId: prepared.location_id }))
  const inventory = inventoryInput(ids)
  createInventoryLevelsWorkflow.runAsStep({ input: inventory })
  return new WorkflowResponse(products[0])
})

const prepareUpdate = createStep("prepare-update", async (input: UpdateMissingList & { product_id: string }, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: products } = await query.graph({ entity: "product", fields: ["id", "metadata"], filters: { id: input.product_id } })
  const product = products[0]
  if (!product || product.metadata?.type !== "missing_list") throw new MedusaError(MedusaError.Types.NOT_FOUND, "Missing-list product not found")
  const ids = input.cards.map(c => c.id)
  if (new Set(ids).size !== ids.length) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Duplicate cards")
  const { data: variants } = await query.graph({ entity: "product_variant", fields: ["id", "metadata", "inventory_items.inventory_item_id", "inventory_items.inventory.location_levels.id", "inventory_items.inventory.location_levels.location_id"], filters: { product_id: input.product_id } })
  const byId = new Map(variants.map((v: any) => [v.id, v]))
  const location = String(product.metadata.location_id)
  const updates = input.cards.map(c => {
    const v: any = byId.get(c.id)
    const item = v?.inventory_items?.[0]
    const level = item?.inventory?.location_levels?.find((l: any) => l.location_id === location)
    if (!v || !level || v.inventory_items.length !== 1) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Card or inventory level not found")
    return { card: c, variant: v, item, level }
  })
  return new StepResponse({ updates, location })
})
export const updateMissingListWorkflow = createWorkflow("update-missing-list", function (input: UpdateMissingList & { product_id: string }) {
  const prepared = prepareUpdate(input)
  const variants = transform({ prepared }, ({ prepared }) => ({ product_variants: prepared.updates.map(({ card, variant }) => ({ id: card.id, prices: [{ currency_code: "egp", amount: card.price }], metadata: { ...variant.metadata, active: card.active, quantity: card.quantity, price: card.price } })) }))
  const levels = transform({ prepared }, ({ prepared }) => ({ updates: prepared.updates.map(({ card, item, level }) => ({ id: level.id, inventory_item_id: item.inventory_item_id, location_id: prepared.location, stocked_quantity: card.active ? card.quantity : 0 })) }))
  updateProductVariantsWorkflow.runAsStep({ input: variants })
  updateInventoryLevelsWorkflow.runAsStep({ input: levels })
  return new WorkflowResponse({ success: true })
})
