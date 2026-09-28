import { createApiClient } from "@tcg/api-contracts";

export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1",
  withCredentials: true,
});
