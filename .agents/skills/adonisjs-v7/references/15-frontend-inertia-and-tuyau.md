# Frontend integrations: Inertia and type-safe clients

Read when a v7 project combines a backend with React/Vue, Inertia, or typed API consumers.

**Official Markdown:** [Inertia](https://docs.adonisjs.com/guides/frontend/inertia.md) · [Type-safe API client](https://docs.adonisjs.com/guides/frontend/api-client.md) · [Transformers](https://docs.adonisjs.com/guides/frontend/transformers.md) · [Vite](https://docs.adonisjs.com/guides/frontend/vite.md)

## Architecture

- Determine whether the app is API-only, Hypermedia/Edge, Inertia or API monorepo. These stacks have different request and frontend patterns.
- Keep server-only models/services out of frontend code. Use generated types, serializers, and HTTP boundaries.
- Transformers define the shape of data a frontend receives; migrations and schema classes do not define a public API.
- Inertia actions should validate and authorize on the server, even if the UI prevents invalid input.
- Where Tuyau is installed, prefer the generated type-safe API client rather than manually duplicating request/response type definitions.
- Respect Vite asset tooling and existing import aliases.

## Review checks

Response shape matches generated client types; route and page names resolve; nullable data and validation errors are handled; deployment build includes generated types and assets.
