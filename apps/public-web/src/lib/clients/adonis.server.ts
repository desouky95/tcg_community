import "server-only";
import {
  createApiClient,
  type APIResponse,
  type QueryInput,
  type User,
} from "@tcg/api-contracts";

export const API_URL =
  process.env.PUBLIC_WEB_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3333/api/v1";
export function createServerApiClient(query?: QueryInput) {
  return createApiClient({
    baseURL: API_URL,
    getDefaultQuery: () => query,
    withCredentials: true,
  });
}

export async function getStorefrontUserId(cookie: string) {
  const response = await createServerApiClient().http.get<
    APIResponse<Pick<User, "id">>
  >("/auth/me", {
    headers: { cookie },
    maxRedirects: 0,
    validateStatus: (status) => status === 200 || status === 401,
  });
  if (response.status === 401) return null;
  const id = response.data?.data?.id;
  if (!Number.isSafeInteger(id))
    throw new Error("Invalid storefront session response");
  return id;
}
