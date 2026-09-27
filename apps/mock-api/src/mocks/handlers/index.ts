import { accountHandlers } from './account.js'
import { authHandlers } from './auth.js'
import { catalogueHandlers } from './catalogue.js'
import { legacyHandlers } from './legacy.js'

export const handlers = [...authHandlers, ...accountHandlers, ...catalogueHandlers, ...legacyHandlers]
