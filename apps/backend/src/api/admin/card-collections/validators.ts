import { z } from "@medusajs/framework/zod"

export const CreateCardCollectionSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional(),
  collection_id: z.string().regex(/^[1-9]\d*$/),
  cards: z.array(z.object({
    id: z.string().regex(/^[1-9]\d*$/),
    price: z.number().finite().positive().multipleOf(0.01),
  })).min(1).max(100),
})
export type CreateCardCollection = z.infer<typeof CreateCardCollectionSchema>
