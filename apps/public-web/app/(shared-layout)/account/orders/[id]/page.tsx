import type { Metadata } from "next";
import { OrderDetails } from "./order-details";

export const metadata: Metadata = {
  title: "Order details | Next Pull",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetails orderId={id} />;
}
