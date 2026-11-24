# AUTH-007: Recover forgotten password

> Temporary mobile-verification suspension: this policy supersedes the OTP behavior described below until verification is restored. Password signup creates an unverified account (201), issues no challenge, and sends the user to password login. Password login permits unverified accounts while retaining password, blocked-account, and active-status checks. Mobile edits clear verification without issuing a challenge. OTP issuance, verification, sign-in, recovery, and social signup/verification routes return 410; recovery never bypasses ownership proof. Existing verification flags are not bulk changed.



## Outcome and scope

A verified account can set a new password and revoke old sessions.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- Manual verification for the temporary policy: signup returns 201 without an OTP challenge; the storefront goes to login; valid passwords work for unverified active accounts; wrong passwords and blocked accounts remain denied. Disabled OTP routes return 410 without writes. Mobile edits do not issue a challenge or redirect to verification. Existing OTP tests describe the suspended behavior and need revision when testing is authorized.

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current implementation. This pointer is not a fresh implementation audit.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- packages/api-contracts/src/types.ts
- apps/public-web/src/components/SignupForm.tsx
- apps/public-web/src/components/LoginForm.tsx
- apps/public-web/app/(auth)/signup/page.tsx
- apps/public-web/app/(auth)/verify-otp/page.tsx
- apps/public-web/app/(auth)/login/otp/page.tsx
- apps/public-web/app/(shared-layout)/account/account-hub.tsx
- apps/web/src/pages/ProfileEdit.tsx
- apps/web/src/pages/Signup.tsx
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
