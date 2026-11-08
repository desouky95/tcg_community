import vine from '@vinejs/vine'

export const collectionBatchValidator = vine.create({
  expectedVersion: vine.number().positive(),
  entries: vine
    .array(
      vine.object({
        cardId: vine.number().positive(),
        quantity: vine.number().min(0),
        offeredQuantity: vine.number().min(0),
        wanted: vine.boolean(),
        wantedQuantity: vine.number().min(0).optional(),
      })
    )
    .minLength(1),
})
export const collectionVisibilityValidator = vine.create({
  expectedVersion: vine.number().positive(),
  visibility: vine.enum(['private', 'unlisted', 'public'] as const),
})
export const collectionResetValidator = vine.create({
  expectedVersion: vine.number().positive(),
  confirmation: vine.string(),
})
export const collectionImportValidator = vine.create({
  file: vine.file({ extnames: ['xlsx', 'xls'], size: '5mb' }),
  treatEmptyAsMissing: vine.boolean().optional(),
  expectedVersion: vine.number().optional(),
  previewToken: vine.string().optional(),
})
