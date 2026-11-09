import "server-only";
import { sdk } from "./sdk";
import { createHomepageProductQueries } from "./homepage-product-queries";

const queries = createHomepageProductQueries(sdk, process.env.NEXT_PUBLIC_DEFAULT_REGION);
export const getHomepageProducts = queries.selected;
export const getLatestHomepageProducts = queries.latest;
