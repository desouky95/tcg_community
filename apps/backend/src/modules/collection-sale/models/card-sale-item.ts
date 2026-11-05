import { model } from "@medusajs/framework/utils";

import CardSale from "./card-sale";

const CardSaleItem = model.define("card_sale_item", {
  id: model.id().primaryKey(),

  /**
   * ID of Card from your
   * external catalog backend.
   */
  external_card_id: model.text().index(),

  /**
   * Price in major currency units.
   *
   * 20 = EGP 20
   * 10.5 = EGP 10.50
   */
  unit_price: model.bigNumber(),

  currency_code: model.text().default("egp"),

  quantity_available: model.number().default(1),

  condition: model
    .enum(["mint", "near_mint", "excellent", "good", "played"])
    .default("near_mint"),

  status: model.enum(["active", "inactive"]).default("active"),

  sale: model.belongsTo(() => CardSale, {
    mappedBy: "items",
  }),
});

export default CardSaleItem;
