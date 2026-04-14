import vine from '@vinejs/vine'

export const createCategoryValidator = vine.create({
  name: vine.string().unique({ table: 'categories', column: 'name' }),
})

export const addSubcategoryValidator = vine.create({
  name: vine.string(),
})
