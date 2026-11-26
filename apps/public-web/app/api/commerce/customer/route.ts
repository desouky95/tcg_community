import { NextRequest, NextResponse } from "next/server";
import {
  API_URL,
  getStorefrontUserId,
} from "../../../../src/lib/clients/adonis.server";
import { retrieveCartWithCustomer } from "../../../../src/lib/commerce/cart-customer.server";

/** Server-only proxy: browser code never receives the Medusa service credential. */
export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie") ?? "";
  const cartId = request.cookies.get("next_pull_cart")?.value;
  let response: Response;
  try {
    if ((await getStorefrontUserId(cookie)) === null) {
      if (cartId) {
        const { customer } = await retrieveCartWithCustomer(
          cartId,
          "id,*customer",
        );
        if (customer && customer.has_account !== false)
          return NextResponse.json(
            { error: "Sign back in to continue checkout with this cart." },
            { status: 409 },
          );
      }
      return NextResponse.json({ data: { authenticated: false } });
    }

    response = await fetch(`${API_URL.replace(/\/$/, "")}/auth/commerce/customer`, {
      method: "POST",
      headers: {
        cookie,
        "content-type": "application/json",
        "x-xsrf-token": request.headers.get("x-xsrf-token") ?? "",
      },
      body: JSON.stringify({ cart_id: cartId }),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { data: { linked: false, available: false } },
      { status: 503 },
    );
  }
  if (response.status >= 300 && response.status < 400)
    return NextResponse.json(
      { data: { linked: false, available: false } },
      { status: 502 },
    );
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
