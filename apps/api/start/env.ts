/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

// Native server controls remain unprefixed; application settings use API_ names.
process.env.NODE_ENV ??= 'development'
process.env.HOST ??= '0.0.0.0'
process.env.PORT ??= '3333'

export default await Env.create(new URL('../../../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  API_LOG_LEVEL: Env.schema.string(),

  // App
  API_APP_KEY: Env.schema.secret(),
  API_APP_URL: Env.schema.string({ format: 'url', tld: false }),
  API_SOCIAL_AUTH_BRIDGE_SECRET: Env.schema.string.optional(),
  API_PUBLIC_WEB_URL: Env.schema.string.optional({ format: 'url', tld: false }),
  API_COLLECTOR_APP_URL: Env.schema.string.optional({ format: 'url', tld: false }),
  API_WEB_ORIGINS: Env.schema.string.optional(),
  API_SESSION_COOKIE_DOMAIN: Env.schema.string.optional(),
  API_MEDUSA_INTERNAL_URL: Env.schema.string.optional(),
  API_MEDUSA_SERVICE_KEY: Env.schema.secret.optional(),
  API_MEDUSA_PUBLISHABLE_KEY: Env.schema.secret.optional(),
  API_CARD_CATALOG_API_KEY: Env.schema.string.optional(),
  API_SCRAPER_TRIGGER_TOKEN: Env.schema.string.optional(),
  API_FIRECRAWL_API_KEY: Env.schema.string.optional(),

  // Session
  API_SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Database
  API_DB_HOST: Env.schema.string({ format: 'host' }),
  API_DB_PORT: Env.schema.number(),
  API_DB_USER: Env.schema.string(),
  API_DB_PASSWORD: Env.schema.string.optional(),
  API_DB_DATABASE: Env.schema.string(),
  API_TEXT_BEE_API_KEY: Env.schema.string(),
  API_TEXT_BEE_DEVICE_ID: Env.schema.string(),
  API_COLLECTOR_DISK_ENABLED: Env.schema.boolean(),
  API_SWAPS_ENABLED: Env.schema.boolean.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring @adonisjs/queue
  |----------------------------------------------------------
  */
  API_QUEUE_DRIVER: Env.schema.enum(['redis', 'database', 'sync'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  API_DRIVE_DISK: Env.schema.enum(['fs'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  API_GOOGLE_CLIENT_ID: Env.schema.string.optional(),
  API_GOOGLE_CLIENT_SECRET: Env.schema.string.optional(),
  API_FACEBOOK_CLIENT_ID: Env.schema.string(),
  API_FACEBOOK_CLIENT_SECRET: Env.schema.string()
})
