import { getOrderDetailWorkflow } from "@medusajs/medusa/core-flows";
import { POST } from "../route";

jest.mock("@medusajs/medusa/core-flows", () => ({
  createCustomerAddressesWorkflow: jest.fn(),
  updateCustomerAddressesWorkflow: jest.fn(),
  deleteCustomerAddressesWorkflow: jest.fn(),
  getOrderDetailWorkflow: jest.fn(() => ({
    run: jest.fn().mockResolvedValue({
      result: {
        id: "order_b",
        status: "completed",
        created_at: "2026-01-01T00:00:00.000Z",
        currency_code: "egp",
        subtotal: 10,
        tax_total: 0,
        discount_total: 0,
        shipping_total: 0,
        total: 10,
        payment_status: "captured",
        fulfillment_status: "not_fulfilled",
        items: [
          {
            id: "item_a",
            title: "Sticker pack",
            variant_title: "12 — Salah",
            quantity: 1,
            unit_price: 10,
            total: 10,
          },
        ],
        shipping_address: {
          first_name: "Test",
          last_name: "Customer",
          address_1: "1 Main St",
          city: "Cairo",
          country_code: "eg",
        },
      },
    }),
  })),
}));

const run = async (
  body: unknown,
  key = "secret",
  addresses: unknown[] = [],
) => {
  const customers = {
    listCustomers: jest.fn().mockResolvedValue([{ id: "cus_a" }]),
    listCustomerAddresses: jest.fn().mockResolvedValue(addresses),
  };
  const orders = {
    listAndCountOrders: jest
      .fn()
      .mockResolvedValueOnce([[], 1])
      .mockResolvedValueOnce([[{ id: "order_b" }], 1]),
  };
  const scope = {
    resolve: jest.fn((name: string) =>
      name === "customer" ? customers : orders,
    ),
  };
  const req = { headers: { "x-next-pull-service-key": key }, body, scope };
  const res = {
    statusCode: 200,
    payload: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  };
  await POST(req as never, res as never);
  return { res, customers, orders, scope };
};

describe("private account bridge", () => {
  beforeEach(() => {
    process.env.NEXT_PULL_SERVICE_KEY = "secret";
  });
  afterEach(() => {
    delete process.env.NEXT_PULL_SERVICE_KEY;
  });
  it("rejects missing or invalid service credentials", async () => {
    expect(
      (await run({ operation: "addresses", customer_id: "cus_a" }, "wrong")).res
        .statusCode,
    ).toBe(401);
    delete process.env.NEXT_PULL_SERVICE_KEY;
    expect(
      (await run({ operation: "addresses", customer_id: "cus_a" })).res
        .statusCode,
    ).toBe(401);
  });
  it("scopes order details to the customer and assigns its order number", async () => {
    const { res, orders, scope } = await run({
      operation: "order",
      customer_id: "cus_a",
      id: "order_b",
    });
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatchObject({
      order: { id: "order_b", customer_order_number: 1 },
    });
    expect(res.payload).toMatchObject({
      order: {
        items: [{ id: "item_a", variant_title: "12 — Salah" }],
        shipping_address: {
          first_name: "Test",
          address_1: "1 Main St",
          city: "Cairo",
        },
      },
    });
    expect(getOrderDetailWorkflow).toHaveBeenCalledWith(scope);
    const workflow = jest
      .mocked(getOrderDetailWorkflow)
      .mock.results.at(-1)?.value;
    expect(workflow?.run).toHaveBeenCalledWith({
      input: expect.objectContaining({
        order_id: "order_b",
        filters: { customer_id: "cus_a", is_draft_order: false },
        fields: expect.arrayContaining([
          "items.*",
          "items.variant.*",
          "shipping_address.*",
          "shipping_methods.*",
        ]),
      }),
    });
    expect(orders.listAndCountOrders).toHaveBeenCalledTimes(2);
  });
  it("refuses to mutate an address outside the customer scope", async () => {
    const { res, customers } = await run({
      operation: "delete_address",
      customer_id: "cus_a",
      id: "addr_b",
    });
    expect(res.statusCode).toBe(404);
    expect(customers.listCustomerAddresses).toHaveBeenCalledWith(
      { id: "addr_b", customer_id: "cus_a" },
      expect.anything(),
    );
  });
  it("rejects invalid and unexpected input", async () => {
    expect(
      (
        await run({
          operation: "create_address",
          customer_id: "cus_a",
          address: { customer_id: "cus_b" },
        })
      ).res.statusCode,
    ).toBe(400);
  });
});
