import "server-only";
import { createApiClient, type QueryInput } from "@tcg/api-contracts";

const API_URL =
  process.env.PUBLIC_WEB_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1";
export function createServerApiClient(query?: QueryInput) {
  return createApiClient({
    baseURL: API_URL,
    getDefaultQuery: () => query,
    withCredentials: true,
  });
}
