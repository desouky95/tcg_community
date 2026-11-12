import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "./sdk";

async function resolveRegion() {
  const configured = process.env.NEXT_PUBLIC_DEFAULT_REGION?.trim();
  if (!configured) return undefined;
  if (configured.startsWith("reg_")) return configured;
  for (let offset = 0; ; offset += 100) {
    const { regions, count } = await sdk.store.region.list({ limit: 100, offset, fields: "*countries" });
    const region = regions.find(item => item.countries?.some(country => country.iso_2?.toLowerCase() === configured.toLowerCase()));
    if (region) return region.id;
    if (!regions.length || offset + regions.length >= count) return undefined;
  }
}

export async function listProducts(categoryId?: string) {
  let region: string | undefined;
  try { region = await resolveRegion(); } catch { /* Products remain browsable without prices. */ }
  const products: HttpTypes.StoreProduct[] = [];
  for (let offset = 0; ;) {
    const response = await sdk.store.product.list({
      ...(categoryId ? { category_id: [categoryId] } : {}),
      ...(region ? { region_id: region } : {}),
      fields: region ? "*variants.calculated_price,+variants.inventory_quantity" : "+variants.inventory_quantity",
      limit: 100, offset,
    });
    products.push(...response.products);
    offset += response.products.length;
    if (!response.products.length || offset >= response.count) return products;
  }
}

export async function listDiscovery() {
  const collections: HttpTypes.StoreCollection[] = [];
  const categories: HttpTypes.StoreProductCategory[] = [];
  for (let offset = 0; ;) {
    const response = await sdk.store.collection.list({ limit: 100, offset ,fields: "*"});
    collections.push(...response.collections);
    offset += response.collections.length;
    if (!response.collections.length || offset >= response.count) break;
  }
  for (let offset = 0; ;) {
    const response = await sdk.store.category.list({ limit: 100, offset });
    categories.push(...response.product_categories);
    offset += response.product_categories.length;
    if (!response.product_categories.length || offset >= response.count) break;
  }
  return { collections, categories };
}

export async function findCategory(handle: string) {
  const { product_categories } = await sdk.store.category.list({ handle, limit: 1 });
  const category = product_categories.find(item => item.handle === handle);
  if (!category) return undefined;
  const { product_category } = await sdk.store.category.retrieve(category.id, {
    include_descendants_tree: true,
    fields: "*category_children",
  });
  return product_category;
}

export function categoryTreeIds(category: HttpTypes.StoreProductCategory): string[] {
  const ids = new Set<string>();
  const pending = [category];
  while (pending.length) {
    const current = pending.pop()!;
    if (ids.has(current.id)) continue;
    ids.add(current.id);
    pending.push(...(current.category_children ?? []));
  }
  return [...ids];
}

/** Price and inventory filtering must see every product; native ordering can page at the API. */
export async function listProductResults(filters: import("./collection-queries").CollectionFilters, categoryIds?: string[]) {
  const { filterCollectionProducts, PAGE_SIZE } = await import("./collection-queries");
  let region: string | undefined;
  try { region = await resolveRegion(); } catch { /* Keep browsing available. */ }
  const pricingUnavailable = !region;
  const invalidRange = !!filters.min && !!filters.max && Number(filters.min) > Number(filters.max);
  const effective = pricingUnavailable ? { ...filters, min: "", max: "", sort: ["price", "-price"].includes(filters.sort) ? "newest" : filters.sort } : filters;
  const requiresAll = !!(categoryIds?.length || effective.min || effective.max || effective.availability || ["price", "-price"].includes(effective.sort));
  const fields = region ? "*variants.calculated_price,+variants.inventory_quantity" : "+variants.inventory_quantity";
  const base = { ...(categoryIds?.length ? { category_id: categoryIds } : {}), ...(region ? { region_id: region } : {}), fields };
  if (requiresAll && (!invalidRange || !!categoryIds?.length)) {
    const all: HttpTypes.StoreProduct[] = [];
    for (let offset = 0; ;) {
      const result = await sdk.store.product.list({ ...base, limit: 100, offset });
      all.push(...result.products);
      offset += result.products.length;
      if (!result.products.length || offset >= result.count) break;
    }
    const unique = [...new Map(all.map(product => [product.id, product])).values()];
    const matched = filterCollectionProducts(unique, invalidRange ? { ...effective, min: "", max: "" } : effective);
    const page = Math.min(effective.page, Math.max(1, Math.ceil(matched.length / PAGE_SIZE)));
    return { products: matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), count: matched.length, page, pricingUnavailable, currency: all.flatMap(p => p.variants ?? []).find(v => v.calculated_price?.currency_code)?.calculated_price?.currency_code ?? undefined, stockAvailable: all.some(p => p.variants?.some(v => v.manage_inventory === false || typeof v.inventory_quantity === "number")), invalidRange };
  }
  const order = ({ newest: "-created_at", oldest: "created_at", title: "title", "-title": "-title" } as Record<string, string>)[effective.sort] ?? "-created_at";
  let page = effective.page;
  let result = await sdk.store.product.list({ ...base, order, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const lastPage = Math.max(1, Math.ceil(result.count / PAGE_SIZE));
  if (page > lastPage) { page = lastPage; result = await sdk.store.product.list({ ...base, order, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }); }
  return { products: result.products, count: result.count, page, pricingUnavailable, currency: result.products.flatMap(p => p.variants ?? []).find(v => v.calculated_price?.currency_code)?.calculated_price?.currency_code ?? undefined, stockAvailable: result.products.some(p => p.variants?.some(v => v.manage_inventory === false || typeof v.inventory_quantity === "number")), invalidRange };
}
