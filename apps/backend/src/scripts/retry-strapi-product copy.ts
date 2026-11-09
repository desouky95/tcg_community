import type { ExecArgs } from "@medusajs/framework/types";
import { syncProduct } from "../integrations/strapi/product-sync";
export default async function retryStrapiProduct({ container }: ExecArgs) {
  const id = process.env.STRAPI_SYNC_PRODUCT_ID;
  if (!id) throw new Error("Set STRAPI_SYNC_PRODUCT_ID to a Medusa product ID");
  await syncProduct(id, container);
  container.resolve("logger").info(`Strapi product sync completed for ${id}`);
}
