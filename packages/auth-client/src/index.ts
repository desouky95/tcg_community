import type { ApiClient, ExtendedUser } from "@tcg/api-contracts";

export async function bootstrapSession(client: ApiClient): Promise<ExtendedUser | null> {
  try {
    return (await client.me()).data.data;
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

export function safeReturnTo(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
