import { describe, expect, it } from "vitest";
import { filterCollectionProducts, parseCollectionFilters, stockStatus } from "../src/lib/collection-queries";

const product = (id, price, quantity) => ({ id, title: id, created_at: "2026-01-01", variants: [{ manage_inventory: true, allow_backorder: false, inventory_quantity: quantity, calculated_price: { calculated_amount: price, currency_code: "egp" } }] });

describe("collection filters", () => {
  it("normalizes invalid URL values", () => {
    expect(parseCollectionFilters({ sort: "wrong", min: "-3", page: "0", availability: "bad" })).toEqual({ sort: "newest", min: "", max: "", page: 1, availability: "" });
  });
  it("filters and sorts the complete result by calculated price and stock", () => {
    const items = [product("a", 30, 1), product("b", 10, 0), product("c", 20, 1)];
    const filters = parseCollectionFilters({ min: "15", availability: "in-stock", sort: "price" });
    expect(filterCollectionProducts(items, filters).map(item => item.id)).toEqual(["c", "a"]);
    expect(stockStatus(items[1])).toBe("out-of-stock");
  });
  it("does not claim unknown inventory is sold out", () => {
    expect(stockStatus({ variants: [{ manage_inventory: true }] })).toBeUndefined();
  });
});
