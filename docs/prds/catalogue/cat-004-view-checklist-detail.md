# CAT-004: View checklist detail


## Outcome and scope

Checklist metadata and cards are returned. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

Checklist details never include collectors’ private collection rows.

## Requirements

- Referenced application configuration reads root `.env` names directly: `API_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- Build maintenance: Typed checklist fallback fixtures include slugs, aggregate counts, and ordered card rows. Verified by the collector production build; scenario tests were not run.

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api ChecklistsController.show. This pointer is not a fresh implementation audit.

- Checklist detail expansion does not serialize user collection records.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- `GET /api/v1/checklists/:id`

## Related Files
- packages/api-contracts/src/types.ts
- apps/web/src/providers/ApiHooksProvider.tsx
- apps/web/src/lib/mockData.ts
- apps/api/start/routes/v1/checklists.routes.ts
- apps/api/app/controllers/checklists_controller.ts
- apps/web/src/pages/Checklists.tsx
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
