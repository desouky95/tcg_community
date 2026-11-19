import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import type {
  ICustomerModuleService,
  IOrderModuleService,
  OrderDetailDTO,
  OrderDTO,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { z } from "@medusajs/framework/zod";
import {
  createCustomerAddressesWorkflow,
  updateCustomerAddressesWorkflow,
  deleteCustomerAddressesWorkflow,
  getOrderDetailWorkflow,
  getOrdersListWorkflow,
} from "@medusajs/medusa/core-flows";
import { timingSafeEqual } from "node:crypto";

const field = z.string().trim().min(1).max(255);
const addressSchema = z
  .object({
    first_name: field,
    last_name: field,
    address_1: field,
    address_2: z.string().trim().max(255).optional(),
    city: field,
    province: z.string().trim().max(255).optional(),
    postal_code: z.string().trim().max(32).optional(),
    country_code: z.string().trim().length(2),
    phone: z.string().trim().max(32).optional(),
  })
  .strict();
const inputSchema = z.discriminatedUnion("operation", [
  z
    .object({
      operation: z.literal("orders"),
      customer_id: field,
      offset: z.number().int().min(0).max(100000).default(0),
    })
    .strict(),
  z
    .object({ operation: z.literal("order"), customer_id: field, id: field })
    .strict(),
  z.object({ operation: z.literal("addresses"), customer_id: field }).strict(),
  z
    .object({
      operation: z.literal("create_address"),
      customer_id: field,
      address: addressSchema,
    })
    .strict(),
  z
    .object({
      operation: z.literal("update_address"),
      customer_id: field,
      id: field,
      address: addressSchema,
    })
    .strict(),
  z
    .object({
      operation: z.literal("delete_address"),
      customer_id: field,
      id: field,
    })
    .strict(),
]);

const orderSelect = [
  "id",
  "status",
  "created_at",
  "currency_code",
  "subtotal",
  "tax_total",
  "discount_total",
  "shipping_total",
  "total",
  "items",
] as const;

function authorized(value: string | undefined) {
  const expected = process.env.NEXT_PULL_SERVICE_KEY;
  if (!expected || !value) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(value);
  return a.length === b.length && timingSafeEqual(a, b);
}

type OrderWithStatuses = OrderDTO &
  Partial<Pick<OrderDetailDTO, "payment_status" | "fulfillment_status">>;

function serializeOrder(order: OrderWithStatuses, customerOrderNumber: number) {
  const result = {
    id: order.id,
    customer_order_number: customerOrderNumber,
    status: order.status,
    fulfillment_status: order.fulfillment_status,
    payment_status: order.payment_status,
    created_at: order.created_at,
    currency_code: order.currency_code,
    subtotal: Number(order.subtotal),
    tax_total: Number(order.tax_total),
    discount_total: Number(order.discount_total),
    shipping_total: Number(order.shipping_total),
    total: Number(order.total),
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      product_title: item.product_title,
      variant_title: item.variant_title,
      thumbnail: item.thumbnail,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      total: Number(item.total),
    })),
  };
  return result;
}

function serializeOrderDetails(
  order: OrderDetailDTO,
  customerOrderNumber: number,
) {
  return {
    ...serializeOrder(order, customerOrderNumber),
    payment_status: order.payment_status,
    fulfillment_status: order.fulfillment_status,
    shipping_address: order.shipping_address
      ? {
          first_name: order.shipping_address.first_name,
          last_name: order.shipping_address.last_name,
          address_1: order.shipping_address.address_1,
          address_2: order.shipping_address.address_2,
          city: order.shipping_address.city,
          province: order.shipping_address.province,
          postal_code: order.shipping_address.postal_code,
          country_code: order.shipping_address.country_code,
          phone: order.shipping_address.phone,
        }
      : null,
    shipping_methods: (order.shipping_methods ?? []).map((method) => ({
      name: method.name,
      amount: Number(method.amount),
    })),
  };
}

/** Private service endpoint. The caller determines customer_id from its authenticated session. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!authorized(req.headers["x-next-pull-service-key"] as string | undefined))
    return res.status(401).json({ message: "Unauthorized" });
  const parsed = inputSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid request" });
  const input = parsed.data;
  const customer = req.scope.resolve(
    Modules.CUSTOMER,
  ) as ICustomerModuleService;
  const [existing] = await customer.listCustomers({ id: input.customer_id });

  const orders = req.scope.resolve(Modules.ORDER) as IOrderModuleService;
  if (input.operation === "orders" || input.operation === "order") {
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (input.operation === "order") {
      const { result: order } = await getOrderDetailWorkflow(req.scope).run({
        input: {
          order_id: input.id,
          filters: { customer_id: input.customer_id, is_draft_order: false },
          fields: [
            "id",
            "status",
            "created_at",
            "currency_code",
            "subtotal",
            "tax_total",
            "discount_total",
            "shipping_total",
            "total",
            "payment_status",
            "fulfillment_status",
            "items.*",
            "items.variant.*",
            "shipping_address.*",
            "shipping_methods.*",
          ],
        },
      });

      const [, customerOrderCount] = await orders.listAndCountOrders(
        { customer_id: input.customer_id },
        { take: 1, select: ["id"] },
      );
      const [customerOrders] = await orders.listAndCountOrders(
        { customer_id: input.customer_id },
        {
          take: customerOrderCount,
          order: { created_at: "ASC", display_id: "ASC" },
          select: ["id"],
        },
      );
      const customerOrderIndex = customerOrders.findIndex(
        ({ id }) => id === order.id,
      );
      if (customerOrderIndex === -1)
        return res.status(404).json({ message: "Not found" });
      const customerOrderNumber = customerOrderIndex + 1;
      return res.json({
        order: serializeOrderDetails(order, customerOrderNumber),
      });
    }

    const { result } = await getOrdersListWorkflow(req.scope).run({
      input: {
        fields: [...orderSelect, "fulfillments.*", "payment_collections.*"],
        variables: {
          filters: { customer_id: input.customer_id },
          order: { created_at: "DESC", display_id: "DESC" },
          skip: input.offset,
          take: 20,
        },
      },
    });
    const rows = Array.isArray(result) ? result : result.rows;
    const count = Array.isArray(result) ? rows.length : result.metadata.count;
    const serialized = rows.map((order, index) =>
      serializeOrder(order as OrderWithStatuses, count - input.offset - index),
    );
    return res.json({ orders: serialized, count });
  }
  if (input.operation === "addresses") {
    const rows = await customer.listCustomerAddresses(
      { customer_id: input.customer_id },
      { take: 100 },
    );
    return res.json({
      addresses: rows.map(
        ({
          id,
          first_name,
          last_name,
          address_1,
          address_2,
          city,
          province,
          postal_code,
          country_code,
          phone,
        }) => ({
          id,
          first_name,
          last_name,
          address_1,
          address_2,
          city,
          province,
          postal_code,
          country_code,
          phone,
        }),
      ),
    });
  }
  if (input.operation === "create_address") {
    await createCustomerAddressesWorkflow(req.scope).run({
      input: {
        addresses: [{ ...input.address, customer_id: input.customer_id }],
      },
    });
    return res.status(201).json({ ok: true });
  }
  const owned = await customer.listCustomerAddresses(
    { id: input.id, customer_id: input.customer_id },
    { take: 1 },
  );
  if (!owned.length) return res.status(404).json({ message: "Not found" });
  if (input.operation === "update_address")
    await updateCustomerAddressesWorkflow(req.scope).run({
      input: {
        selector: { id: input.id, customer_id: input.customer_id },
        update: input.address,
      },
    });
  else
    await deleteCustomerAddressesWorkflow(req.scope).run({
      input: { ids: [input.id] },
    });
  return res.json({ ok: true });
}
