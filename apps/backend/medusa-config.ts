import { resolve } from "node:path";
import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", resolve(process.cwd(), "../.."));

// Medusa internals read these native names directly.
if (process.env.BACKEND_AUTH_MFA_ENCRYPTION_KEY !== undefined) {
  process.env.AUTH_MFA_ENCRYPTION_KEY =
    process.env.BACKEND_AUTH_MFA_ENCRYPTION_KEY;
}
if (process.env.BACKEND_MEDUSA_ADMIN_ONBOARDING_TYPE !== undefined) {
  process.env.MEDUSA_ADMIN_ONBOARDING_TYPE =
    process.env.BACKEND_MEDUSA_ADMIN_ONBOARDING_TYPE;
}
if (
  process.env.BACKEND_MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY !== undefined
) {
  process.env.MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY =
    process.env.BACKEND_MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY;
}

// if (
//   process.env.NODE_ENV === "production" &&
//   process.env.BACKEND_STRAPI_SYNC_URL &&
//   !process.env.BACKEND_EVENTS_REDIS_URL
// ) {
//   throw new Error(
//     "EVENTS_REDIS_URL is required for durable Strapi synchronization in production",
//   );
// }

module.exports = defineConfig({
  featureFlags: { view_configurations: true },

  projectConfig: {
    databaseUrl: process.env.BACKEND_DATABASE_URL,
    sessionOptions: {
      ttl: 30 * 24 * 60 * 60 * 1000,
      rolling: true,
    },
    cookieOptions: {
      sameSite: "none",
    },
    http: {
      storeCors: process.env.BACKEND_STORE_CORS!,
      adminCors: process.env.BACKEND_ADMIN_CORS!,
      authCors: process.env.BACKEND_AUTH_CORS!,
      jwtSecret: process.env.BACKEND_JWT_SECRET,
      cookieSecret: process.env.BACKEND_COOKIE_SECRET,
    },
    databaseDriverOptions: {
      connection: {
        ssl: { rejectUnauthorized: false },
      },
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/settings",
      options: {
        entityOverrides: {
          InventoryItem: {
            defaultVisibleFields: [
              "title",
              "sku",
              "linked_products",
              "reserved_quantity",
              "stocked_quantity",
            ],
            defaultFieldOrdering: { linked_products: 250 },
            computedColumns: [
              {
                id: "linked_products",
                name: "Product",
                renderMode: "inventory_products",
                requiredFields: [
                  "variants.product.id",
                  "variants.product.title",
                ],
                defaultVisible: true,
                sortable: false,
                filter: { enabled: false },
              },
            ],
          },
        },
      },
    },
    ...(process.env.BACKEND_EVENTS_REDIS_URL
      ? [
          {
            resolve: "@medusajs/medusa/locking",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/locking-redis",
                  id: "strapi-sync-redis",
                  is_default: true,
                  options: { redisUrl: process.env.BACKEND_EVENTS_REDIS_URL },
                },
              ],
            },
          },
          {
            resolve: "@medusajs/medusa/event-bus-redis",
            options: {
              redisUrl: process.env.BACKEND_EVENTS_REDIS_URL,
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
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/offline-payment",
            id: "offline",
          },
        ],
      },
    },
    {
      resolve: "./src/modules/card-catalog",
      options: {
        baseUrl: process.env.BACKEND_VITE_CARD_CATALOG_URL,
        apiKey: process.env.BACKEND_VITE_CARD_CATALOG_API_KEY,
      },
    },
    {
      resolve: "./src/modules/collection-sale",
      options: {
        baseUrl: process.env.BACKEND_VITE_CARD_CATALOG_URL,
        apiKey: process.env.BACKEND_VITE_CARD_CATALOG_API_KEY,
      },
    },
    {
      resolve: "./src/modules/nextpull-user",
      definition: {
        isQueryable: true,
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.BACKEND_S3_FILE_URL,
              access_key_id: process.env.BACKEND_DO_SPACE_ACCESS_KEY,
              secret_access_key: process.env.BACKEND_DO_SPACE_SECRET_KEY,
              region: process.env.BACKEND_DO_SPACE_REGION,
              bucket: process.env.BACKEND_DO_SPACE_BUCKET,
              endpoint: process.env.BACKEND_DO_SPACE_ENDPOINT,
              
            },
          },
        ],
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
    // {
    //   resolve: "medusa-variant-images",
    //   options: {},
    // },
    {
      resolve: "@alphabite/medusa-category-images",
      options: {},
    },
  ],
});
