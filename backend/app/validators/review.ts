import vine from '@vinejs/vine'

export const addReviewValidator = vine.create({
  targetUserId: vine.number().exists({ table: 'users', column: 'id' }),
  type: vine.enum(['positive', 'negative']),
  comment: vine.string().nullable(),
})
