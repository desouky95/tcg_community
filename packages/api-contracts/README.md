# @tcg/api-contracts

Framework-neutral TypeScript DTOs and the HTTP client for TCG Community. Web and future React Native clients configure their own base URL and access-token provider.

```ts
import { createApiClient } from "@tcg/api-contracts";

const api = createApiClient({
  baseURL: "https://api.example.com/api/v1",
  getAccessToken: () => secureSession.getToken(),
});
```

This package must not import React, React Query, browser storage, Zustand, or application UI code.

## Default and per-request query strings

Applications may provide the current page query once when creating the client. The getter is
evaluated for every read request, so client-side navigation always uses the latest URL.

```ts
const api = createApiClient({
  baseURL: "https://api.example.com/api/v1",
  getDefaultQuery: () =>
    typeof window === "undefined"
      ? undefined
      : new URLSearchParams(window.location.search),
})
```

Per-request values override inherited values. Use `null` to remove one inherited key or
`queryMode: "replace"` to ignore all inherited values.

```ts
await api.getCategories({ query: { limit: 50, q: null } })
await api.getCategories({
  queryMode: "replace",
  query: { cursor: "next-page" },
})
```

Default page queries are inherited by GET requests only. Mutations may still send an explicit
query through their trailing request-options argument. Next.js server code should create one
client per request and close over that request's `searchParams`; it must not store request query
data in a shared singleton.
