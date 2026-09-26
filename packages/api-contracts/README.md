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
