import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

if (
  process.env.NODE_ENV === "production" &&
  process.env.STRAPI_SYNC_URL &&
  !process.env.EVENTS_REDIS_URL
) {
  throw new Error(
    "EVENTS_REDIS_URL is required for durable Strapi synchronization in production",
  );
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [
    ...(process.env.EVENTS_REDIS_URL
      ? [
          {
            resolve: "@medusajs/medusa/locking",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/locking-redis",
                  id: "strapi-sync-redis",
                  is_default: true,
                  options: { redisUrl: process.env.EVENTS_REDIS_URL },
                },
              ],
            },
          },
          {
            resolve: "@medusajs/medusa/event-bus-redis",
            options: {
              redisUrl: process.env.EVENTS_REDIS_URL,
              jobOptions: {
                attempts: 8,
                backoff: { type: "exponential", delay: 5000 },
                removeOnFail: false,
              },
            },
          },
        ]
      : []),
    {
      resolve: "./src/modules/card-catalog",
      options: {
        baseUrl: process.env.VITE_CARD_CATALOG_URL,
        apiKey: process.env.VITE_CARD_CATALOG_API_KEY,
      },
    },
    {
      resolve: "./src/modules/collection-sale",
      options: {
        baseUrl: process.env.VITE_CARD_CATALOG_URL,
        apiKey: process.env.VITE_CARD_CATALOG_API_KEY,
      },
    },
  ],
  plugins: [
    {
      resolve: "medusa-plugin-content",
      options: {},
    },
    {
      resolve: "@alphabite/medusa-collection-images",
      options: {},
    },
    {
      resolve: "@alphabite/medusa-wishlist",
      options: {
        // all are optional, read bellow about default values
        wishlistFields: [],
        wishlistItemsFields: [],
        includeWishlistItems: true,
        includeWishlistItemsTake: 5,
        allowGuestWishlist: true,
      },
    },
    {
      resolve: "medusa-variant-images",
      options: {},
    },
     {
      resolve: "@alphabite/medusa-category-images",
      options: {},
    },
  ],
});
