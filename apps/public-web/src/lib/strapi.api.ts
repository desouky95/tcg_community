import 'server-only'

import { StrapiClient } from "@tcg/strapi-client";
export const strapiClient = new StrapiClient({
  baseURL: (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(/\/$/, "").replace(/\/api$/, ""),
  token: process.env.STRAPI_API_TOKEN,
});
