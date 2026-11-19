export type OrderItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  product_title?: string | null;
  variant_title?: string | null;
  thumbnail?: string | null;
  quantity: number;
  unit_price?: number;
  total?: number;
};

export type Order = {
  id: string;
  customer_order_number: number;
  status: string;
  created_at: string;
  currency_code: string;
  subtotal?: number;
  shipping_total?: number;
  total?: number;
  tax_total?: number;
  discount_total?: number;
  payment_status?: string;
  fulfillment_status?: string;
  items?: OrderItem[];
  shipping_address?: {
    first_name?: string | null;
    last_name?: string | null;
    address_1?: string | null;
    address_2?: string | null;
    city?: string | null;
    province?: string | null;
    postal_code?: string | null;
    country_code?: string | null;
    phone?: string | null;
  } | null;
  shipping_methods?: { name: string; amount: number }[];
};

export function orderItemTitle(item: OrderItem) {
  return item.variant_title || item.subtitle || item.title;
}

export function formatMoney(amount: number | undefined, currency: string) {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function formatStatus(status: string | undefined) {
  if (!status) return "Not available";
  return status
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function formatPaymentStatus(status: string | undefined) {
  if (status === "captured") return "Paid";
  return formatStatus(status);
}
