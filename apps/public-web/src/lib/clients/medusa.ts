import Medusa from "@medusajs/js-sdk";

let MEDUSA_BACKEND_URL = "http://localhost:9000";

const publicUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

const baseUrl =
  typeof window === "undefined"
    ? (process.env.PUBLIC_WEB_MEDUSA_INTERNAL_URL ?? publicUrl)
    : publicUrl;

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
}

export const sdk = new Medusa({
  baseUrl: baseUrl,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});
