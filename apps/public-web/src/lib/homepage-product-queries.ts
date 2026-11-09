import type { HttpTypes } from "@medusajs/types";

type ProductResponse = { products: HttpTypes.StoreProduct[] };
type RegionResponse = {
  regions: { id: string; countries?: { iso_2?: string | null }[] }[];
  count: number;
};
type Client = {
  store: {
    product: {
      list: (query: {
        id?: string[];
        collection_id?: string[];
        order?: string;
        limit: number;
        region_id?: string;
        fields?: string;
      }) => Promise<ProductResponse>;
    };
    region: {
      list: (query: {
        limit: number;
        offset: number;
        fields: string;
      }) => Promise<RegionResponse>;
    };
  };
};
export type ProductSectionData =
  | { kind: "ready"; products: HttpTypes.StoreProduct[] }
  | { kind: "unavailable" };

export function createHomepageProductQueries(
  sdk: Client,
  configuredRegion: string | undefined,
) {
  async function regionId(): Promise<string | undefined> {
    const configured = configuredRegion?.trim();
    if (!configured) return undefined;
    if (configured.startsWith("reg_")) return configured;
    try {
      for (let offset = 0; ; offset += 100) {
        const { regions, count } = await sdk.store.region.list({
          limit: 100,
          offset,
          fields: "*countries",
        });
        const found = regions.find((region) =>
          region.countries?.some(
            (country) =>
              country.iso_2?.toLowerCase() === configured.toLowerCase(),
          ),
        );
        if (found) return found.id;
        if (!regions.length || offset + regions.length >= count)
          return undefined;
      }
    } catch {
      return undefined;
    }
  }
  async function priceOptions() {
    const region = await regionId();
    return region
      ? { region_id: region, fields: "*variants.calculated_price" }
      : {};
  }
  return {
    async selected(ids: string[]): Promise<ProductSectionData> {
      if (!ids.length) return { kind: "ready", products: [] };
      try {
        const { products } = await sdk.store.product.list({
          id: [...new Set(ids)],
          limit: ids.length,
          ...(await priceOptions()),
        });
        const byId = new Map(products.map((product) => [product.id, product]));
        return {
          kind: "ready",
          products: ids.flatMap((id) => {
            const product = byId.get(id);
            return product ? [product] : [];
          }),
        };
      } catch {
        return { kind: "unavailable" };
      }
    },
    async latest(
      collection: string,
      limit: number,
    ): Promise<ProductSectionData> {
      try {
        const { products } = await sdk.store.product.list({
          collection_id: [collection],
          order: "-created_at",
          limit: Math.min(48, Math.max(1, limit || 8)),
          ...(await priceOptions()),
        });
        return { kind: "ready", products };
      } catch {
        return { kind: "unavailable" };
      }
    },
  };
}

export function lowestProductPrice(product: HttpTypes.StoreProduct) {
  const prices = (product.variants ?? []).flatMap((variant) =>
    variant.calculated_price?.calculated_amount != null &&
    variant.calculated_price.currency_code
      ? [variant.calculated_price]
      : [],
  );
  return prices.sort(
    (a, b) => (a.calculated_amount ?? 0) - (b.calculated_amount ?? 0),
  )[0];
}
