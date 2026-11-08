---
name: adonisjs-v7
description: >-
  Implement, debug, review, test, refactor, and upgrade AdonisJS v7 TypeScript applications. Use for AdonisJS routes, controllers, middleware, Lucid ORM models and migrations, database queries and relationships, VineJS validation, authentication, authorization, transformers, service providers, Ace commands, and Japa tests. Also use for upgrading AdonisJS v6 projects to v7 or fixing v7-specific API and type errors. Prefer installed-project conventions and verified v7 APIs; do not activate for generic Node.js, TypeScript, or unrelated frameworks.
---

# AdonisJS v7

Deliver idiomatic, secure, maintainable changes **for the installed AdonisJS version**, with tests and a concise verification report. Do not treat framework APIs from v5/v6 or other Node.js frameworks as interchangeable with v7.

## Before changing code

1. Inspect `package.json`, lockfile, `adonisrc.ts`, `tsconfig.json`, `start/routes.ts`, `start/kernel.ts`, and neighboring files relevant to the request. Determine package manager, starter type (API, Hypermedia, React/Vue Inertia), `@adonisjs/core` major version, optional packages, and project conventions. Do not assume every application uses every framework feature.
2. If runnable, execute the read-only audit `node <skill-path>/scripts/inspect-project.mjs <project-root>`; it reports signals but does **not** replace direct inspection. Confirm that v7 uses Node.js **24+**. If the project is not v7, clarify/identify the mismatch and avoid silently converting it.
3. Inspect existing tests, public API response shapes, database schema and migration history, auth guard, and authorization strategy before changing a behavior that depends on them.
4. For unfamiliar, version-sensitive, or disputed APIs, consult the official [AdonisJS documentation](https://docs.adonisjs.com/) and the installed package types/source. If docs and installed versions conflict, follow the installed version and report the difference. Never invent import paths, CLI flags, decorators, configuration keys, or generated symbols.
5. State assumptions only when they materially affect behavior. Prefer a small, well-scoped patch over a broad rewrite.

## Implementation rules

- **TypeScript/ESM:** Follow the project's import aliases, naming and formatting. Prefer explicit types at public boundaries; avoid `any`, unsafe casts, and unnecessary non-null assertions.
- **Routes/controllers:** Keep `start/routes.ts` declarative and controllers focused on HTTP orchestration. Prefer the v7 generated controller barrel `import { controllers } from '#generated/controllers'` **when configured**; do not edit `.adonisjs/` generated files. Controller-backed routes can receive automatic names; check for collisions.
- **Validation:** Define VineJS validators in `app/validators/` and call `request.validateUsing(validator)` before passing input to the data layer. Validate query params, route params and uploaded files as appropriate. Prefer the built-in validation exception flow; do not swallow errors into misleading success responses.
- **Data access:** Prefer Lucid ORM and existing models/relationships. Check whether generated database schema classes (`#database/schema`) are used. Keep migration history additive; do not rewrite previously applied migrations. Use transactions for multi-record invariants; handle concurrent writes, N+1 queries, indexing and pagination intentionally.
- **Serialization:** Explicitly control outgoing fields. Prefer v7 transformers (`BaseTransformer` and the app's `serialize` helper) for JSON endpoints when configured; preserve the application's existing response contract. Do not expose passwords, tokens, internal columns or unauthorized relations.
- **Auth/authorization:** Respect configured session vs access-token guards. Authentication is not authorization; check ownership/permissions at resource boundaries. Follow existing Bouncer/policy patterns where installed.
- **DI/services:** Use controllers for transport logic; extract business logic to services only when repeated or complex. Use AdonisJS DI conventions where already established. Do not introduce repositories, event buses, queues or abstractions by default.
- **Configuration/secrets:** Use validated environment configuration; never hardcode credentials, log secrets, or expose debug information in production responses.
- **Side effects:** Ensure background work, events, email, storage and external calls are retry-safe when necessary. Do not assert a queue/scheduler package is built in unless the installed project provides it.
- **Compatibility:** Avoid v6-only imports and APIs; when changing framework-level code, consult [the v6→v7 upgrade guide](https://docs.adonisjs.com/v6-to-v7).

## Workflow

1. **Locate:** Find the nearest existing implementation, feature module, relevant model/migration and test. Read only the files necessary to understand the task.
2. **Design:** Describe affected routes, validation, model/query, output shape and tests. Preserve established conventions; explicitly call out database migrations or externally observable API changes.
3. **Implement:** Make the smallest coherent change, including required migrations, validation, authorization and response shaping. Avoid unrelated formatting churn.
4. **Verify:** Run the most relevant tests; then use available typecheck, lint, formatter and build scripts from `package.json`. For database changes, use the project's test database and fixtures; **do not** execute destructive migrations, resets or seeds against an unknown database.
5. **Report:** Summarize changed files, behavior, commands actually run, test outcomes and remaining risks. Clearly distinguish passing checks from checks not run.

## Load reference only for the task at hand

Read **only the relevant file(s)** from [references/README.md](references/README.md):

- App setup, generated code: [01-project-foundations.md](references/01-project-foundations.md).
- Routes/controllers: [02-routing-and-controllers.md](references/02-routing-and-controllers.md).
- Middleware, request, response, uploads: [03-http-middleware-and-requests.md](references/03-http-middleware-and-requests.md).
- VineJS: [04-vinejs-validation.md](references/04-vinejs-validation.md).
- Lucid migrations/models: [05-lucid-schema-and-models.md](references/05-lucid-schema-and-models.md); queries/relations/concurrency: [06-lucid-queries-and-relationships.md](references/06-lucid-queries-and-relationships.md).
- Auth: [07-authentication.md](references/07-authentication.md); security/Bouncer: [08-authorization-and-security.md](references/08-authorization-and-security.md).
- API JSON and transformers: [09-transformers-and-apis.md](references/09-transformers-and-apis.md).
- Japa: [10-japa-testing.md](references/10-japa-testing.md).
- Container DI/providers: [11-di-service-providers.md](references/11-di-service-providers.md).
- Env/config: [12-config-env-and-runtime.md](references/12-config-env-and-runtime.md).
- Ace/codegen/upgrades: [13-ace-codegen-and-upgrades.md](references/13-ace-codegen-and-upgrades.md).
- Exceptions, logging, retries, events: [14-errors-observability-and-jobs.md](references/14-errors-observability-and-jobs.md).
- Inertia, Tuyau, frontend: [15-frontend-inertia-and-tuyau.md](references/15-frontend-inertia-and-tuyau.md).

For deeper implementation checks, the original focused guides remain available: [HTTP examples](references/http-and-types.md), [data integrity](references/lucid-and-data.md), [security](references/security.md), and [testing/upgrade](references/testing-and-upgrades.md). All reference notes cite official AdonisJS **raw Markdown** pages. For offline access to the upstream source files, the optional downloader in `scripts/sync-official-docs.mjs` can fetch them on demand; never load an entire documentation corpus into context when one page will do.

## Stop and ask rather than guess when

- An operation could delete production data, overwrite user progress, reveal private data, or change authentication or access semantics.
- A v6→v7 migration needs irreversible schema/encryption changes and no safe rollback path has been established.
- A critical missing contract (API response, user ownership, data retention rule, or external integration) cannot be inferred from the repository.

For routine ambiguity, make a conservative assumption consistent with the codebase, identify it, and continue.
