# SHOP-006: View order

## Outcome and scope

A customer can identify each of their orders with a customer-scoped number and review its items, payment, fulfillment, totals, and shipping address.

## Requirements

- Referenced application configuration reads root `.env` names directly: `API_*`, `BACKEND_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Order panels use the shared storefront surface components.

- The storefront account hub presents this feature in its corresponding linkable account tab, using sidebar navigation on desktop and scrollable tabs on mobile.

- Medusa owns order, payment and fulfillment state; enforce customer ownership.
- Assign each customer a chronological order number independent of Medusa’s store-wide display number.
- Show variant-specific line item names, quantities, prices, order totals, payment and fulfillment states, and the saved shipping address.
- A detail request must match both the requested Medusa order ID and the authenticated customer’s linked Medusa customer ID.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Each customer sees a distinct sequential order reference; an order detail URL returns only that customer’s requested order.
- Order lines distinguish variants when their saved variant title is available; missing addresses and item data have clear fallback states.
- When Medusa has line items and a shipping address saved, the order detail response includes both and the page renders them.
- The order list shows Medusa’s aggregated fulfillment status, including delivered orders, rather than the order lifecycle status.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used

- apps/public-web/app/(shared-layout)/account/page.tsx
- `/account/orders/[id]`

## Backend API Route Used

- GET /api/v1/account/commerce/orders
- GET /api/v1/account/commerce/orders/:id
- POST /store/community/account (service-only Medusa bridge)

## Related Files

- apps/public-web/app/(shared-layout)/account/account-settings.tsx
- apps/public-web/app/(shared-layout)/account/commerce-sections.tsx
- apps/public-web/app/(shared-layout)/account/order-utils.ts
- apps/public-web/app/(shared-layout)/account/orders/[id]/page.tsx
- apps/public-web/app/(shared-layout)/account/orders/[id]/order-details.tsx
- apps/api/app/controllers/commerce_controller.ts
- apps/api/app/services/commerce_customer_service.ts
- apps/backend/src/api/store/community/account/route.ts
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
