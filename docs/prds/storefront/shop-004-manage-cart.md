# SHOP-004: Manage cart


## Outcome and scope

A shopper can add an available product variant and manage quantities or remove items in the cart drawer. Checkout is not yet available.

## Requirements

- Medusa owns cart pricing and availability; validate the product, variant, region and quantity before adding and show a recoverable error when availability changes.
- Show selected variant details when the product has multiple variants, retaining details when variant data is unavailable. Allow quantity changes and removal with accessible controls, and show a disabled checkout action until checkout is implemented.
- Persist the cart ID in an HTTP-only cookie and provide an accessible review drawer from the header and after adding an item.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- Product detail page and storefront header — cart drawer.

## Backend API Route Used
- `POST /store/carts`, `GET /store/carts/:id` and `POST /store/carts/:id/line-items` — Medusa cart creation, retrieval and item addition.
- `POST /store/carts/:id/line-items/:line_id`, `DELETE /store/carts/:id/line-items/:line_id` — update and remove cart items.
- `POST /api/cart/add` — purchase-form fallback that adds an item and returns to the product page.

## Related Files
- apps/public-web/src/lib/cart-actions.ts
- apps/public-web/app/api/cart/add/route.ts
- apps/public-web/src/providers/CartProvider.tsx
- apps/public-web/tests/product-cart.test.mjs
- packages/ui-web/src/cart-drawer.test.jsx
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
