# SHOP-006: View order


## Outcome and scope

A customer can view their own order and its status.

## Requirements

- Medusa owns order, payment and fulfillment state; enforce customer ownership.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- apps/public-web/app/(shared-layout)/account/page.tsx

## Backend API Route Used
- GET /api/v1/account/commerce/orders
- GET /api/v1/account/commerce/orders/:id
- POST /store/community/account (service-only Medusa bridge)

## Related Files
- apps/public-web/app/(shared-layout)/account/account-settings.tsx
- apps/public-web/app/(shared-layout)/account/commerce-sections.tsx
- apps/api/app/controllers/commerce_controller.ts
- apps/api/app/services/commerce_customer_service.ts
- apps/backend/src/api/store/community/account/route.ts
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
