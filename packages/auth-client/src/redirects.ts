export function safeReturnTo(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function buildAppUrl(appOrigin: string, returnTo?: string | null) {
  return new URL(safeReturnTo(returnTo), appOrigin).toString();
}

export function buildLoginUrl(publicWebOrigin: string, returnTo: string) {
  const url = new URL("/login", publicWebOrigin);
  url.searchParams.set("returnTo", safeReturnTo(returnTo));
  return url.toString();
}
