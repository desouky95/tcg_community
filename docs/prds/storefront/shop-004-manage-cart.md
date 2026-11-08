# SHOP-004: Manage cart


## Outcome and scope

A shopper can add, update and remove available products.

## Requirements

- Medusa owns cart pricing and availability; show a recoverable error when availability changes.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
