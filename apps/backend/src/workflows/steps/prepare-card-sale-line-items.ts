import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";



import { CARD_CATALOG_MODULE } from "../../modules/card-catalog";

import CardCatalogModuleService from "../../modules/card-catalog/service";
import { CARD_SALE_MODULE } from "../../modules/collection-sale";
import CardSaleModuleService from "../../modules/collection-sale/service";

export type PrepareCardSaleLineItemsInput = {
  cart_id: string;

  items: {
    sale_item_id: string;
    quantity: number;
  }[];
};

export const prepareCardSaleLineItemsStep = createStep(
  "prepare-card-sale-line-items",

  async (
    input: PrepareCardSaleLineItemsInput,

    { container }
  ) => {
    const cardSaleService =
      container.resolve<CardSaleModuleService>(CARD_SALE_MODULE);

    const cardCatalogService =
      container.resolve<CardCatalogModuleService>(CARD_CATALOG_MODULE);

    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    /**
     * Prevent duplicate selection IDs.
     */
    const saleItemIds = input.items.map((item) => item.sale_item_id);

    if (new Set(saleItemIds).size !== saleItemIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Duplicate sale items are not allowed."
      );
    }

    /**
     * Retrieve cart currency.
     */
    const { data: carts } = await query.graph({
      entity: "cart",

      fields: ["id", "currency_code"],

      filters: {
        id: input.cart_id,
      },
    });

    const cart = carts[0];

    if (!cart) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found.");
    }

    /**
     * Retrieve selected sale items
     * and associated CardSale.
     */
    const saleItems = await cardSaleService.listCardSaleItems(
      {
        id: saleItemIds,
      },
      {
        relations: ["sale"],
      }
    );

    if (saleItems.length !== saleItemIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "One or more selected sale items don't exist."
      );
    }

    const saleItemsById = new Map(saleItems.map((item) => [item.id, item]));

    /**
     * Validate every selected item.
     */
    for (const selection of input.items) {
      const item = saleItemsById.get(selection.sale_item_id);

      if (!item) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Sale item ${selection.sale_item_id} not found.`
        );
      }

      if (item.status !== "active") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "This card is no longer available."
        );
      }

      if (item.sale.status !== "active") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "This card sale is no longer active."
        );
      }

      if (selection.quantity > item.quantity_available) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Only ${item.quantity_available} of card ${item.external_card_id} are available.`
        );
      }

      if (
        item.currency_code.toLowerCase() !== cart.currency_code.toLowerCase()
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Card currency ${item.currency_code} doesn't match cart currency ${cart.currency_code}.`
        );
      }
    }

    /**
     * Retrieve external cards
     * in a single request.
     */
    const externalCardIds = saleItems.map((item) => item.external_card_id);

    const cards = await cardCatalogService.retrieveCards(externalCardIds);

    const cardsById = new Map(cards.map((card) => [card.id, card]));

    /**
     * Convert selections into
     * Medusa cart line items.
     */
    const lineItems = input.items.map((selection) => {
      const saleItem = saleItemsById.get(selection.sale_item_id)!;

      const card = cardsById.get(saleItem.external_card_id);

      if (!card) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `External card ${saleItem.external_card_id} could not be found.`
        );
      }

      if (card.collection_id !== saleItem.sale.external_collection_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Card collection mismatch."
        );
      }

      return {
        /**
         * Generic Medusa variant.
         */
        variant_id: saleItem.sale.variant_id,

        quantity: selection.quantity,

        /**
         * Custom card-level price.
         */
        unit_price: Number(saleItem.unit_price),

        /**
         * Snapshot important data.
         */
        metadata: {
          type: "card_sale_item",

          card_sale_id: saleItem.sale.id,

          card_sale_item_id: saleItem.id,

          external_collection_id: saleItem.sale.external_collection_id,

          external_card_id: card.id,

          card_number: card.number,

          card_name: card.name,

          card_image_url: card.image_url || null,

          rarity: card.rarity || null,

          condition: saleItem.condition,
        },
      };
    });

    return new StepResponse(lineItems);
  }
);
