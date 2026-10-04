import vine from '@vinejs/vine'

export const startScrapeJobValidator = vine.compile(
  vine.object({
    collections: vine.array(vine.string().trim().minLength(1)).maxLength(20).optional(),
  })
)
