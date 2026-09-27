# TCG mock API

This app provides the identity REST contract before the real API or a full test environment is available.

The package declares Node `20.20.2` through pnpm's `devEngines.runtime`; pnpm downloads and uses that runtime for this app. Other workspace packages continue to use the root Node 24 requirement and the machine's global Node runtime.

## Restapify server

```sh
pnpm --filter @tcg/mock-api dev
```

The API is served at `http://localhost:6768/api/v1`. The Restapify dashboard is available at `http://localhost:6768/restapify` when started without `--no-open`.

The legacy `apps/mock-server` routes are also available at `http://localhost:4000/api/*`:

```sh
pnpm --filter @tcg/mock-api dev:legacy
```

This includes the old unversioned auth, categories, checklists, admin users, profiles, and reviews paths. The legacy responses remain flat for compatibility; new clients should use `/api/v1/*`.

List the detected routes with:

```sh
pnpm --filter @tcg/mock-api list
```

Fixtures use Restapify's file-based route conventions. State files such as `*.401.{INVALID_CREDENTIALS}.json` can be selected from the dashboard.

## MSW handlers

The same happy-path identity contract is available through MSW v2's Node entrypoint:

```ts
import { server } from './src/mocks/node.js'

server.listen({ onUnhandledRequest: 'error' })
// run the consumer or test here
server.close()
```

Handlers use absolute wildcard URLs (`*/api/v1/...`) so they match both the Restapify port and application test ports.
