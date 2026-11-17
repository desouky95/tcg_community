import "server-only";
import { createHomepageProductQueries } from "./homepage-product-queries";
import { sdk } from "../clients/medusa";

const queries = createHomepageProductQueries(
  sdk,
  process.env.NEXT_PUBLIC_DEFAULT_REGION,
);
export const getHomepageProducts = queries.selected;
export const getLatestHomepageProducts = queries.latest;
export const getProductsByCollection = queries.getProductsByCollections;
