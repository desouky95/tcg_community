import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
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
});
