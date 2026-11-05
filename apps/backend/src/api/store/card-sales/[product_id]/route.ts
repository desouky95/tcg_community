import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";


import { CARD_CATALOG_MODULE } from "../../../../modules/card-catalog";

import CardCatalogModuleService from "../../../../modules/card-catalog/service";
import CardSaleModuleService from "../../../../modules/collection-sale/service";
import { CARD_SALE_MODULE } from "../../../../modules/collection-sale";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { product_id } = req.params;

  const cardSaleService =
    req.scope.resolve<CardSaleModuleService>(CARD_SALE_MODULE);

  const cardCatalogService =
    req.scope.resolve<CardCatalogModuleService>(CARD_CATALOG_MODULE);

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  /**
   * Get Medusa product.
   */
  const { data: products } = await query.graph({
    entity: "product",

    fields: [
      "id",
      "title",
      "handle",
      "description",
      "thumbnail",
      "variants.id",
      "variants.title",
    ],

    filters: {
      id: product_id,
    },
  });

  const product = products[0];

  if (!product) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found.");
  }

  /**
   * Get sale + items.
   */
  const sales = await cardSaleService.listCardSales(
    {
      product_id,
      status: "active",
    },
    {
      relations: ["items"],
    }
  );

  const sale = sales[0];

  if (!sale) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No active card sale exists for this product."
    );
  }

  const activeItems = sale.items.filter(
    (item) => item.status === "active" && item.quantity_available > 0
  );

  /**
   * Batch-fetch cards.
   */
  const cardIds = activeItems.map((item) => item.external_card_id);

  const [collection, cards] = await Promise.all([
    cardCatalogService.retrieveCollection(sale.external_collection_id),

    cardCatalogService.retrieveCards(cardIds),
  ]);

  const cardsById = new Map(cards.map((card) => [card.id, card]));

  /**
   * Merge commerce data
   * with card catalog data.
   */
  const items = activeItems
    .map((item) => {
      const card = cardsById.get(item.external_card_id);

      if (!card) {
        return null;
      }

      return {
        id: item.id,

        price: item.unit_price,

        currency_code: item.currency_code,

        quantity_available: item.quantity_available,

        condition: item.condition,

        card,
      };
    })
    .filter(Boolean);

  res.json({
    product,

    sale: {
      id: sale.id,

      collection,

      items,
    },
  });
}
