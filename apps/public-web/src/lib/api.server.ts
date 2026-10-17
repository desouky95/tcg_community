import { createApiClient, type QueryInput } from "@tcg/api-contracts";

export function createServerApiClient(query?: QueryInput) {
  return createApiClient({
    baseURL:
      process.env.API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:3333/api/v1",
    getDefaultQuery: () => query,
    withCredentials: true,
  });
}
