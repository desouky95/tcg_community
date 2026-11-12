import "server-only";
import { sdk } from "./sdk";

export async function resolveStoreRegion(): Promise<string | undefined> {
  const configured = process.env.NEXT_PUBLIC_DEFAULT_REGION?.trim();
  if (!configured) return undefined;
  if (configured.startsWith("reg_")) return configured;
  for (let offset = 0; ;) {
    const { regions, count } = await sdk.store.region.list({ limit: 100, offset, fields: "*countries" });
    const region = regions.find(item => item.countries?.some(country => country.iso_2?.toLowerCase() === configured.toLowerCase()));
    if (region) return region.id;
    offset += regions.length;
    if (!regions.length || offset >= count) return undefined;
  }
}

export async function getProductDetail(identifier: string) {
  try {
    let regionId: string | undefined;
    try { regionId = await resolveStoreRegion(); } catch { /* Show product without regional pricing. */ }
    const fields = regionId ? "+description,*variants.calculated_price,+variants.inventory_quantity,*images" : "+description,+variants.inventory_quantity,*images";
    const query = identifier.startsWith("prod_") ? { id: [identifier] } : { handle: [identifier] };
    const options = { ...(regionId ? { region_id: regionId } : {}), fields, limit: 1 };
    const { products } = await sdk.store.product.list({ ...query, ...options });
    let product = products.find(item => item.id === identifier || item.handle === identifier);
    if (!product && identifier.startsWith("prod_")) {
      const byHandle = await sdk.store.product.list({ handle: [identifier], ...options });
      product = byHandle.products.find(item => item.handle === identifier);
    }
    return product ? { kind: "ready" as const, product, regionId } : { kind: "not-found" as const };
  } catch { return { kind: "unavailable" as const }; }
}
