# CAT-001: Browse catalogue categories


## Outcome and scope

Published catalogue categories are listed. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/Checklists.tsx. This pointer is not a fresh implementation audit.

## UI Page Used
- /checklists

## Backend API Route Used
- GET /api/v1/categories

## Related Files
- apps/api/start/routes/v1/categories.routes.ts
- apps/api/app/controllers/categories_controller.ts
- apps/api/app/models/category.ts
- apps/api/tests/functional/categories.spec.ts
- packages/api-contracts/src/client.ts
- packages/react-query/src/hooks.ts
- apps/web/src/pages/Checklists.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
