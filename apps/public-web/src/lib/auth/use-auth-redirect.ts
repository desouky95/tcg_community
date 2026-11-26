"use client";

import { useRouter } from "next/navigation";
import { destinationUrl, type AuthDestination } from "./auth-destination";

export function useAuthRedirect() {
  const router = useRouter();

  return (destination: AuthDestination, returnTo: string) => {
    const href = destinationUrl(destination, returnTo);
    if (destination === "collector") {
      window.location.assign(href);
      return;
    }

    router.push(href);
    // The API sets the session cookie outside Next's router cache.
    router.refresh();
  };
}
