# AUTH-005: Sign in with password


## Outcome and scope

Valid credentials create an authenticated session.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/Login.tsx; apps/api AuthController.login. This pointer is not a fresh implementation audit.

## UI Page Used
- `/login` and `/login/facebook` (public storefront)
- /login

## Backend API Route Used
- `/api/v1/auth/oauth/{facebook,google}/{redirect,callback,pending,signup,verify,link}`
- POST /api/v1/auth/login

## Related Files
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

Facebook and Google sign-in use Ally with a state-protected callback. An existing account must sign in with its password and explicitly confirm linking; a new account is created and linked only after mobile verification. Pending identities expire after 20 minutes and no identity is linked by email alone. Provider access tokens are not stored. Production signup remains blocked until OTP delivery is configured.

Related social sign-in implementation: `apps/api/app/controllers/facebook_auth_controller.ts`, `apps/api/app/services/facebook_identity_service.ts`, `apps/api/database/migrations/1792700000000_create_facebook_identities.ts`, `apps/public-web/src/components/FacebookCompletion.tsx`, and `apps/api/docs/facebook-login.md`. The same routes are available for both providers; existing Facebook paths remain supported. Pending records created before the provider migration default to Facebook. Lucid models `apps/api/app/models/pending_external_identity.ts` and `apps/api/app/models/external_identity.ts` own social identity persistence; pending signup and OTP verification remain transaction-bound. The shared authentication shell uses document scrolling and provider-branded social controls; public login preserves a safe return path when navigating to signup. Public login, signup, OTP verification, and provider-neutral social completion run in `apps/public-web`; Better Auth handles provider OAuth, with a signed single-use session-bound handoff to Adonis. Collector Disk entry points preserve a collector destination; public entry defaults to the public site. The additive `apps/api/database/migrations/1792900000000_create_social_auth_attempts.ts` migration is required.

The public login page uses a quieter, compact authentication shell and responsive two-column controls on larger screens while retaining its existing sign-in methods and accessible form behavior. Smaller or zoomed viewports may scroll to keep all controls accessible.

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
