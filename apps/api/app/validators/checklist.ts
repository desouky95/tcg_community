import vine from '@vinejs/vine'

export const createChecklistValidator = vine.create({
  type: vine.enum(['sticker', 'card']),
  name: vine.string().trim().unique({
    table: 'checklists',
    column: 'name',
  }),
  year: vine.string().minLength(4).maxLength(4),
  totalCards: vine.number().optional(),
  categoryId: vine.string().exists({
    table: 'categories',
    column: 'slug',
  }),
})

export const updateChecklistValidator = vine.withMetaData<{ id: number }>().create({
  type: vine.enum(['sticker', 'card']),
  name: vine
    .string()
    .trim()
    .unique({
      table: 'checklists',
      column: 'name',
      filter(db, value, field) {
        db.where('id', '!=', field.meta.id)
      },
    }),
  year: vine.string().minLength(4).maxLength(4),
  totalCards: vine.number().optional(),
  categoryId: vine.string().exists({
    table: 'categories',
    column: 'slug',
  }),
})

export const importChecklistValidator = vine.create({
  file: vine.file({ extnames: ['xlsx', 'xls'] }),
})
