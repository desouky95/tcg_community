import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import {
  acquireLockStep,
  addToCartWorkflow,
  releaseLockStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";

import { prepareCardSaleLineItemsStep } from "./steps/prepare-card-sale-line-items";

export type AddCardSaleItemsToCartInput = {
  cart_id: string;

  items: {
    sale_item_id: string;
    quantity: number;
  }[];
};

export const addCardSaleItemsToCartWorkflow = createWorkflow(
  "add-card-sale-items-to-cart",

  (input: AddCardSaleItemsToCartInput) => {
    /**
     * Convert sale items into
     * Medusa line items.
     */
    const lineItems = prepareCardSaleLineItemsStep(input);

    /**
     * Lock cart to prevent
     * concurrent cart modifications.
     */
    acquireLockStep({
      key: input.cart_id,

      timeout: 2,

      ttl: 10,
    });

    /**
     * Use Medusa's standard
     * cart workflow.
     */
    addToCartWorkflow.runAsStep({
      input: {
        cart_id: input.cart_id,

        items: lineItems,
      },
    });

    /**
     * Re-fetch updated cart.
     */
    const { data: carts } = useQueryGraphStep({
      entity: "cart",

      fields: [
        "id",
        "currency_code",
        "items.*",
        "items.product.*",
        "items.variant.*",
      ],

      filters: {
        id: input.cart_id,
      },
    }).config({
      name: "refetch-card-sale-cart",
    });

    releaseLockStep({
      key: input.cart_id,
    });

    return new WorkflowResponse({
      cart: carts[0],
    });
  }
);
