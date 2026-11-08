# Routing and controllers — AdonisJS v7

Use for endpoint creation, resource routes, route naming, controller refactors and URL generation.

**Official Markdown:** [Routing](https://docs.adonisjs.com/guides/basics/routing.md) · [Controllers](https://docs.adonisjs.com/guides/basics/controllers.md) · [URL builder](https://docs.adonisjs.com/guides/basics/url-builder.md)

## Implementation outline

1. Keep routing in `start/routes.ts` and business rules outside of it.
2. Group endpoints with common prefixes/middleware when that improves clarity.
3. Place specific/static routes before potentially overlapping dynamic patterns.
4. Prefer named routes, then use the v7 URL builder for links rather than scattering hard-coded paths.
5. Inspect `#generated/controllers` support; do not hand-edit its source in `.adonisjs/`.

```ts
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/articles', [controllers.Articles, 'index'])
router.post('/articles', [controllers.Articles, 'store'])
router.get('/articles/:id', [controllers.Articles, 'show'])
```

The generated controller barrel is optional/configurable. Where disabled, use existing lazy controller imports rather than inventing another alias.

## Resource routing and conventions

- `router.resource('articles', controllers.Articles)` expands conventional CRUD endpoints; check which actions you actually want exposed.
- Controller-backed routes may receive automatically generated route names. Check `node ace list:routes` before adding explicit aliases.
- Validate and authorize dynamic IDs before reading or mutating related data; a valid ID format does not prove ownership.
- Controllers should coordinate validation, auth, service/model calls and serialization; avoid large methods that mix HTTP, SQL and third-party integrations.
- Set HTTP statuses and response envelopes to match existing contracts and tests.

## Debugging route errors

Inspect the controller export, route registration order, middleware chain, import alias, generated barrel, and `list:routes` output. Confirm the handler and method actually exist.
