import { model } from "@medusajs/framework/utils";

import CardSaleItem from "./card-sale-item";

const CardSale = model
  .define("card_sale", {
    id: model.id().primaryKey(),

    /**
     * Medusa product.
     *
     * Example:
     * prod_01ABC...
     */
    product_id: model.text().unique(),

    /**
     * Generic Medusa variant used
     * when adding selected cards
     * to the cart.
     */
    variant_id: model.text(),

    /**
     * ID from your external
     * collection backend.
     *
     * Example:
     * pl-2026
     */
    external_collection_id: model.text().index(),

    status: model.enum(["active", "inactive"]).default("active"),

    items: model.hasMany(() => CardSaleItem, {
      mappedBy: "sale",
    }),
  })
  .cascades({
    delete: ["items"],
  });

export default CardSale;
