# Project foundations — AdonisJS v7

Use this when starting a project, interpreting its structure, or diagnosing generated imports.

**Official Markdown:** [Installation](https://docs.adonisjs.com/installation.md) · [Folder structure](https://docs.adonisjs.com/folder-structure.md) · [Codegen](https://docs.adonisjs.com/guides/concepts/codegen.md) · [Configuration](https://docs.adonisjs.com/configuration.md)

## Repository inspection

1. Read `package.json` and its lockfile. Verify the actual `@adonisjs/core`, `@adonisjs/lucid`, `@adonisjs/auth`, and `@vinejs/vine` versions before choosing APIs.
2. Check `adonisrc.ts` for providers, preloads, commands, directories and generated barrel settings.
3. Read `start/routes.ts`, `start/kernel.ts`, `config/`, `database/migrations/`, `app/`, and `tests/` selectively. App layout changes with API, Hypermedia, and Inertia starter kits.
4. AdonisJS v7 targets Node.js 24 or later. Don't silently migrate an older application.
5. Inspect `.adonisjs` before editing imports. v7 uses generated server/client code for controller barrels, model schema and type information. Generated outputs are not the place for manual application logic; current docs recommend committing generated files.

## Typical directory roles

- `app/controllers` — transport-oriented request handlers.
- `app/validators` — input schemas.
- `app/models` — Lucid models.
- `app/transformers` — explicit outward serialization, when configured.
- `database/migrations` — versioned schema evolution; `database/schema.ts` is generated.
- `start/routes.ts` and `start/kernel.ts` — routes and middleware registration.
- `config/` — evaluated settings; `.env` — runtime variables and secrets (never commit actual values).
- `providers/` — optional application service bindings and extensions.

## Gotchas

- Avoid mixing examples from v6 docs into v7 without checking imports and behavior.
- Do not assume auth, queues, Bouncer, Inertia, or every first-party integration is installed.
- `#generated/*` symbols can be missing when generation hasn't run or when the corresponding feature is disabled.
- Consult official v7 Markdown before a version-sensitive change and verify installed package types if documentation differs.
