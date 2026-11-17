import type { HttpTypes } from "@medusajs/types";

// Only values shown or used by the review are included; sort collections so API ordering is immaterial.
export function checkoutReview(cart: HttpTypes.StoreCart) {
  const address = cart.shipping_address;
  return JSON.stringify({
    email: cart.email,
    currency: cart.currency_code,
    total: cart.total,
    subtotal: cart.subtotal,
    shipping: cart.shipping_total,
    tax: cart.tax_total,
    discount: cart.discount_total,
    address: address && [
      address.first_name,
      address.last_name,
      address.address_1,
      address.address_2,
      address.city,
      address.province,
      address.postal_code,
      address.country_code,
      address.phone,
    ],
    items: (cart.items ?? [])
      .map((item) => [item.id, item.variant_id, item.quantity, item.total])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
    methods: (cart.shipping_methods ?? [])
      .map((method) => [method.shipping_option_id, method.amount])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
  });
}
