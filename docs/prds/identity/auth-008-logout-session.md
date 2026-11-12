# AUTH-008: Log out current session


## Outcome and scope

The current token is revoked and local credentials are cleared.

## Requirements

- The storefront account security section signs out the current session, clears cached account data, and returns to sign-in. An expired session is treated as signed out; other failures allow a retry.

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api AuthController.logout. This pointer is not a fresh implementation audit.

## UI Page Used
- apps/public-web/app/(shared-layout)/account/page.tsx

## Backend API Route Used
- POST /api/v1/auth/logout

## Related Files
- apps/public-web/app/(shared-layout)/account/account-hub.tsx
- apps/public-web/src/lib/api.ts
- packages/api-contracts/src/client.ts
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
