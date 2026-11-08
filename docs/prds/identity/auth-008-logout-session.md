# AUTH-008: Log out current session


## Outcome and scope

The current token is revoked and local credentials are cleared.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api AuthController.logout. This pointer is not a fresh implementation audit.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
