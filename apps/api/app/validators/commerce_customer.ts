import vine from '@vinejs/vine'

export const commerceCustomerValidator = vine.create({
  cart_id: vine.string().trim().minLength(1).maxLength(255).optional(),
})
