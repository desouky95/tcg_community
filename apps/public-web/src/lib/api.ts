import { createApiClient } from "@tcg/api-contracts";

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1",
  // getDefaultQuery: getDefaultApiQuery,
  withCredentials: true,
  
});
