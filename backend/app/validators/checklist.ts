import vine from '@vinejs/vine'

export const createChecklistValidator = vine.create({
  type: vine.enum(['sticker', 'card']),
  name: vine.string().trim().unique({
    table: 'checklists',
    column: 'name',
  }),
  year: vine.number(),
  totalCards: vine.number().optional(),
  categoryId: vine.number().exists({
    table: 'categories',
    column: 'id',
  }),
  subcategoryId: vine.number().exists({
    table: 'categories',
    column: 'id',
    filter(db, value, field) {
      db.where('parent_id', field.data.categoryId)
    },
  }),
})
