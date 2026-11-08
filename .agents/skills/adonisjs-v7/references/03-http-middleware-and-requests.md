# HTTP context, requests, middleware and files

Read for cross-cutting request behavior, cookies, params, headers, multipart parsing and uploads.

**Official Markdown:** [HTTP context](https://docs.adonisjs.com/guides/basics/http-context.md) · [Middleware](https://docs.adonisjs.com/guides/basics/middleware.md) · [Request](https://docs.adonisjs.com/guides/basics/request.md) · [Response](https://docs.adonisjs.com/guides/basics/response.md) · [File uploads](https://docs.adonisjs.com/guides/basics/file-uploads.md)

## Request lifecycle

- Controllers access request-scoped tools through `HttpContext`: `request`, `response`, `params`, and installed integrations such as `auth`, `bouncer`, `serialize`.
- Middleware may short-circuit the pipeline or call `next()`; missing `next()` can prevent downstream handlers from running.
- AdonisJS has server, router and named middleware stacks. Register in `start/kernel.ts` according to when it should run.
- Choose route middleware for authorization or endpoint-specific behavior; use global middleware only for true cross-cutting work.
- Middleware classes are container-created; when using DI in middleware, use constructor injection rather than method-parameter injection.

## Request hygiene

- `request.input()`/`request.only()` read values; they do not inherently validate them. Validate at the boundary with VineJS.
- Explicitly validate body, query, route params, cookies and files as needed. Don't assume a body validator covers everything.
- Trusted proxies, body size limits, CORS and cookies are deployment-sensitive. Review configuration before changing them.
- Never log full authorization headers, password fields, cookies or uploaded secrets.

## Upload checks

- Validate size/type and storage policy. Filenames and MIME declarations are untrusted.
- Inspect `@adonisjs/drive` before using cloud storage examples; it is an optional package.
- Avoid writing untrusted uploads into a public directory without an explicit requirement.
- For multi-file uploads, plan partial failure cleanup, ownership and access control.

## Verification

Test allowed/denied access, missing input, large files, invalid formats, and behavior when optional middleware/providers are absent.
