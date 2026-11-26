import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const state = vi.hoisted(() => ({
  cookie: "cart_1",
  deleted: [],
  cart: {},
  options: [],
  providers: [],
  completed: undefined,
  completeCalls: 0,
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (state.cookie ? { value: state.cookie } : undefined),
    delete: (name) => state.deleted.push(name),
  }),
}));
vi.mock("../src/lib/clients/medusa", () => ({
  sdk: {
    store: {
      cart: {
        retrieve: async () => ({ cart: state.cart }),
        update: async (_id, input) => ({ cart: { ...state.cart, ...input } }),
        addShippingMethod: async () => ({ cart: state.cart }),
        complete: async () => {
          state.completeCalls++;
          return state.completed;
        },
      },
      fulfillment: {
        listCartOptions: async () => ({ shipping_options: state.options }),
        calculate: async () => {
          throw new Error("unavailable");
        },
      },
      payment: {
        listPaymentProviders: async () => ({
          payment_providers: state.providers,
        }),
        initiatePaymentSession: async () => ({}),
      },
    },
  },
}));
import { checkoutReview } from "../src/lib/commerce/checkout-review";
import {
  checkoutCart,
  saveContact,
  saveAddress,
  selectPayment,
  placeOrder,
} from "../src/lib/commerce/checkout-actions";

beforeEach(() => {
  state.cookie = "cart_1";
  state.deleted = [];
  state.cart = {
    id: "cart_1",
    region_id: "reg_1",
    items: [{ id: "item" }],
    total: 100,
    currency_code: "egp",
  };
  state.options = [];
  state.providers = [];
  state.completed = { type: "order", order: { display_id: 42 } };
  state.completeCalls = 0;
});
describe("checkout actions", () => {
  it("distinguishes empty and completed carts", async () => {
    state.cookie = undefined;
    expect((await checkoutCart()).kind).toBe("empty");
    state.cookie = "cart_1";
    state.cart.completed_at = "2026-01-01";
    expect((await checkoutCart()).kind).toBe("completed");
  });
  it("validates contact and delivery before contacting Medusa", async () => {
    expect((await saveContact("invalid")).kind).toBe("error");
    expect((await saveContact(null)).kind).toBe("error");
    expect(
      (
        await saveAddress({
          first_name: "",
          last_name: "",
          address_1: "",
          city: "",
          country_code: "",
        })
      ).kind,
    ).toBe("error");
    expect((await saveAddress(null)).kind).toBe("error");
    expect((await saveAddress({ first_name: 7 })).kind).toBe("error");
  });
  it("does not offer a calculated shipping price that failed to resolve", async () => {
    state.options = [
      { id: "flat", price_type: "flat" },
      { id: "calculated", price_type: "calculated" },
    ];
    const result = await saveAddress({
      first_name: "A",
      last_name: "B",
      address_1: "Street",
      city: "Cairo",
      country_code: "EG",
    });
    expect(result.kind).toBe("ready");
    expect(result.options.map((option) => option.id)).toEqual(["flat"]);
  });
  it("rejects unsupported and unconfigured payment providers", async () => {
    expect((await selectPayment("pp_other")).kind).toBe("error");
    expect((await selectPayment("pp_system_default")).kind).toBe("error");
    state.providers = [{ id: "pp_system_default" }];
    expect((await selectPayment("pp_system_default")).kind).toBe("ready");
  });
  it("requires review of a changed total and retains the cart on failure", async () => {
    expect((await placeOrder(99, "egp", checkoutReview(state.cart))).kind).toBe(
      "changed",
    );
    expect(state.completeCalls).toBe(0);
    const reviewed = checkoutReview(state.cart);
    state.cart.items[0].quantity = 2;
    expect((await placeOrder(100, "egp", reviewed)).kind).toBe("changed");
    expect(state.completeCalls).toBe(0);
    state.completed = { type: "cart" };
    expect(
      (await placeOrder(100, "egp", checkoutReview(state.cart))).kind,
    ).toBe("error");
    expect(state.deleted).toEqual([]);
  });
  it("clears the cart cookie only after Medusa confirms the order", async () => {
    expect(await placeOrder(100, "egp", checkoutReview(state.cart))).toEqual({
      kind: "order",
      displayId: 42,
    });
    expect(state.deleted).toEqual(["next_pull_cart"]);
  });
});
