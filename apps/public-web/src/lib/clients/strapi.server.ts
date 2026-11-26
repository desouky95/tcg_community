import "server-only";

import { StrapiClient } from "@tcg/strapi-client";

function strapiOrigin(url: string) {
  return url.replace(/\/$/, "").replace(/\/api$/, "");
}

export const strapiPublicOrigin = strapiOrigin(
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337",
);

export const strapiClient = new StrapiClient({
  baseURL: process.env.PUBLIC_WEB_STRAPI_API_URL
    ? strapiOrigin(process.env.PUBLIC_WEB_STRAPI_API_URL)
    : strapiPublicOrigin,
  token: process.env.PUBLIC_WEB_STRAPI_API_TOKEN,
});
