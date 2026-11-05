import { z } from "@medusajs/framework/zod";

export const PostCardSaleItemsSchema = z.object({
  items: z
    .array(
      z.object({
        sale_item_id: z.string().min(1),

        quantity: z.number().int().positive().default(1),
      })
    )
    .min(1),
});

export type PostCardSaleItems = z.infer<typeof PostCardSaleItemsSchema>;
