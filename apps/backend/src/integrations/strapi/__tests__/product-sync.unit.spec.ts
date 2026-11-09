import { syncProduct } from "../product-sync";

const payload = {
  id: "prod_1",
  title: "Test",
  handle: "test",
  thumbnail: null,
  images: [{ url: "https://example.test/a.jpg" }],
  variants: [{ id: "v1", title: "First", sku: "SKU" }],
};
function response(data: unknown) {
  return { ok: true, status: 200, json: async () => data };
}
function container(product: unknown = payload) {
  return {
    resolve(key: string) {
      if (key === "locking")
        return { execute: async (_: string, fn: () => Promise<void>) => fn() };
      if (key === "query")
        return { graph: async () => ({ data: product ? [product] : [] }) };
      throw new Error(`Unexpected service ${key}`);
    },
  } as any;
}
beforeEach(() => {
  process.env.STRAPI_SYNC_URL = "http://cms.test";
  process.env.STRAPI_SYNC_TOKEN = "secret";
});
afterEach(() => {
  jest.restoreAllMocks();
  delete process.env.STRAPI_SYNC_URL;
  delete process.env.STRAPI_SYNC_TOKEN;
});

test("upserts by Medusa ID, relates variants, and removes stale variants", async () => {
  const requests: { url: string; init?: RequestInit }[] = [];
  global.fetch = jest.fn(async (url, init) => {
    requests.push({ url: String(url), init });
    const u = new URL(String(url));
    if (init?.method === "DELETE") return response({ data: null }) as any;
    if (init?.method === "PUT" || init?.method === "POST")
      return response({
        data: { documentId: "product-doc", medusaId: "prod_1" },
      }) as any;
    if (u.pathname.endsWith("/product-variants"))
      return response({
        data: [
          { documentId: "old-doc", medusaId: "old", managedByMedusa: true },
          {
            documentId: "editor-doc",
            medusaId: "editor",
            managedByMedusa: false,
          },
        ],
        meta: { pagination: { pageCount: 1 } },
      }) as any;
    return response({
      data: [],
      meta: { pagination: { pageCount: 1 } },
    }) as any;
  }) as jest.Mock;
  await syncProduct("prod_1", container());
  const productWrite = requests.find(
    (r) => r.url.endsWith("/products") && r.init?.method === "POST",
  )!;
  expect(JSON.parse(String(productWrite.init?.body)).data).toMatchObject({
    medusaId: "prod_1",
    handle: "test",
    imageUrls: ["https://example.test/a.jpg"],
  });
  const variantWrite = requests.find(
    (r) => r.url.endsWith("/product-variants") && r.init?.method === "POST",
  )!;
  expect(JSON.parse(String(variantWrite.init?.body)).data).toMatchObject({
    medusaId: "v1",
    product: "product-doc",
  });
  expect(
    requests.some(
      (r) =>
        r.url.endsWith("/product-variants/old-doc") &&
        r.init?.method === "DELETE",
    ),
  ).toBe(true);
  expect(
    requests.some(
      (r) =>
        r.url.endsWith("/product-variants/editor-doc") &&
        r.init?.method === "DELETE",
    ),
  ).toBe(false);
});
test("refuses a handle belonging to another product before writes", async () => {
  global.fetch = jest.fn(async (url) => {
    const u = new URL(String(url));
    const data = u.searchParams.has("filters[handle][$eq]")
      ? [{ documentId: "other", medusaId: "prod_2" }]
      : [];
    return response({ data, meta: { pagination: { pageCount: 1 } } }) as any;
  }) as jest.Mock;
  await expect(syncProduct("prod_1", container())).rejects.toThrow(
    "identity conflict",
  );
  expect(
    (global.fetch as jest.Mock).mock.calls.every(([, init]) => !init?.method),
  ).toBe(true);
});
test("preserves deleted Medusa products and raises transient CMS errors for retry", async () => {
  global.fetch = jest.fn(async () => ({ ok: false, status: 503 })) as jest.Mock;
  await syncProduct("prod_1", container(null));
  expect(global.fetch).not.toHaveBeenCalled();
  await expect(syncProduct("prod_1", container())).rejects.toThrow("HTTP 503");
});
