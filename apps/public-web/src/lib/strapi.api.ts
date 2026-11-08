import 'server-only'

import { StrapiClient } from "@tcg/strapi-client";
console.log(process.env.NEXT_PUBLIC_STRAPI_API_URL,process.env.STRAPI_API_TOKEN)
export const strapiClient = new StrapiClient({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || "",
  token: process.env.STRAPI_API_TOKEN,
});
