import "server-only";
import { cacheLife } from "next/cache";
import { strapiClient } from "../clients/strapi.server";

export type MissingListVisual = {
  thumbnail?: string;
  stickers: string[];
};

function mediaURL(url: string | null | undefined) {
  if (!url) return undefined;
  const baseURL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337")
    .replace(/\/$/, "")
    .replace(/\/api$/, "");
  try {
    const resolved = new URL(url, baseURL);
    return ["https:", "http:"].includes(resolved.protocol)
      ? resolved.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export async function getMissingListVisuals(medusaIds: string[]) {
  "use cache";
  cacheLife("minutes");
  const ids = [...new Set(medusaIds)];
  if (!ids.length) return {} satisfies Record<string, MissingListVisual>;

  try {
    const products = await strapiClient.products.find(
      {
        fields: ["medusaId"],
        filters: { medusaId: { $in: ids } },
        populate: ["thumbnail", "images"],
      },
      { cache: "no-store" },
    );
    return Object.fromEntries(
      products.map((product) => [
        product.medusaId,
        {
          thumbnail: mediaURL(product.thumbnail?.url),
          stickers: (product.images ?? [])
            .map((image) => mediaURL(image.url))
            .filter((image): image is string => !!image),
        },
      ]),
    ) satisfies Record<string, MissingListVisual>;
  } catch {
    return {} satisfies Record<string, MissingListVisual>;
  }
}
