"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";
import { Button, StatusBadge, Surface } from "@tcg/ui-web";
import { api } from "../../../../../src/lib/clients/adonis";
import { authQuery } from "../../../../../src/lib/auth/auth-destination";
import {
  formatPaymentStatus,
  formatMoney,
  formatStatus,
  orderItemTitle,
  type Order,
} from "../../order-utils";

function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="border-t border-wax-line py-10">
      <p>We couldn’t load this order. Please try again.</p>
      <Button variant="outline" className="mt-4" onClick={retry}>
        Try again
      </Button>
    </div>
  );
}

export function OrderDetails({ orderId }: { orderId: string }) {
  const order = useQuery({
    queryKey: ["account-order", orderId],
    queryFn: async () =>
      (
        await api.http.get<{ order: Order }>(
          `/account/commerce/orders/${encodeURIComponent(orderId)}`,
        )
      ).data.order,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const errorStatus = (order.error as { response?: { status?: number } } | null)
    ?.response?.status;

  return (
    <main className="mx-auto w-full max-w-6xl px-gutter py-10 sm:py-14">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-wax-muted">
          <Link href="/account" className="hover:text-wax-ink hover:underline">
            Account
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <Link
            href="/account?tab=orders"
            className="hover:text-wax-ink hover:underline"
          >
            Orders
          </Link>
          {order.data && (
            <>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span className="text-wax-ink">
                Your order #
                {String(order.data.customer_order_number).padStart(2, "0")}
              </span>
            </>
          )}
        </nav>

        <Link
          href="/account?tab=orders"
          className="focus-ring inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-wax-navy hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to orders
        </Link>

        <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
          Order details
        </h1>

        {order.isPending ? (
          <p role="status" className="mt-8 border-t border-wax-line py-10">
            Loading order…
          </p>
        ) : errorStatus === 401 || errorStatus === 403 ? (
          <div className="mt-8 border-t border-wax-line py-10">
            <p>Sign in to view your order.</p>
            <Button asChild className="mt-4">
              <a
                href={`/login?${authQuery("public", `/account/orders/${encodeURIComponent(orderId)}`)}`}
              >
                Sign in
              </a>
            </Button>
          </div>
        ) : order.isError || !order.data ? (
          <div className="mt-8">
            <ErrorState retry={() => void order.refetch()} />
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-wax-line pb-6">
              <div>
                <p className="inline-flex rounded-md bg-signature-lime-500 px-3 py-1.5 font-display text-lg font-semibold tabular-nums">
                  Your order #
                  {String(order.data.customer_order_number).padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm text-wax-muted">
                  Placed {new Date(order.data.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  tone="warning"
                  className="normal-case tracking-normal"
                >
                  Fulfillment: {formatStatus(order.data.fulfillment_status)}
                </StatusBadge>
                <StatusBadge className="normal-case tracking-normal">
                  Payment: {formatPaymentStatus(order.data.payment_status)}
                </StatusBadge>
              </div>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)]">
              <section aria-labelledby="order-items-heading">
                <h2
                  id="order-items-heading"
                  className="mb-4 font-display text-xl font-semibold"
                >
                  Items ({order.data.items?.length ?? 0})
                </h2>
                {order.data.items?.length ? (
                  <ul className="divide-y divide-wax-line border-y border-wax-line">
                    {order.data.items.map((item) => (
                      <li key={item.id} className="flex gap-4 py-5">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="size-20 shrink-0 rounded-lg border border-wax-line bg-white object-contain p-1"
                          />
                        ) : (
                          <span className="grid size-20 shrink-0 place-items-center rounded-lg border border-wax-line bg-white text-wax-muted">
                            <Package aria-hidden="true" className="size-7" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold leading-snug">
                            {orderItemTitle(item)}
                          </h3>
                          {item.product_title &&
                            item.product_title !== orderItemTitle(item) && (
                              <p className="mt-1 text-sm text-wax-muted">
                                {item.product_title}
                              </p>
                            )}
                          <p className="mt-2 text-sm text-wax-muted">
                            Qty {item.quantity} ·{" "}
                            {formatMoney(
                              item.unit_price,
                              order.data.currency_code,
                            )}{" "}
                            each
                          </p>
                        </div>
                        <p className="shrink-0 self-center text-right font-semibold tabular-nums">
                          {formatMoney(item.total, order.data.currency_code)}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="border-y border-wax-line py-6 text-wax-muted">
                    Item details aren’t available for this order.
                  </p>
                )}

                <dl className="ms-auto mt-5 max-w-sm space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">
                      {formatMoney(
                        order.data.subtotal,
                        order.data.currency_code,
                      )}
                    </dd>
                  </div>
                  {order.data.discount_total ? (
                    <div className="flex justify-between gap-4">
                      <dt>Discount</dt>
                      <dd className="tabular-nums">
                        −
                        {formatMoney(
                          order.data.discount_total,
                          order.data.currency_code,
                        )}
                      </dd>
                    </div>
                  ) : null}
                  {order.data.tax_total ? (
                    <div className="flex justify-between gap-4">
                      <dt>Tax</dt>
                      <dd className="tabular-nums">
                        {formatMoney(
                          order.data.tax_total,
                          order.data.currency_code,
                        )}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4">
                    <dt>Shipping</dt>
                    <dd className="tabular-nums">
                      {formatMoney(
                        order.data.shipping_total,
                        order.data.currency_code,
                      )}
                    </dd>
                  </div>
                  {!!order.data.shipping_methods?.length && (
                    <div className="flex items-start gap-2 text-wax-muted">
                      <Truck
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0"
                      />
                      <p>
                        {order.data.shipping_methods
                          .map((method) => method.name)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 border-t border-wax-line pt-3 font-display text-lg font-semibold">
                    <dt>Total</dt>
                    <dd className="tabular-nums">
                      {formatMoney(order.data.total, order.data.currency_code)}
                    </dd>
                  </div>
                </dl>
              </section>

              <aside className="space-y-6">
                <section aria-labelledby="payment-heading">
                  <h2
                    id="payment-heading"
                    className="mb-3 font-display text-xl font-semibold"
                  >
                    Payment
                  </h2>
                  <Surface className="rounded-xl p-5">
                    <p className="font-semibold">
                      {formatPaymentStatus(order.data.payment_status)}
                    </p>
                    <p className="mt-2 text-sm text-wax-muted">
                      Order total:{" "}
                      {formatMoney(order.data.total, order.data.currency_code)}
                    </p>
                  </Surface>
                </section>

                <section aria-labelledby="shipping-heading">
                  <h2
                    id="shipping-heading"
                    className="mb-3 font-display text-xl font-semibold"
                  >
                    Shipping address
                  </h2>
                  <Surface className="rounded-xl p-5">
                    {order.data.shipping_address ? (
                      <address className="not-italic leading-6">
                        <p className="flex items-start gap-2 font-semibold">
                          <MapPin
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0"
                          />
                          <span>
                            {[
                              order.data.shipping_address.first_name,
                              order.data.shipping_address.last_name,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </span>
                        </p>
                        <p className="ps-6">
                          {[
                            order.data.shipping_address.address_1,
                            order.data.shipping_address.address_2,
                            order.data.shipping_address.city,
                            order.data.shipping_address.province,
                            order.data.shipping_address.postal_code,
                            order.data.shipping_address.country_code?.toUpperCase(),
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {order.data.shipping_address.phone && (
                          <p className="ps-6 text-sm text-wax-muted">
                            {order.data.shipping_address.phone}
                          </p>
                        )}
                      </address>
                    ) : (
                      <p className="text-sm text-wax-muted">
                        No shipping address recorded.
                      </p>
                    )}
                  </Surface>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
