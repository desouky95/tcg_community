# SHOP-005: Checkout

## Outcome and scope

A shopper submits delivery and payment details for a NextPull order.

## Requirements

- Referenced application configuration reads root `.env` names directly: `API_*`, `BACKEND_*`, `PUBLIC_WEB_* / NEXT_PUBLIC_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Before order creation and payment authorization, re-read the current Medusa product type for cart variants and reject carts containing `Coming Soon` products, including products whose type changed after cart addition. `Pre-order` products use the standard checkout and payment flow, with no deposits or deferred-payment system.

- Guide guests and signed-in shoppers through contact, delivery, payment, review, and confirmation; offer available saved addresses and account email when accessible.
- Medusa validates cart, shipping, totals and payment before order placement; show final charges before confirmation. Delivery options and prices come from Medusa. The system Manual provider remains available. InstaPay and Cash on delivery are offline providers for the Egypt / EGP region; both authorize at order placement and use Admin Capture and Refund as manual ledger actions after staff verify settlement or refund outside Medusa.
- Use React Hook Form for stage-specific validation and accessible field errors; retain entered values during navigation and invalidate delivery and payment selections when the address changes.
- Handle unavailable carts and options, invalid details, changed totals, payment failures, and uncertain order completion without inviting duplicate orders.
- Link a signed-in shopper’s Medusa customer to the active cart before continuing checkout and before order completion; resolve customers only by the Adonis user mapping, never by matching an unverified email.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- Manually add a normal product, change its Medusa type to Coming Soon, and confirm cart completion is rejected without an order or payment authorization. Remove the item and retry. Verify Pre-order checkout with configured stock/backorders.

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify all three payment methods in Egypt / EGP, hide InstaPay until both settings are valid, hide the offline providers outside Egypt / EGP, and check transfer/COD instructions. Verify Admin Capture and Refund ledger changes after offline settlement.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used

- apps/public-web/app/(shared-layout)/checkout/page.tsx
- apps/backend/src/admin/routes/payment-settings/page.tsx

## Backend API Route Used
- `POST /store/carts/:id/complete` — validates current product availability before placing an order.

- Medusa Store API: cart retrieval and update, shipping options and calculation, shipping method selection, payment provider and session, and cart completion.
- GET /store/payment-instructions?region_id=… — returns valid InstaPay URL and WhatsApp number for Egypt / EGP only.
- GET /admin/payment-settings and POST /admin/payment-settings — authenticated Admin settings for Egypt / EGP region metadata.
- POST /api/commerce/customer — links the authenticated Adonis account to its Medusa customer and current cart.
- GET /api/v1/account/commerce/addresses — optional saved addresses.

## Related Files
- apps/backend/src/workflows/hooks/product-availability.ts

- apps/public-web/app/(shared-layout)/checkout/checkout.tsx
- apps/public-web/app/(shared-layout)/checkout/use-checkout.ts
- apps/public-web/app/(shared-layout)/checkout/checkout-bindings.ts
- packages/ui-web/src/components/patterns/checkout/index.tsx
- apps/public-web/src/lib/commerce/checkout-actions.ts
- apps/backend/src/modules/offline-payment/service.ts
- apps/backend/medusa-config.ts
- apps/backend/src/api/middlewares.ts
- apps/backend/src/lib/offline-payment-settings.ts
- apps/backend/src/api/admin/payment-settings/route.ts
- apps/backend/src/api/store/payment-instructions/route.ts
- apps/backend/src/admin/routes/payment-settings/page.tsx
- apps/public-web/src/lib/commerce/checkout-review.ts
- apps/public-web/src/lib/clients/medusa.ts
- apps/public-web/app/api/commerce/customer/route.ts
- apps/api/app/controllers/commerce_controller.ts
- apps/api/app/services/commerce_customer_service.ts
- apps/api/app/validators/commerce_customer.ts
- apps/backend/src/api/store/community/customer-link/route.ts
- apps/public-web/src/providers/CartProvider.tsx
- apps/public-web/tests/checkout.test.mjs
- packages/ui-web/src/checkout-form.test.jsx

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
