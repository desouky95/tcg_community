# AUTH-017: Delete or anonymize personal data


## Outcome and scope

Eligible profile data is deleted or anonymized while retained records preserve legal integrity.

## Requirements

- The account hub requires the password and DELETE confirmation, then signs the user out after anonymization. Existing retained records and deactivated-account deletion behavior remain in place.

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current implementation. This pointer is not a fresh implementation audit.

## UI Page Used
- apps/public-web/app/(shared-layout)/account/page.tsx

## Backend API Route Used
- POST /api/v1/account/privacy-deletions

## Related Files
- apps/public-web/app/(shared-layout)/account/account-settings.tsx
- apps/api/app/controllers/identity_controller.ts
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
