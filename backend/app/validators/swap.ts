import vine from '@vinejs/vine'
import { EGYPT_GOVERNORATES } from './user.js'
import type { Infer } from '@vinejs/vine/types'

export const swapSearchValidator = vine.create(
  vine.object({
    checklists: vine.array(vine.number().positive()).optional(),
    regions: vine.array(vine.enum(EGYPT_GOVERNORATES)).optional(),
    lastLogin: vine.enum(['online', 'today', 'week', 'month', '6months', 'all']).optional(),
  })
)

export type SwapFilter = Infer<typeof swapSearchValidator>
