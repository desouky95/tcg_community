import "server-only";
import { cacheLife } from "next/cache";
import { createHomepageProductQueries } from "./homepage-product-queries";
import { sdk } from "../clients/medusa";

const queries = createHomepageProductQueries(
  sdk,
  process.env.NEXT_PUBLIC_DEFAULT_REGION,
);
export async function getHomepageProducts(ids: string[]) {
  "use cache";
  cacheLife("hours");
  const result = await queries.selected(ids);
  if (result.kind === "unavailable") throw new Error("Products unavailable");
  return result.products;
}

export async function getLatestHomepageProducts(
  collection: string,
  limit: number,
) {
  "use cache";
  cacheLife("hours");
  const result = await queries.latest(collection, limit);
  if (result.kind === "unavailable") throw new Error("Products unavailable");
  return result.products;
}

export async function getProductsByCollection(
  collection: string | null | undefined,
  limit: number,
) {
  "use cache";
  cacheLife("hours");
  const result = await queries.getProductsByCollections(collection, limit);
  if (result.kind === "unavailable") throw new Error("Products unavailable");
  return result.products;
}
