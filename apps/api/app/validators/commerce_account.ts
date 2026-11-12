import vine from '@vinejs/vine'

export const addressValidator = vine.create({
  first_name: vine.string().trim().minLength(1).maxLength(255),
  last_name: vine.string().trim().minLength(1).maxLength(255),
  address_1: vine.string().trim().minLength(1).maxLength(255),
  address_2: vine.string().trim().maxLength(255).optional(),
  city: vine.string().trim().minLength(1).maxLength(255),
  province: vine.string().trim().maxLength(255).optional(),
  postal_code: vine.string().trim().maxLength(32).optional(),
  country_code: vine.string().trim().fixedLength(2),
  phone: vine.string().trim().maxLength(32).optional(),
})
