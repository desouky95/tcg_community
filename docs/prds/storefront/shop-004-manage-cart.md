# SHOP-004: Manage cart

## Outcome and scope

A shopper can add an available product variant and manage quantities or remove items in the cart drawer. A non-empty cart can continue to checkout.

## Requirements

- Reject `Coming Soon` products in Medusa cart-creation, add-item, and line-item-update workflow validation hooks, including direct Store API requests and batch missing-list additions. Keep item removal available. Pre-order products follow normal Medusa cart and inventory rules.

- Medusa owns cart pricing and availability; validate the product, variant, region and quantity before adding and show a recoverable error when availability changes.
- Show selected variant details when the product has multiple variants, retaining details when variant data is unavailable. Allow quantity changes and removal with accessible controls, and provide a checkout link for a non-empty cart.
- Persist the cart ID in an HTTP-only cookie and provide an accessible review drawer from the header and after adding an item.
- Clear the storefront cart cookie on sign-out so an account-linked cart does not carry over to the next shopper.
- Keep the drawer and header count synchronized through the React Query cart cache; refresh when opening the drawer and cancel stale reads before cart mutations.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- Manually verify direct cart creation with items, single and batch additions, and quantity updates reject Coming Soon products. Confirm blocked items can still be removed and ordinary/Pre-order items remain usable.

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
- apps/backend/src/workflows/hooks/product-availability.ts

- apps/public-web/src/lib/commerce/cart-actions.ts
- apps/public-web/src/lib/clients/medusa.ts
- apps/public-web/app/api/cart/add/route.ts
- apps/public-web/src/providers/CartProvider.tsx
- apps/public-web/tests/product-cart.test.mjs
- packages/ui-web/src/cart-drawer.test.jsx
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
