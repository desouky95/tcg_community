import { z } from "@medusajs/framework/zod"

const card = z.object({
  id: z.string().optional(),
  number: z.string().trim().min(1).max(255),
  name: z.string().trim().min(1).max(255),
  price: z.number().finite().positive().multipleOf(0.01),
  quantity: z.number().int().nonnegative().safe(),
  active: z.boolean(),
})
export const CreateMissingListSchema = z.object({
  title: z.string().trim().min(1).max(255),
  location_id: z.string().min(1),
  collection_id: z.string().regex(/^[1-9]\d*$/).optional(),
  cards: z.array(card).min(1).max(5000),
})
export type CreateMissingList = z.infer<typeof CreateMissingListSchema>
export const UpdateMissingListSchema = z.object({
  cards: z.array(z.object({ id: z.string().min(1), price: card.shape.price, quantity: card.shape.quantity, active: z.boolean() })).min(1).max(5000),
})
export type UpdateMissingList = z.infer<typeof UpdateMissingListSchema>
