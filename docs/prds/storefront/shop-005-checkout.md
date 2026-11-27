# SHOP-005: Checkout

## Outcome and scope

A shopper submits delivery and payment details for a NextPull order.

## Requirements

- Show published legal links at review and confirmation. Draft links stay hidden. Version-aware contractual acceptance requires the backend work in `docs/legal/implementation/backend-requirements.md`.

- Referenced application configuration reads root `.env` names directly: `API_*`, `BACKEND_*`, `PUBLIC_WEB_* / NEXT_PUBLIC_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Before order creation and payment authorization, re-read the current Medusa product type for cart variants and reject carts containing `Coming Soon` products, including products whose type changed after cart addition. `Pre-order` products use the standard checkout and payment flow, with no deposits or deferred-payment system.

- Guide guests and signed-in shoppers through contact, delivery, payment, review, and confirmation; offer available saved addresses and account email when accessible.
- Medusa validates cart, shipping, totals and payment before order placement; show final charges before confirmation. Delivery options and prices come from Medusa. The system Manual provider remains available. InstaPay and Cash on delivery are offline providers for the Egypt / EGP region; both authorize at order placement and use Admin Capture and Refund as manual ledger actions after staff verify settlement or refund outside Medusa.
- From the InstaPay option at the payment step, open a standalone Next Pull payment page on desktop in a separate tab. Show the active cart’s EGP total, a QR and copy action for the configured merchant link, and official app-store links. On phones and tablets, send the shopper directly to the configured link. Keep the original checkout open so the shopper can place the order after transferring and send the receipt with the order reference on WhatsApp.
- Recheck cart eligibility, payment settings, and the displayed total before showing payment instructions. If the amount changes after the shopper opens InstaPay, prompt them to contact support before paying again. Offer a manual copy option when clipboard access is unavailable.
- Use React Hook Form for stage-specific validation and accessible field errors; retain entered values during navigation and invalidate delivery and payment selections when the address changes.
- Handle unavailable carts and options, invalid details, changed totals, payment failures, and uncertain order completion without inviting duplicate orders.
- Link a signed-in shopper’s Medusa customer to the active cart before continuing checkout and before order completion; resolve customers only by the Adonis user mapping, never by matching an unverified email.
- Use the current Adonis session to distinguish guests from signed-in shoppers, even when a signed-out browser still sends a session cookie. Guests can complete checkout with an unlinked cart or a Medusa guest customer. If the cart belongs to an account, require the matching signed-in account before completing the order.
- Send the browser's `X-XSRF-TOKEN` header through the storefront customer-link proxy for Adonis Shield validation. Treat upstream redirects as checkout errors.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- Manually add a normal product, change its Medusa type to Coming Soon, and confirm cart completion is rejected without an order or payment authorization. Remove the item and retry. Verify Pre-order checkout with configured stock/backorders.

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify all three payment methods in Egypt / EGP, hide InstaPay until both settings are valid, hide the offline providers outside Egypt / EGP, and check transfer/COD instructions. Verify Admin Capture and Refund ledger changes after offline settlement.
- For an eligible cart, open the payment link on desktop and verify the QR and copy action use the same configured URL, the app-store links work, and the checkout tab retains its progress. Verify direct handoff on a phone, manual copy when clipboard access is denied, and recovery when settings or a valid cart are missing or the total changes.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
- With production CSRF protection enabled, verify that a signed-in shopper can pass Contact and submit an order, a guest can continue, and an invalid CSRF token produces a customer-link failure.
- Place an order in a clean guest browser and in a browser with a leftover signed-out session cookie. Expire the session after linking a cart and verify checkout asks the shopper to sign back in without creating an order. Verify a signed-in order appears under the linked account, and a real customer-link service failure blocks checkout.

## UI Page Used

- apps/public-web/app/(shared-layout)/checkout/page.tsx
- apps/public-web/app/checkout/instapay/page.tsx
- apps/backend/src/admin/routes/payment-settings/page.tsx

## Backend API Route Used
- `POST /store/carts/:id/complete` — validates current product availability before placing an order.

- Medusa Store API: cart retrieval and update, shipping options and calculation, shipping method selection, payment provider and session, and cart completion.
- GET /store/payment-instructions?region_id=… — returns valid InstaPay URL and WhatsApp number for Egypt / EGP only.
- GET /admin/payment-settings and POST /admin/payment-settings — authenticated Admin settings for Egypt / EGP region metadata.
- POST /api/commerce/customer — checks the session, returns guest status for a guest cart, and links signed-in shoppers to their Medusa customers.
- GET /api/v1/auth/me — resolves the current session when linking a customer or completing an account-linked cart.
- `POST /api/v1/auth/commerce/customer` — validates the session and CSRF token and links the account to the Medusa customer and cart.
- GET /api/v1/account/commerce/addresses — optional saved addresses.

## Related Files
- apps/backend/src/workflows/hooks/product-availability.ts

- apps/public-web/app/(shared-layout)/checkout/checkout.tsx
- apps/public-web/app/(shared-layout)/checkout/use-checkout.ts
- apps/public-web/app/(shared-layout)/checkout/checkout-bindings.ts
- apps/public-web/app/checkout/instapay/payment-link.tsx
- packages/ui-web/src/components/patterns/checkout/index.tsx
- apps/public-web/src/lib/commerce/checkout-actions.ts
- apps/public-web/src/lib/commerce/cart-customer.server.ts
- apps/public-web/src/lib/clients/adonis.server.ts
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
