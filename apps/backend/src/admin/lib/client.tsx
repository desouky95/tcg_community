import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  // Vite replaces import.meta for the admin bundle; the backend compiler uses CommonJS.
  // @ts-ignore
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  // @ts-ignore
  debug: import.meta.env.DEV,
  auth: { type: "session" },
})
