import vine from '@vinejs/vine'
import { EGYPT_GOVERNORATES } from './user.js'

const password = () => vine.string().minLength(8).maxLength(72)

export const otpLoginValidator = vine.create({
  mobile: vine.string().mobile(),
  otp: vine.string().minLength(6).maxLength(6),
})

export const passwordRecoveryValidator = vine.create({
  mobile: vine.string().mobile(),
  otp: vine.string().minLength(6).maxLength(6).optional(),
  password: password().optional(),
  passwordConfirmation: password().sameAs('password').optional(),
})

export const preferencesValidator = vine.create({
  locale: vine.enum(['en', 'ar'] as const).optional(),
  theme: vine.enum(['system', 'light', 'dark'] as const).optional(),
  privacy: vine
    .object({
      showProfile: vine.boolean().optional(),
      showCollection: vine.boolean().optional(),
    })
    .optional(),
  communication: vine
    .object({
      whatsapp: vine.boolean().optional(),
      email: vine.boolean().optional(),
    })
    .optional(),
})

export const accountActionValidator = vine.create({
  confirmation: vine.string().optional(),
  expectedVersion: vine.number().optional(),
})

export const profileVersionValidator = vine.create({
  expectedVersion: vine.number().optional(),
  fullName: vine.string().minLength(3).optional(),
  email: vine.string().email().maxLength(254).optional(),
  mobile: vine
    .string()
    .mobile({ locale: ['ar-EG'] })
    .optional(),
  governorate: vine.enum(EGYPT_GOVERNORATES).optional(),
  notReadyForSwap: vine.boolean().optional(),
})
