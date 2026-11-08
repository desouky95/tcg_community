# AUTH-001: Register an account


## Outcome and scope

A guest creates an unverified account and a signup verification challenge, then continues to the separate verification page. No authenticated session is created by signup. Existing collection and checklist behavior is unchanged.

## Requirements

- Collect full name, username, email, Egyptian mobile number, password and confirmation, and governorate. Enforce the server's validation and uniqueness constraints, including an 8–32 character password.
- Create the user and challenge atomically. Reject invalid and duplicate submissions without creating partial accounts. Never expose a password or verification code in the response.
- Create a signup-purpose challenge, stored as a hash with an expiry and attempt limit. A resend invalidates the previous signup challenge. Challenges for other purposes cannot satisfy signup verification.
- On success, navigate to verification without automatically requesting a second code. Show validation and request errors while retaining the form; prevent duplicate submissions while pending.
- OTP delivery is a development-only mock: in development the code is printed in API server logs; test mode suppresses output. Production signup and resend return an unavailable response until a real delivery provider is integrated.

## Acceptance and verification

- A valid submission creates one unverified user and one signup challenge and returns 202. Only subsequent successful verification establishes an authenticated session.
- Invalid, duplicate and failed requests do not create a partial registration. A verified user's login challenge remains separate from signup challenges.
- Verify the registration API, transaction rollback, purpose-specific resend and verification, form validation, errors and navigation. Production OTP delivery requires separate implementation and verification.

## UI Page Used
- /signup

## Backend API Route Used
- POST /api/v1/auth/signup

## Related Files
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
