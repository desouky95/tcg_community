# Authorization and security — AdonisJS v7

Use for permissions, object ownership, cross-tenant access and HTTP hardening.

**Official Markdown:** [Authorization](https://docs.adonisjs.com/guides/auth/authorization.md) · [Hashing](https://docs.adonisjs.com/guides/security/hashing.md) · [CORS](https://docs.adonisjs.com/guides/security/cors.md) · [Securing SSR](https://docs.adonisjs.com/guides/security/securing-ssr-applications.md) · [Rate limiting](https://docs.adonisjs.com/guides/security/rate-limiting.md)

## Policies and abilities

- Bouncer (`@adonisjs/bouncer`) is optional: verify it is installed and registered before using it.
- Prefer simple abilities for reusable checks and policies for action-on-resource permissions.
- Put ownership and tenant checks in policy/authorized query layers, not just UI flags.
- For mutation routes, load the object within the caller's authorized scope and authorize the exact action.

```ts
// Illustrative: assumes Bouncer, `editArticle` ability, and Article model exist.
const article = await Article.findOrFail(params.id)
await bouncer.authorize(editArticle, article)
// Perform an authorized write after validation.
```

## Defense-in-depth

- Keep CSRF protections for cookie-based actions and configure CORS for intended origins/credentials only.
- Avoid treating access-token permissions as a replacement for resource ownership or Bouncer policies.
- Apply appropriate rate limits to authentication, email sending, costly searches and public mutation endpoints.
- Don't include internal/auth fields in transformers. For sensitive field control, default to allowlists.
- Use query parameter binding, validate all inputs, and sanitize user-provided URLs/filenames where relevant.
- Prefer 404 over exposing existence where authorization policy dictates, but respect the project's API contract.
- Ensure tests cover guest, wrong role, cross-user access and race-related privilege changes.
