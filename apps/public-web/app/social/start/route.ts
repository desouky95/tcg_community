import { NextRequest, NextResponse } from "next/server";
import { socialAuth } from "../../../src/lib/better-auth";
import {
  authDestination,
  authQuery,
  destinationPath,
} from "../../../src/lib/auth-destination";

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");
  const attempt = request.nextUrl.searchParams.get("attempt");
  if (
    (provider !== "google" && provider !== "facebook") ||
    !attempt ||
    !/^[a-f0-9]{64}$/.test(attempt)
  )
    return NextResponse.redirect(
      new URL("/login?social_error=failed", request.url),
    );
  const destination = authDestination(
    request.nextUrl.searchParams.get("destination"),
  );
  const returnTo = destinationPath(
    destination,
    request.nextUrl.searchParams.get("returnTo"),
  );
  const errorURL = new URL(
    `/login?${authQuery(destination, returnTo)}&social_error=failed`,
    request.url,
  );
  try {
    if (!process.env.BETTER_AUTH_URL)
      throw new Error("Social authentication URL is not configured");
    const callback = new URL("/social/bridge", process.env.BETTER_AUTH_URL);
    callback.searchParams.set("attempt", attempt);
    callback.searchParams.set("provider", provider);
    callback.searchParams.set("destination", destination);
    callback.searchParams.set("returnTo", returnTo);
    const result = await socialAuth.api.signInSocial({
      body: {
        provider,
        callbackURL: callback.toString(),
        errorCallbackURL: errorURL.toString(),
      },
      headers: request.headers,
      asResponse: true,
    });
    const body = (await result.json()) as { url?: string };
    if (!result.ok || !body.url) throw new Error("Social sign-in unavailable");
    const response = NextResponse.redirect(body.url);
    for (const cookie of result.headers.getSetCookie())
      response.headers.append("set-cookie", cookie);
    response.headers.set("cache-control", "no-store");
    response.headers.set("referrer-policy", "no-referrer");
    return response;
  } catch {
    return NextResponse.redirect(errorURL);
  }
}
