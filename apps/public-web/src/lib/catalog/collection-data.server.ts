import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "../clients/medusa";
import { lowestProductPrice } from "./homepage-product-queries";
import {
  filterCollectionProducts,
  PAGE_SIZE,
  requiresFullCollection,
  stockStatus,
  type CollectionFilters,
} from "./collection-queries";

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

export async function getCollection(
  handle: string,
  filters: CollectionFilters,
) {
  try {
    const { collections } = await sdk.store.collection.list({
      handle,
      limit: 1,
    });
    const collection = collections.find((item) => item.handle === handle);
    if (!collection) return { kind: "not-found" as const };
    const region = await regionId();
    const base = {
      collection_id: [collection.id],
      ...(region ? { region_id: region } : {}),
      fields: region
        ? "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata,+metadata,*type"
        : "+variants.inventory_quantity,+variants.metadata,+metadata,*type",
    };
    const priceAvailable = !!region;
    if (requiresFullCollection(filters)) {
      const all: HttpTypes.StoreProduct[] = [];
      for (let offset = 0; ;) {
        const result = await sdk.store.product.list({
          ...base,
          limit: 100,
          offset,
        });
        all.push(...result.products);
        offset += result.products.length;
        if (!result.products.length || offset >= result.count) break;
      }
      const filtered = filterCollectionProducts(all, filters);
      const page = Math.min(
        filters.page,
        Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
      );
      return {
        kind: "ready" as const,
        collection,
        products: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        count: filtered.length,
        page,
        priceAvailable: all.some(lowestProductPrice),
        stockAvailable: all.some((product) => stockStatus(product) !== undefined),
      };
    }

    const order =
      ({
        newest: "-created_at",
        oldest: "created_at",
        title: "title",
        "-title": "-title",
      } as Record<string, string>)[filters.sort] ?? "-created_at";
    let page = filters.page;
    let result = await sdk.store.product.list({
      ...base,
      order,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    });
    const lastPage = Math.max(1, Math.ceil(result.count / PAGE_SIZE));
    if (page > lastPage) {
      page = lastPage;
      result = await sdk.store.product.list({
        ...base,
        order,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
    }
    return {
      kind: "ready" as const,
      collection,
      products: result.products,
      count: result.count,
      page,
      priceAvailable,
      stockAvailable: result.products.some(
        (product) => stockStatus(product) !== undefined,
      ),
    };
  } catch {
    return { kind: "unavailable" as const };
  }
}
