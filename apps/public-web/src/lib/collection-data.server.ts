import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "./sdk";

async function regionId() {
  const configured = process.env.NEXT_PUBLIC_DEFAULT_REGION?.trim();
  if (!configured) return undefined;
  if (configured.startsWith("reg_")) return configured;
  try {
    for (let offset = 0; ; offset += 100) {
      const { regions, count } = await sdk.store.region.list({
        limit: 100,
        offset,
        fields: "*countries",
      });
      const region = regions.find((r) =>
        r.countries?.some(
          (c) => c.iso_2?.toLowerCase() === configured.toLowerCase(),
        ),
      );
      if (region) return region.id;
      if (!regions.length || offset + regions.length >= count) return undefined;
    }
  } catch {
    return undefined;
  }
}

export async function getCollection(handle: string) {
  try {
    const { collections } = await sdk.store.collection.list({
      handle,
      limit: 1,
    });
    const collection = collections.find((item) => item.handle === handle);
    if (!collection) return { kind: "not-found" as const };
    const region = await regionId();
    const products: HttpTypes.StoreProduct[] = [];

    for (let offset = 0; ;) {
      const result = await sdk.store.product.list({
        collection_id: [collection.id],
        limit: 100,
        offset,
        ...(region ? { region_id: region } : {}),
        fields: region
          ? "*variants.calculated_price,+variants.inventory_quantity"
          : "+variants.inventory_quantity",
      });
      products.push(...result.products);
      offset += result.products.length;
      if (!result.products.length || offset >= result.count) break;
    }

    return { kind: "ready" as const, collection, products };
  } catch {
    return { kind: "unavailable" as const };
  }
}
