import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ list: async () => ({ product_categories: [], count: 0 }) }));
vi.mock("server-only", () => ({}));
vi.mock("../src/lib/sdk", () => ({ sdk: { store: { category: { list: (...args) => mocks.list(...args) } } } }));
import { getShopNavigation } from "../src/lib/shop-navigation.server.ts";

describe("shop navigation data", () => {
  beforeEach(() => { mocks.list = async () => ({ product_categories: [], count: 0 }); });
  it("maps parent and nested categories and validates feature images", async () => {
    let query;
    mocks.list = async (value) => { query = value; return { count: 2, product_categories: [
      { id: "a", name: "Cards", handle: "cards", parent_category_id: null, metadata: { image: "https://example.com/a.png" }, category_children: [{ id: "b", name: "Packs", handle: "packs", parent_category_id: "a", metadata: { image: "javascript:alert(1)" }, category_children: [] }] },
      { id: "b", name: "Packs", handle: "packs", parent_category_id: "a" },
    ] }; };
    const result = await getShopNavigation();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ href: "/categories/cards", image: "https://example.com/a.png", children: [{ href: "/categories/packs", image: undefined }] });
    expect(query).toEqual(expect.objectContaining({ include_descendants_tree: true, fields: "*category_children" }));
  });
  it("keeps navigation usable when Medusa is unavailable", async () => {
    mocks.list = async () => { throw new Error("offline"); };
    const result = await getShopNavigation();
    expect(result).toEqual([]);
  });
});
