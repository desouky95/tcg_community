import { safeReturnTo } from "@tcg/auth-client";

export type AuthDestination = "public" | "collector";
export function authDestination(
  value: string | null | undefined,
): AuthDestination {
  return value === "collector" ? "collector" : "public";
}
export function destinationPath(
  destination: AuthDestination,
  value: string | null | undefined,
) {
  return safeReturnTo(value, destination === "collector" ? "/dashboard" : "/");
}
export function authQuery(destination: AuthDestination, returnTo: string) {
  return new URLSearchParams({
    destination,
    returnTo: destinationPath(destination, returnTo),
  }).toString();
}
export function destinationUrl(destination: AuthDestination, returnTo: string) {
  const path = destinationPath(destination, returnTo);
  return destination === "collector"
    ? new URL(path, process.env.NEXT_PUBLIC_APP_URL!).toString()
    : path;
}
