import type { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { CARD_CATALOG_MODULE } from "../../../../../modules/card-catalog";
import CardCatalogService from "../../../../../modules/card-catalog/service";

function safeImageUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function GET(req: MedusaStoreRequest, res: MedusaResponse) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 24);
  const search = String(req.query.search ?? "").trim().toLocaleLowerCase();
  if (
    !Number.isSafeInteger(page) || page < 1 || page > 100_000 ||
    !Number.isSafeInteger(limit) || limit < 1 || limit > 48 || search.length > 100
  ) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid missing-list query");
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { metadata: channelMetadata } = await query.graph({
    entity: "sales_channels",
    fields: ["id"],
    pagination: { take: 2, skip: 0 },
  });
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "status", "metadata", "sales_channels.id"],
    filters: { id: req.params.product_id },
  });
  const product = products[0] as {
    id: string;
    status: string;
    metadata?: Record<string, unknown>;
    sales_channels?: { id: string }[];
  } | undefined;
  const enforceChannelLink = (channelMetadata?.count ?? 0) > 1;
  const visibleInChannel = !enforceChannelLink || product?.sales_channels?.some((channel) =>
    req.publishable_key_context.sales_channel_ids.includes(channel.id),
  );
  if (product?.status !== "published" || !visibleInChannel || product.metadata?.type !== "missing_list") {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Missing-list product not found");
  }

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id", "title", "metadata",
      "inventory_items.inventory.location_levels.location_id",
      "inventory_items.inventory.location_levels.stocked_quantity",
    ],
    filters: { product_id: product.id },
    pagination: { take: 5000, skip: 0 },
  });
  const collectionId = String(product.metadata.catalog_collection_id ?? "");
  let catalog: CardCatalogService | undefined;
  let checklistOrder = new Map<string, number>();
  if (/^[1-9]\d*$/.test(collectionId)) {
    try {
      catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE);
      const { cards: checklistCards } = await catalog.getCollectionCards(collectionId);
      checklistOrder = new Map(checklistCards.map((card, index) => [card.id, index]));
    } catch {
      // Keep cards available in number order if the checklist service is down.
    }
  }
  const cards = variants
    .map((variant: any) => {
      const metadata = variant.metadata ?? {};
      const locationId = String(product.metadata?.location_id ?? "");
      const availableQuantity = (variant.inventory_items ?? [])
        .flatMap((item: any) => item.inventory?.location_levels ?? [])
        .filter((level: any) => level.location_id === locationId)
        .reduce((sum: number, level: any) => sum + Number(level.stocked_quantity ?? 0), 0);
      const number = String(metadata.card_number ?? "");
      const name = String(metadata.card_name ?? "");
      const price = Number(metadata.price);
      return {
        variantId: variant.id,
        catalogCardId: metadata.catalog_card_id ? String(metadata.catalog_card_id) : null,
        number,
        name,
        price: Number.isFinite(price) && price > 0 ? price : null,
        currencyCode: "egp",
        availableQuantity: metadata.active === true ? availableQuantity : 0,
      };
    })
    .filter((card: any) =>
      !search || card.number.toLocaleLowerCase().includes(search) || card.name.toLocaleLowerCase().includes(search),
    )
    .sort((a: any, b: any) => {
      const orderA = a.catalogCardId ? checklistOrder.get(a.catalogCardId) : undefined;
      const orderB = b.catalogCardId ? checklistOrder.get(b.catalogCardId) : undefined;
      if (orderA !== undefined || orderB !== undefined) {
        if (orderA === undefined) return 1;
        if (orderB === undefined) return -1;
        if (orderA !== orderB) return orderA - orderB;
      }
      return a.number.localeCompare(b.number, undefined, { numeric: true, sensitivity: "base" });
    });

  const offset = (page - 1) * limit;
  const visibleCards = cards.slice(offset, offset + limit);
  const catalogIds = [...new Set(visibleCards.flatMap((card: any) => card.catalogCardId ? [card.catalogCardId] : []))];
  let catalogImages = new Map<string, string | null>();
  if (catalogIds.length && !catalog) {
    try {
      catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE);
    } catch {
      // Card imagery is optional; keep the selection usable during catalog outages.
    }
  }
  if (catalogIds.length && catalog) {
    try {
      const externalCards = await catalog.retrieveCards(catalogIds);
      catalogImages = new Map(externalCards.map((card) => [card.id, safeImageUrl(card.image_url)]));
    } catch {
      // Card imagery is optional; keep the selection usable during catalog outages.
    }
  }

  return res.json({
    cards: visibleCards.map((card: any) => ({
      variantId: card.variantId,
      number: card.number,
      name: card.name,
      image: card.catalogCardId ? catalogImages.get(card.catalogCardId) ?? null : null,
      price: card.price,
      currencyCode: card.currencyCode,
      availableQuantity: card.availableQuantity,
    })),
    total: cards.length,
    page,
    limit,
  });
}
