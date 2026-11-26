# AUTH-008: Log out current session


## Outcome and scope

The current token is revoked and the browser session is cleared.

## Requirements

- The storefront account hub presents this feature in its corresponding linkable account tab, using sidebar navigation on desktop and scrollable tabs on mobile.

- The storefront account security section signs out the current session, clears all server-side session data and cached account data, and returns to sign-in. The shared storefront header determines authentication from the Adonis session validity response, forwarding the session ID cookie and its matching session-data cookie. An expired session is treated as signed out; other failures allow a retry.
- The signed-in storefront header offers the same sign-out action through the username menu. The menu also links to the account page and keeps a failed sign-out available for retry.
- Successful or expired-session storefront sign-out clears the local cart cookie so later guest activity starts with a fresh cart.

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- Verify that the username menu opens by keyboard and touch. Verify successful and expired-session sign-out return to sign-in, and confirm that other failures show a retry message.
- Sign out with an active cart and verify the next guest visit starts with an empty cart.
- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api AuthController.logout. This pointer is not a fresh implementation audit.

## UI Page Used
- Shared header on storefront pages.
- apps/public-web/app/(shared-layout)/account/page.tsx

## Backend API Route Used
- GET /api/v1/auth/me
- POST /api/v1/auth/logout

## Related Files
- apps/public-web/app/(shared-layout)/account/account-hub.tsx
- apps/public-web/app/(shared-layout)/layout.tsx
- apps/public-web/src/components/storefront-account-menu.tsx
- apps/public-web/src/lib/auth/use-storefront-logout.ts
- apps/public-web/src/lib/commerce/cart-actions.ts
- packages/ui-web/src/components/next/public-header/index.tsx
- packages/ui-web/src/components/next/public-shell/index.tsx
- apps/public-web/src/lib/clients/adonis.ts
- packages/api-contracts/src/client.ts
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/start/routes/v1/users.routes.ts
- apps/api/app/controllers/auth_controller.ts
- apps/api/app/controllers/identity_controller.ts
- apps/web/src/pages/Login.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
