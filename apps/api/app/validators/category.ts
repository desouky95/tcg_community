import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createCategoryValidator = vine.create({
  categoryName: vine.string().unique({ table: 'categories', column: 'name' }),
  parentId: vine.string().exists({ table: 'categories', column: 'id' }).optional(),
  subcategories: vine
    .array(vine.string().exists({ table: 'categories', column: 'name' }))
    .optional()
    .requiredWhen((field) => typeof field.data.parentId === 'number'),
})

export const addSubcategoryValidator = vine.create({
  name: vine.string(),
})

export const updateCategoryValidator = vine.create({
  name: vine
    .string()
    .trim()
    .unique({
      table: 'categories',
      column: 'name',
      filter(db, value) {
        db.where('name', '!=', value)
      },
    }),
})

updateCategoryValidator.messagesProvider = new SimpleMessagesProvider({
  unique: 'Category with name `{{data.name}}` already exists',
})
