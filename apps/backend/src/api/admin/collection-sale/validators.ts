import { z } from "@medusajs/framework/zod";

export const PostAdminCardSaleSchema = z.object({
  product_id: z.string().min(1),

  variant_id: z.string().min(1),

  external_collection_id: z.string().min(1),

  items: z
    .array(
      z.object({
        external_card_id: z.string().min(1),

        unit_price: z.number().positive(),

        currency_code: z
          .string()
          .length(3)
          .transform((value) => value.toLowerCase())
          .default("egp"),

        quantity_available: z.number().int().min(0).default(1),

        condition: z
          .enum(["mint", "near_mint", "excellent", "good", "played"])
          .default("near_mint"),
      })
    )
    .min(1),
});

export type PostAdminCardSale = z.infer<typeof PostAdminCardSaleSchema>;
