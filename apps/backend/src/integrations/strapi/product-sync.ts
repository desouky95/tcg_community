import type { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

type Document = {
  documentId: string;
  medusaId: string;
  handle?: string;
  managedByMedusa?: boolean;
  product?: { medusaId: string } | null;
};
type Variant = {
  id: string;
  title: string;
  sku?: string | null;
  images?: { url: string }[];
  thumbnail?: string | null;
};
type Product = {
  id: string;
  handle: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  images?: { url: string }[];
  variants?: Variant[];
};

export function strapiClient(baseUrl: string, token: string) {
  const origin = baseUrl.replace(/\/$/, "").replace(/\/api$/, "");
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${origin}/api/${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      throw new Error(`Strapi sync request failed (HTTP ${response.status})`);
    return response.json() as Promise<T>;
  }
  async function list(
    type: string,
    params: URLSearchParams,
  ): Promise<Document[]> {
    const result: Document[] = [];
    for (let page = 1; ; page++) {
      params.set("pagination[page]", String(page));
      params.set("pagination[pageSize]", "100");
      const response = await request<{
        data: Document[];
        meta: { pagination: { pageCount: number } };
      }>(`${type}?${params}`);
      result.push(...response.data);
      if (page >= response.meta.pagination.pageCount) return result;
    }
  }
  const find = (type: string, key: string, value: string, populate = false) => {
    const params = new URLSearchParams({ [`filters[${key}][$eq]`]: value });
    if (populate) params.set("populate[0]", "product");
    return list(type, params);
  };
  async function save(
    type: string,
    existing: Document | undefined,
    data: object,
  ) {
    return (
      await request<{ data: Document }>(
        existing ? `${type}/${existing.documentId}` : type,
        { method: existing ? "PUT" : "POST", body: JSON.stringify({ data }) },
      )
    ).data;
  }
  async function remove(type: string, doc: Document) {
    await request(`${type}/${doc.documentId}`, { method: "DELETE" });
  }
  return { find, save, remove };
}

export async function syncProduct(
  productId: string,
  container: MedusaContainer,
): Promise<void> {
  const url = process.env.STRAPI_SYNC_URL;
  const token = process.env.STRAPI_SYNC_TOKEN;
  if (!url || !token)
    throw new Error("Strapi synchronization is not configured");
  const api = strapiClient(url, token);
  const locking = container.resolve(Modules.LOCKING);
  await locking.execute(
    `strapi-product:${productId}`,
    async () => {
      const query = container.resolve(ContainerRegistrationKeys.QUERY);
      const { data } = await query.graph({
        entity: "product",
        fields: [
          "id",
          "title",
          "subtitle",
          "description",
          "handle",
          "thumbnail",
          "images.url",
          "variants.id",
          "variants.title",
          "variants.sku",
        ],
        filters: { id: productId },
      });
      const product = data[0] as Product | undefined;
      if (!product) return; // Keep CMS data when the Medusa product is deleted.
      if (!product.handle) throw new Error("Medusa product has no handle");
      const [matches, handleMatches] = await Promise.all([
        api.find("products", "medusaId", product.id),
        api.find("products", "handle", product.handle),
      ]);
      if (
        matches.length > 1 ||
        handleMatches.some((entry) => entry.medusaId !== product.id)
      )
        throw new Error("Strapi product identity conflict");
      const entry = await api.save("products", matches[0], {
        medusaId: product.id,
        handle: product.handle,
        title: product.title,
        subtitle: product.subtitle ?? null,
        description: product.description ?? null,
        imageUrls: (product.images ?? []).map((image) => image.url),
        thumbnailUrl: product.thumbnail ?? null,
      });
      const existing = await api.find(
        "product-variants",
        "product][medusaId",
        product.id,
      );
      const byId = new Map(
        existing.map((variant) => [variant.medusaId, variant]),
      );
      for (const variant of product.variants ?? []) {
        await api.save("product-variants", byId.get(variant.id), {
          medusaId: variant.id,
          title: variant.title,
          sku: variant.sku ?? null,
          managedByMedusa: true,
          product: entry.documentId,
        });
        byId.delete(variant.id);
      }
      for (const stale of byId.values())
        if (stale.managedByMedusa) await api.remove("product-variants", stale);
    },
    { timeout: 60, expire: 3600 },
  );
}
