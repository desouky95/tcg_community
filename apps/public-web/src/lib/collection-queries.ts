import type { HttpTypes } from "@medusajs/types";
import { lowestProductPrice } from "./homepage-product-queries";

export type CollectionFilters = { sort: string; min: string; max: string; availability: string; page: number };
export const PAGE_SIZE = 24;
export function parseCollectionFilters(query: Record<string, string | string[] | undefined>): CollectionFilters {
  const value = (key: string) => typeof query[key] === "string" ? query[key] as string : "";
  const numeric = (key: string) => { const raw = value(key).trim(); return raw && Number.isFinite(Number(raw)) && Number(raw) >= 0 ? raw : ""; };
  const page = Number(value("page"));
  const sort = value("sort");
  const availability = value("availability");
  return { sort: ["newest", "oldest", "title", "-title", "price", "-price"].includes(sort) ? sort : "newest", min: numeric("min"), max: numeric("max"), availability: ["in-stock", "out-of-stock"].includes(availability) ? availability : "", page: Number.isSafeInteger(page) && page > 0 ? page : 1 };
}
export function stockStatus(product: HttpTypes.StoreProduct): "in-stock" | "out-of-stock" | undefined {
  const variants = product.variants ?? [];
  if (!variants.length) return undefined;
  if (variants.some(v => v.manage_inventory === false || v.allow_backorder === true || (typeof v.inventory_quantity === "number" && v.inventory_quantity > 0))) return "in-stock";
  if (variants.every(v => v.manage_inventory === true && v.allow_backorder === false && typeof v.inventory_quantity === "number")) return "out-of-stock";
  return undefined;
}
export function filterCollectionProducts(products: HttpTypes.StoreProduct[], filters: CollectionFilters) {
  const filtered = products.filter(product => {
    const price = lowestProductPrice(product)?.calculated_amount;
    if (filters.min && (price == null || price < Number(filters.min))) return false;
    if (filters.max && (price == null || price > Number(filters.max))) return false;
    return !filters.availability || stockStatus(product) === filters.availability;
  });
  filtered.sort((a, b) => {
    if (filters.sort === "price" || filters.sort === "-price") {
      const x = lowestProductPrice(a)?.calculated_amount, y = lowestProductPrice(b)?.calculated_amount;
      if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1;
      return (x - y) * (filters.sort === "price" ? 1 : -1);
    }
    if (filters.sort === "title" || filters.sort === "-title") return a.title.localeCompare(b.title) * (filters.sort === "title" ? 1 : -1);
    return (new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()) * (filters.sort === "oldest" ? 1 : -1);
  });
  return filtered;
}
