import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  collections: vi.fn(), categories: vi.fn(), retrieveCategory: vi.fn(), products: vi.fn(), regions: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("../src/lib/sdk", () => ({ sdk: { store: {
  collection: { list: mocks.collections }, category: { list: mocks.categories, retrieve: mocks.retrieveCategory },
  product: { list: mocks.products }, region: { list: mocks.regions },
} } }));
import { findCategory, listDiscovery, listProducts } from "../src/lib/shop-data.server";

describe("shop data", () => {
  beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("NEXT_PUBLIC_DEFAULT_REGION", "eg"); });
  it("loads real collection and category handles and resolves exact category", async () => {
    mocks.collections.mockResolvedValue({ collections: [{ id: "c", handle: "new", title: "New" }], count: 1 });
    mocks.categories.mockResolvedValue({ product_categories: [{ id: "cat", handle: "cards", name: "Cards" }], count: 1 });
    expect(await listDiscovery()).toMatchObject({ collections: [{ handle: "new" }], categories: [{ handle: "cards" }] });
    mocks.retrieveCategory.mockResolvedValue({ product_category: { id: "cat", handle: "cards", name: "Cards", category_children: [] } });
    expect((await findCategory("cards")).id).toBe("cat");
    expect(mocks.retrieveCategory).toHaveBeenCalledWith("cat", { include_descendants_tree: true, fields: "*category_children" });
    expect(await findCategory("missing")).toBeUndefined();
  });
  it("passes region pricing, inventory and category through each product page", async () => {
    mocks.regions.mockResolvedValue({ regions: [{ id: "reg_eg", countries: [{ iso_2: "eg" }] }], count: 1 });
    mocks.products.mockResolvedValueOnce({ products: [{ id: "one" }], count: 2 }).mockResolvedValueOnce({ products: [{ id: "two" }], count: 2 });
    expect((await listProducts("cat")).map(p => p.id)).toEqual(["one", "two"]);
    expect(mocks.products).toHaveBeenCalledWith(expect.objectContaining({ category_id: ["cat"], region_id: "reg_eg", fields: "*variants.calculated_price,+variants.inventory_quantity", offset: 1 }));
  });
  it("propagates product and discovery failures for the route to display", async () => {
    mocks.regions.mockRejectedValue(new Error("regions unavailable"));
    mocks.products.mockRejectedValue(new Error("products unavailable"));
    mocks.collections.mockRejectedValue(new Error("collections unavailable"));
    await expect(listProducts()).rejects.toThrow("products unavailable");
    await expect(listDiscovery()).rejects.toThrow("collections unavailable");
  });
});

describe("paginated shop results", () => {
  beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("NEXT_PUBLIC_DEFAULT_REGION", "eg"); });
  it("requests only the selected page for native ordering", async () => {
    const { listProductResults } = await import("../src/lib/shop-data.server");
    mocks.regions.mockResolvedValue({ regions: [{ id: "reg_eg", countries: [{ iso_2: "eg" }] }], count: 1 });
    mocks.products.mockResolvedValue({ products: [{ id: "one", variants: [] }], count: 50 });
    const result = await listProductResults({ sort: "title", min: "", max: "", availability: "", page: 2 });
    expect(result.count).toBe(50);
    expect(mocks.products).toHaveBeenCalledTimes(1);
    expect(mocks.products).toHaveBeenCalledWith(expect.objectContaining({ order: "title", offset: 24, limit: 24 }));
  });
  it("announces missing region and does not silently filter away products", async () => {
    const { listProductResults } = await import("../src/lib/shop-data.server");
    mocks.regions.mockRejectedValue(new Error("offline"));
    mocks.products.mockResolvedValue({ products: [{ id: "one", variants: [] }], count: 1 });
    const result = await listProductResults({ sort: "price", min: "10", max: "", availability: "", page: 1 });
    expect(result.pricingUnavailable).toBe(true);
    expect(result.count).toBe(1);
    expect(mocks.products).toHaveBeenCalledWith(expect.objectContaining({ order: "-created_at" }));
  });
  it("filters across all pages before slicing for price and reports the true count", async () => {
    const { listProductResults } = await import("../src/lib/shop-data.server");
    mocks.regions.mockResolvedValue({ regions: [{ id: "reg_eg", countries: [{ iso_2: "eg" }] }], count: 1 });
    const product = (id, amount) => ({ id, title: id, variants: [{ calculated_price: { calculated_amount: amount, currency_code: "egp" } }] });
    mocks.products.mockResolvedValueOnce({ products: [product("a", 5)], count: 2 }).mockResolvedValueOnce({ products: [product("b", 20)], count: 2 });
    const result = await listProductResults({ sort: "price", min: "10", max: "", availability: "", page: 1 });
    expect(result.count).toBe(1);
    expect(result.products[0].id).toBe("b");
    expect(result.currency).toBe("egp");
  });
});

it("does not apply an inverted range and retains it for correction", async () => {
  const { listProductResults } = await import("../src/lib/shop-data.server");
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_DEFAULT_REGION", "reg_eg");
  mocks.products.mockResolvedValue({ products: [{ id: "one", variants: [] }], count: 1 });
  const result = await listProductResults({ sort: "newest", min: "50", max: "10", availability: "", page: 1 });
  expect(result.invalidRange).toBe(true);
  expect(result.count).toBe(1);
  expect(result.products[0].id).toBe("one");
});

describe("category descendants", () => {
  beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("NEXT_PUBLIC_DEFAULT_REGION", "reg_eg"); });
  it("collects nested IDs once and handles a leaf", async () => {
    const { categoryTreeIds } = await import("../src/lib/shop-data.server");
    expect(categoryTreeIds({ id: "root", category_children: [{ id: "child", category_children: [{ id: "grandchild" }, { id: "child" }] }] })).toEqual(["root", "child", "grandchild"]);
    expect(categoryTreeIds({ id: "leaf", category_children: [] })).toEqual(["leaf"]);
  });
  it("deduplicates products across categories before sorting, filtering and paging", async () => {
    const { listProductResults } = await import("../src/lib/shop-data.server");
    const product = (id, price) => ({ id, title: id, created_at: "2026-01-01", variants: [{ calculated_price: { calculated_amount: price, currency_code: "egp" }, manage_inventory: false }] });
    const items = Array.from({ length: 27 }, (_, i) => product(`p${String(i).padStart(2, "0")}`, i + 1));
    mocks.products.mockResolvedValueOnce({ products: [...items.slice(0, 14), items[0]], count: 28 }).mockResolvedValueOnce({ products: items.slice(14), count: 28 });
    const result = await listProductResults({ sort: "price", min: "3", max: "", availability: "in-stock", page: 2 }, ["root", "child", "grandchild"]);
    expect(mocks.products).toHaveBeenCalledWith(expect.objectContaining({ category_id: ["root", "child", "grandchild"] }));
    expect(result.count).toBe(25);
    expect(result.page).toBe(2);
    expect(result.products.map(item => item.id)).toEqual(["p26"]);
  });
  it("returns an empty result for an empty category", async () => {
    const { listProductResults } = await import("../src/lib/shop-data.server");
    mocks.products.mockResolvedValue({ products: [], count: 0 });
    const result = await listProductResults({ sort: "newest", min: "", max: "", availability: "", page: 1 }, ["leaf"]);
    expect(result.count).toBe(0);
    expect(result.products).toEqual([]);
  });
  it("propagates a category tree retrieval failure", async () => {
    mocks.categories.mockResolvedValue({ product_categories: [{ id: "cat", handle: "cards" }] });
    mocks.retrieveCategory.mockRejectedValue(new Error("unavailable"));
    await expect(findCategory("cards")).rejects.toThrow("unavailable");
  });
});
