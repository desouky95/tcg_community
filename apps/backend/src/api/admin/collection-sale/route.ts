import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";



import { CARD_CATALOG_MODULE } from "../../../modules/card-catalog";

import CardCatalogModuleService from "../../../modules/card-catalog/service";

import type { PostAdminCardSale } from "./validators";
import CardSaleModuleService from "../../../modules/collection-sale/service";
import { CARD_SALE_MODULE } from "../../../modules/collection-sale";

export async function POST(
  req: MedusaRequest<PostAdminCardSale>,
  res: MedusaResponse
) {
  const body = req.validatedBody;

  const cardSaleService =
    req.scope.resolve<CardSaleModuleService>(CARD_SALE_MODULE);

  const cardCatalogService =
    req.scope.resolve<CardCatalogModuleService>(CARD_CATALOG_MODULE);

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  /**
   * Verify product exists
   * and variant belongs to product.
   */
  const { data: products } = await query.graph({
    entity: "product",

    fields: ["id", "title", "variants.id"],

    filters: {
      id: body.product_id,
    },
  });

  const product = products[0];

  if (!product) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found.");
  }

  const variant = product.variants?.find(
    (variant: any) => variant.id === body.variant_id
  );

  if (!variant) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Variant does not belong to this product."
    );
  }

  /**
   * Verify external collection exists.
   */
  await cardCatalogService.retrieveCollection(body.external_collection_id);

  /**
   * Prevent duplicate card IDs.
   */
  const cardIds = body.items.map((item) => item.external_card_id);

  if (new Set(cardIds).size !== cardIds.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Duplicate card IDs aren't allowed."
    );
  }

  /**
   * Validate cards against
   * external backend.
   */
  const externalCards = await cardCatalogService.retrieveCards(cardIds);

  const cardsById = new Map(externalCards.map((card) => [card.id, card]));

  for (const saleItem of body.items) {
    const card = cardsById.get(saleItem.external_card_id);

    if (!card) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Card ${saleItem.external_card_id} does not exist.`
      );
    }

    if (card.collection_id !== body.external_collection_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Card ${card.id} doesn't belong to collection ${body.external_collection_id}.`
      );
    }
  }

  /**
   * Create sale.
   */
  const sale = await cardSaleService.createCardSales({
    product_id: body.product_id,

    variant_id: body.variant_id,

    external_collection_id: body.external_collection_id,

    status: "active",
  });

  /**
   * Create sale items.
   */

  const items = await cardSaleService.createCardSaleItems(
    body.items.map((item) => ({
      sale_id: sale.id,
      external_card_id: item.external_card_id,
      unit_price: item.unit_price,
      currency_code: item.currency_code,
      quantity_available: item.quantity_available,
      condition: item.condition,
      status: "active"as any,
    }))
  );

  res.status(201).json({
    sale,
    items,
  });
}
