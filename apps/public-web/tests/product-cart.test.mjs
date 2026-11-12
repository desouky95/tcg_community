import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ productList: async () => ({ products: [] }), regions: async () => ({ regions: [], count: 0 }), retrieve: async () => ({}), create: async () => ({}), add: async () => ({}), cookie: undefined, written: [] }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.cookie ? { value: state.cookie } : undefined, set: (...args) => state.written.push(args) }) }));
vi.mock("../src/lib/sdk", () => ({ sdk: { store: { product: { list: (...args) => state.productList(...args) }, region: { list: (...args) => state.regions(...args) }, cart: { retrieve: (...args) => state.retrieve(...args), create: (...args) => state.create(...args), createLineItem: (...args) => state.add(...args) } } } }));
import { getProductDetail } from "../src/lib/product-detail.server";
import { addCartItem, readCart } from "../src/lib/cart-actions";

const product = { id: "prod_1", handle: "box", variants: [{ id: "v1", manage_inventory: true, allow_backorder: false, inventory_quantity: 3, calculated_price: { calculated_amount: 20, currency_code: "egp" } }] };
describe("product and cart", () => {
  beforeEach(() => { vi.stubEnv("NEXT_PUBLIC_DEFAULT_REGION", "reg_eg"); state.cookie = undefined; state.written = []; state.productList = async () => ({ products: [product] }); state.retrieve = async () => ({ cart: { id: "cart_1", region_id: "reg_eg" } }); state.create = async () => ({ cart: { id: "cart_1", region_id: "reg_eg" } }); state.add = async () => ({ cart: { id: "cart_1", region_id: "reg_eg", items: [] } }); });
  it("resolves products by ID and handle with region fields", async () => {
    const queries = []; state.productList = async query => { queries.push(query); return { products: [product] }; };
    expect((await getProductDetail("prod_1")).kind).toBe("ready");
    expect((await getProductDetail("box")).kind).toBe("ready");
    expect(queries[0]).toMatchObject({ id: ["prod_1"], region_id: "reg_eg", fields: expect.stringContaining("inventory_quantity") });
    expect(queries[0].fields).toContain("+description");
    expect(queries[1]).toMatchObject({ handle: ["box"] });
    expect((await getProductDetail("other")).kind).toBe("not-found");
  });
  it("distinguishes unavailable product service and unavailable region", async () => {
    state.productList = async () => { throw new Error("offline"); };
    expect((await getProductDetail("box")).kind).toBe("unavailable");
    vi.stubEnv("NEXT_PUBLIC_DEFAULT_REGION", "eg"); state.regions = async () => { throw new Error("offline"); }; state.productList = async () => ({ products: [product] });
    expect(await getProductDetail("box")).toMatchObject({ kind: "ready", regionId: undefined });
  });
  it("creates a cart, persists its ID and adds the selected quantity", async () => {
    let submitted; state.add = async (...args) => { submitted = args; return { cart: { id: "cart_1", items: [] } }; };
    expect((await addCartItem("prod_1", "v1", 2)).kind).toBe("ready");
    expect(submitted).toEqual(["cart_1", { variant_id: "v1", quantity: 2 }]);
    expect(state.written[0][0]).toBe("next_pull_cart");
    expect(state.written[0][2]).toMatchObject({ httpOnly: true, sameSite: "lax" });
  });
  it("reuses the cart and rejects changed stock or region", async () => {
    state.cookie = "cart_1"; let created = false; state.create = async () => { created = true; return { cart: {} }; };
    expect((await addCartItem("prod_1", "v1", 1)).kind).toBe("ready"); expect(created).toBe(false);
    expect((await addCartItem("prod_1", "v1", 4)).kind).toBe("error");
    state.retrieve = async () => ({ cart: { id: "cart_1", region_id: "reg_other" } });
    expect((await addCartItem("prod_1", "v1", 1)).kind).toBe("error");
  });
  it("returns recoverable errors without silently discarding a cart", async () => {
    state.cookie = "cart_1"; state.retrieve = async () => { throw new Error("offline"); };
    expect((await readCart()).kind).toBe("unavailable"); expect((await addCartItem("prod_1", "v1", 1)).kind).toBe("error"); expect(state.written).toEqual([]);
    state.cookie = undefined; state.add = async () => { throw new Error("stock changed"); };
    expect((await addCartItem("prod_1", "v1", 1)).kind).toBe("error");
  });
});
