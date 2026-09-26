# TCG Community monorepo

## Structure

```text
apps/
  api/          AdonisJS API
  mock-server/  Local development fixture server
  web/          React and Vite web application
packages/
  api-contracts/ Framework-neutral DTOs and HTTP client
  react-query/   Shared React Query provider, keys, and hooks
docs/            Product, design-system, PRD, and visual reference documentation
```

The web and future React Native app should import API types and the configured HTTP client from `@tcg/api-contracts`, and data hooks from `@tcg/react-query`. Platform-specific session storage, notifications, and development fallbacks are injected through `TcgApiProvider`.

## Commands

```bash
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm build
pnpm typecheck
pnpm test
```

Workspace packages are private and source-consumed so Vite development reflects shared changes immediately. The dependency direction is `apps -> react-query -> api-contracts`; shared packages never import application code.

Use Node 24 as declared by `.nvmrc`; the current AdonisJS TypeScript execution stack requires it.
