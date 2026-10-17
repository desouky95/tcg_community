export * from "./redirects";
import type { ApiClient, ApiRequestOptions } from "@tcg/api-contracts";

export async function bootstrapSession(
  client: ApiClient,
  requestOptions?: ApiRequestOptions,
) {
  try {
    return await client.me(requestOptions);
  } catch (error) {
    if (isUnauthorized(error)) return null;
    throw error;
  }
}

export async function logoutSession(client: ApiClient) {
  await client.logout();
}

export function isUnauthorized(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 401,
  );
}
