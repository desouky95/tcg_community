import { NextRequest, NextResponse } from "next/server";

/** Server-only proxy: browser code never receives the Medusa service credential. */
export async function POST(request: NextRequest) {
  const authCookie = process.env.PUBLIC_WEB_AUTH_COOKIE_NAME;
  if (!authCookie || !request.cookies.has(authCookie))
    return NextResponse.json({ data: { authenticated: false } });

  const apiUrl = process.env.PUBLIC_WEB_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl)
    return NextResponse.json(
      { data: { linked: false, available: false } },
      { status: 503 },
    );
  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/auth/commerce/customer`,
    {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        cart_id: request.cookies.get("next_pull_cart")?.value,
      }),
      cache: "no-store",
    },
  );
  if (response.status === 401)
    return NextResponse.json(
      {
        error: "Your session expired. Sign in again before placing the order.",
      },
      { status: 503 },
    );
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
