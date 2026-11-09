import {
  createCipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "node:crypto";
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
  const secret = process.env.SOCIAL_AUTH_BRIDGE_SECRET;
  const destination = authDestination(
    request.nextUrl.searchParams.get("destination"),
  );
  const returnTo = destinationPath(
    destination,
    request.nextUrl.searchParams.get("returnTo"),
  );
  const failure = () =>
    NextResponse.redirect(
      new URL(
        `/login?${authQuery(destination, returnTo)}&social_error=failed`,
        request.url,
      ),
    );
  if (
    (provider !== "google" && provider !== "facebook") ||
    !attempt ||
    !/^[a-f0-9]{64}$/.test(attempt) ||
    !secret ||
    secret.length < 32
  )
    return failure();
  try {
    const session = await socialAuth.api.getSession({
      headers: request.headers,
    });
    if (!session) throw new Error("Missing social session");
    const info = await socialAuth.api.accountInfo({
      query: { useAccountCookie: true },
      headers: request.headers,
    });
    if (info.account.providerId !== provider || !info.account.accountId)
      throw new Error("Social identity mismatch");
    const iv = randomBytes(12);
    const key = createHash("sha256")
      .update(`social-assertion-encryption:${secret}`)
      .digest();
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(
        JSON.stringify({
          nonce: attempt,
          provider,
          subject: info.account.accountId,
          email: info.user.email ?? null,
          exp: Date.now() + 60_000,
        }),
        "utf8",
      ),
      cipher.final(),
    ]);
    const payload = [
      iv.toString("base64url"),
      encrypted.toString("base64url"),
      cipher.getAuthTag().toString("base64url"),
    ].join(".");
    const signature = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
    const url = new URL(`/api/v1/auth/oauth/${provider}/finish`, apiOrigin);
    url.searchParams.set("assertion", `${payload}.${signature}`);
    const signout = await socialAuth.api.signOut({
      headers: request.headers,
      asResponse: true,
    });
    if (!signout.ok) throw new Error("Could not clear social session");
    const response = NextResponse.redirect(url);
    for (const cookie of signout.headers.getSetCookie())
      response.headers.append("set-cookie", cookie);
    response.headers.set("cache-control", "no-store");
    response.headers.set("referrer-policy", "no-referrer");
    return response;
  } catch {
    const response = failure();
    try {
      const signout = await socialAuth.api.signOut({
        headers: request.headers,
        asResponse: true,
      });
      for (const cookie of signout.headers.getSetCookie())
        response.headers.append("set-cookie", cookie);
    } catch {
      // The temporary Better Auth session expires independently if cleanup fails.
    }
    response.headers.set("cache-control", "no-store");
    response.headers.set("referrer-policy", "no-referrer");
    return response;
  }
}
