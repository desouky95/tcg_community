# REV-007: Recalculate reputation


## Outcome and scope

A deterministic projection updates the public trust score.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current worker. This pointer is not a fresh implementation audit.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/reviews_controller.ts
- apps/api/app/models/review.ts
- apps/api/app/validators/review.ts

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
