# COL-003: View own collection


## Outcome and scope

The owner sees editable card states. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Referenced application configuration reads root `.env` names directly: `API_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- The shared collection service rejects entry updates when the collection has no owner or checklist.

- Return the owner's collection version, visibility, and per-card quantities through the owner-authorized details endpoint.
- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- Build maintenance: The shared Card contract includes the optional userCard relation returned for collector card rows, preserving the existing ownership display. Verified by the collector production build; scenario tests were not run.

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api UserChecklistsController.show. This pointer is not a fresh implementation audit.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/web/src/pages/Collection/collection.table.tsx
- packages/api-contracts/src/types.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/collection_progress_controller.ts
- apps/api/app/services/collection_progress_service.ts
- apps/web/src/pages/CollectionEdit.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
