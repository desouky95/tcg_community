# Authentication — sessions and access tokens

Read for sign-in/out, API guards, token issuance, auth middleware and credential verification.

**Official Markdown:** [Auth introduction](https://docs.adonisjs.com/guides/auth/introduction.md) · [Credential verification](https://docs.adonisjs.com/guides/auth/verifying-user-credentials.md) · [Session guard](https://docs.adonisjs.com/guides/auth/session-guard.md) · [Access tokens](https://docs.adonisjs.com/guides/auth/access-tokens-guard.md)

## Choose from the installed project

- Browser apps with compatible cookies often use session guards; external clients/mobile services often use access tokens.
- Access tokens in AdonisJS are opaque tokens stored as hashes, **not JWTs**. Do not assume JWT parsing or claims without separate project code.
- Auth guards and providers are configured explicitly. Inspect `config/auth.ts`, user model and auth middleware before using guard names.
- Existing app may use a session and token guard together; don't silently change guard for an endpoint.

## Secure flow

1. Validate credentials before checking them with configured model helpers (commonly `verifyCredentials` when AuthFinder is installed).
2. Use the configured guard's login/token methods, not home-grown tokens.
3. Protect private routes using the existing named auth middleware and expected guard selection.
4. Implement logout/revocation for the active authentication method.
5. Apply resource-level authorization after identity is known; authenticated does not imply permitted.

## Threat-model checks

- Rate-limit credential attempts, handle enumeration concerns, invalidate credentials where required, and keep token/password values out of logs.
- Rotate or expire sessions/tokens based on product needs; secure cookies and use CSRF protection for cookie-based browsers.
- Test wrong password, inactive user, revoked token, missing credentials, wrong guard and cross-user object access.
- Always preserve existing response semantics (401 vs redirect vs 403) and verify client `Accept` behavior.
