# SHOP-005: Checkout

## Outcome and scope

A shopper submits delivery and payment details for a NextPull order.

## Requirements

- Guide guests and signed-in shoppers through contact, delivery, payment, review, and confirmation; offer available saved addresses and account email when accessible.
- Medusa validates cart, shipping, totals and payment before order placement; show final charges before confirmation. Delivery options and prices come from Medusa. The system manual payment provider is supported; other providers require an explicit integration.
- Use React Hook Form for stage-specific validation and accessible field errors; retain entered values during navigation and invalidate delivery and payment selections when the address changes.
- Handle unavailable carts and options, invalid details, changed totals, payment failures, and uncertain order completion without inviting duplicate orders.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used

- apps/public-web/app/(shared-layout)/checkout/page.tsx

## Backend API Route Used

- Medusa Store API: cart retrieval and update, shipping options and calculation, shipping method selection, payment provider and session, and cart completion.
- GET /api/v1/account/commerce/addresses — optional saved addresses.

## Related Files

- apps/public-web/app/(shared-layout)/checkout/checkout.tsx
- apps/public-web/app/(shared-layout)/checkout/use-checkout.ts
- apps/public-web/app/(shared-layout)/checkout/checkout-bindings.ts
- packages/ui-web/src/components/patterns/checkout/index.tsx
- apps/public-web/src/lib/checkout-actions.ts
- apps/public-web/src/lib/checkout-review.ts
- apps/public-web/src/providers/CartProvider.tsx
- apps/public-web/tests/checkout.test.mjs
- packages/ui-web/src/checkout-form.test.jsx

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
