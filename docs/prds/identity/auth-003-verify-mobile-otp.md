# AUTH-003: Verify mobile OTP

> Temporary mobile-verification suspension: this policy supersedes the OTP behavior described below until verification is restored. Password signup creates an unverified account (201), issues no challenge, and sends the user to password login. Password login permits unverified accounts while retaining password, blocked-account, and active-status checks. Mobile edits clear verification without issuing a challenge. OTP issuance, verification, sign-in, recovery, and social signup/verification routes return 410; recovery never bypasses ownership proof. Existing verification flags are not bulk changed.



## Outcome and scope

The challenge is consumed, the account is verified, and a session is issued.

## Requirements

- When verification has signed the user in, use Next.js navigation for storefront destinations and a full browser navigation for Collector Disk. During the suspension, the verification page links back to password sign-in and preserves the destination.

- Referenced application configuration reads root `.env` names directly: `API_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- Manual verification for the temporary policy: signup returns 201 without an OTP challenge; the storefront goes to login; valid passwords work for unverified active accounts; wrong passwords and blocked accounts remain denied. Disabled OTP routes return 410 without writes. Mobile edits do not issue a challenge or redirect to verification. Existing OTP tests describe the suspended behavior and need revision when testing is authorized.

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/VerifyOTP.tsx; apps/api AuthController.verifyOtp. This pointer is not a fresh implementation audit.

## UI Page Used
- `/login` and `/login/facebook` (public storefront)
- `/verify-otp` (public storefront) shows that mobile verification is disabled. Its password sign-in link preserves the login destination and return path.

## Backend API Route Used
- `/api/v1/auth/oauth/{facebook,google}/{redirect,callback,pending,signup,verify,link}`
- The disabled social signup and verification POST routes use Tuyau names `auth.oauth_signup` and `auth.oauth_verify`.
- POST `/api/v1/auth/verify-otp` (Tuyau: `auth.verify_otp`; returns 410 during the suspension).

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

Facebook and Google sign-in use Ally with a state-protected callback. An existing account must sign in with its password and explicitly confirm linking; a new account is created and linked only after mobile verification. Pending identities expire after 20 minutes and no identity is linked by email alone. Provider access tokens are not stored. Production signup remains blocked until OTP delivery is configured.

Related social sign-in implementation: `apps/api/app/controllers/facebook_auth_controller.ts`, `apps/api/app/services/facebook_identity_service.ts`, `apps/api/database/migrations/1792700000000_create_facebook_identities.ts`, `apps/public-web/src/components/FacebookCompletion.tsx`, and `apps/api/docs/facebook-login.md`. The same routes are available for both providers; existing Facebook paths remain supported. Pending records created before the provider migration default to Facebook. Lucid models `apps/api/app/models/pending_external_identity.ts` and `apps/api/app/models/external_identity.ts` own social identity persistence; pending signup and OTP verification remain transaction-bound. Public login, signup, OTP verification, and provider-neutral social completion run in `apps/public-web`; Better Auth handles provider OAuth, with a signed single-use session-bound handoff to Adonis. Collector Disk entry points preserve a collector destination; public entry defaults to the public site. The additive `apps/api/database/migrations/1792900000000_create_social_auth_attempts.ts` migration is required.

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
