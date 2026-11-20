# PLAT-008: Maintain Medusa admin session

## Outcome and scope

Medusa admins remain signed in during normal use, with reauthentication required after 30 days of inactivity.

## Requirements

- Referenced application configuration reads root `.env` names directly: `BACKEND_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Use Medusa's session cookie authentication for the admin dashboard.
- Renew the session cookie during activity and expire it after 30 days without activity.
- Preserve explicit logout and server-side session validation.

## Acceptance and verification

- An active admin session receives a renewed cookie and stays authorized.
- An idle session expires after 30 days and requires sign-in.
- Logout invalidates the session.

## UI Page Used

- Medusa Admin dashboard

## Backend API Route Used

- `/auth/session`

## Related Files

- `apps/backend/medusa-config.ts`
- `apps/backend/src/admin/lib/client.tsx`
- `apps/backend/node_modules/@medusajs/framework/dist/http/express-loader.js` (framework behavior reference)

## After Implementation

- Update this PRD's UI page, API route, and related-files entries to match the implementation.
