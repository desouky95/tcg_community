# COL-013: Reset or remove collection


## Outcome and scope

A confirmed reset removes active progress while preserving audit obligations. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current implementation. This pointer is not a fresh implementation audit.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/collection_progress_controller.ts
- apps/api/app/services/collection_progress_service.ts
- apps/web/src/pages/CollectionEdit.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
