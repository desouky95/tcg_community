# Security and boundary rules

Official references:
- https://docs.adonisjs.com/guides/auth/introduction
- https://docs.adonisjs.com/guides/basics/validation
- https://docs.adonisjs.com/guides/frontend/transformers

## Authentication and authorization

- Determine configured guards before writing any auth code: session/cookie for typical server-rendered flows and access-token for many APIs. Do not replace the guard or middleware casually.
- Authentication confirms identity; policies/Bouncer or equivalent explicit checks determine ability to act on a resource.
- Scope data queries by the authenticated user or tenant, even if a route includes an ID. Checking only `auth.user` is not authorization.
- Prefer deny-by-default behavior for unknown ownership or missing privileges. Test 401/403/404 behavior according to existing app contracts.
- Do not leak whether private resources exist if the established app API intentionally masks them.

## Request data, output and persistence

- Use VineJS to validate and normalize input at boundaries. Be explicit about allowable update fields; don't persist `request.all()` to sensitive models.
- Treat model serialization as an exposure boundary. Explicit transformers and whitelisted fields prevent accidental `password`, `token`, internal flags and relation leakage.
- Treat multipart uploads as untrusted content: check file type/size, enforce storage access rules and do not trust client-provided filenames/paths.
- Protect CSRF-sensitive cookie workflows and CORS settings according to the application architecture. Avoid disabling protective middleware to get tests passing.
- Use validated environment variables; avoid storing secrets in committed files, logs or API responses.

## Side effects and retries

- Choose transaction boundaries to protect database invariants; note that external calls cannot generally roll back with a DB transaction.
- Use idempotency keys or deduplication for retryable payments, jobs and webhooks where needed.
- Apply rate limiting and abuse controls on sensitive endpoints when the installed app supports them.
- Log operational context without personal data or credentials.

## Explicitly unsafe actions

Never run production data resets or destructive migrations without the user's explicit authorization and an appropriate recovery plan. Do not rotate encryption keys, change auth guards or deploy security-sensitive changes as collateral work for an unrelated request.
