import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const EGYPT_GOVERNORATES = [
  'Cairo',
  'Alexandria',
  'Giza',
  'Dakahlia',
  'Red Sea',
  'Beheira',
  'Fayoum',
  'Gharbia',
  'Ismailia',
  'Monufia',
  'Minya',
  'Qalyubia',
  'New Valley',
  'Sharqia',
  'Suez',
  'Aswan',
  'Assiut',
  'Beni Suef',
  'Port Said',
  'Damietta',
  'South Sinai',
  'Kafr El Sheikh',
  'Matrouh',
  'Luxor',
  'Qena',
  'Sohag',
  'North Sinai',
] as const

/**
 * Validator to use when performing self-signup (Metadata stage)
 */
export const signupValidator = vine.create({
  fullName: vine.string().minLength(3),
  username: vine.string().minLength(3).unique({ table: 'users', column: 'username' }),
  email: email().unique({ table: 'users', column: 'email' }),
  mobile: vine
    .string()
    .mobile({ locale: ['ar-EG'] })
    .unique({ table: 'users', column: 'mobile' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
  governorate: vine.enum(EGYPT_GOVERNORATES),
})

/**
 * Validator for email or mobile/password login
 */
export const loginValidator = vine.create({
  uid: vine.string().minLength(3),
  password: password(),
})

/**
 * Validator for requesting OTP
 */
export const requestOtpValidator = vine.create({
  mobile: vine.string().mobile(),
})

/**
 * Validator for signup with mobile, fullName, and username
 */
export const signupOtpValidator = vine.create({
  mobile: vine.string().mobile().unique({ table: 'users', column: 'mobile' }),
  fullName: vine.string(),
  username: vine.string().unique({ table: 'users', column: 'username' }),
  governorate: vine.enum(EGYPT_GOVERNORATES),
})

/**
 * Validator for verifying OTP
 */
export const verifyOtpValidator = vine.create({
  mobile: vine.string().mobile(),
  otp: vine.string().minLength(6).maxLength(6),
})

/**
 * Validator for updating user profile
 */
export const updateProfileValidator = vine.create({
  fullName: vine.string().minLength(3).optional(),
  email: email()
    .unique({
      table: 'users',
      column: 'email',
      filter: (db, value, field) => {
        db.from('users').whereNot('id', field.meta.userId).where('email', value)
      },
    })
    .optional(),
  mobile: vine
    .string()
    .mobile({ locale: ['ar-EG'] })
    .unique({
      table: 'users',
      column: 'mobile',
      filter: (db, value, field) => {
        db.from('users').whereNot('id', field.meta.userId).where('mobile', value)
      },
    })
    .optional(),
  governorate: vine.enum(EGYPT_GOVERNORATES).optional(),
  notReadyForSwap: vine.boolean().optional(),
})
