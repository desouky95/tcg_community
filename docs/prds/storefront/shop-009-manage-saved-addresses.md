# SHOP-009: Manage saved addresses

## Outcome and scope

A signed-in customer can view and manage the delivery addresses saved to their Medusa customer account.

## Requirements

- Resolve the customer from the authenticated Next Pull user on the server; never use a browser-supplied customer ID as authorization.
- Allow address creation, editing, and deletion with validation, ownership checks, and actionable loading, empty, success, and failure states.
- Keep the Medusa service key private and preserve profile access during commerce outages.

## Acceptance and verification

- An authenticated customer can manage their own saved addresses, while guests and other customers cannot access or modify them.
- Verify validation, service failures, keyboard access, and persistence through the service boundary.

## UI Page Used
- apps/public-web/app/(shared-layout)/account/page.tsx

## Backend API Route Used
- GET /api/v1/account/commerce/addresses
- POST /api/v1/account/commerce/addresses
- PUT /api/v1/account/commerce/addresses/:id
- DELETE /api/v1/account/commerce/addresses/:id
- POST /store/community/account (service-only Medusa bridge)

## Related Files
- apps/public-web/app/(shared-layout)/account/account-settings.tsx
- apps/public-web/app/(shared-layout)/account/commerce-sections.tsx
- apps/api/app/controllers/commerce_controller.ts
- apps/api/app/services/commerce_customer_service.ts
- apps/backend/src/api/store/community/account/route.ts

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
