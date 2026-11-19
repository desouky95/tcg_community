import { NextResponse } from "next/server";
import { sdk } from "#lib/clients/medusa";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const query = new URL(request.url).searchParams;
  try {
    const result = await sdk.client.fetch(
      `/store/missing-lists/${encodeURIComponent(productId)}/cards?${query.toString()}`,
      { method: "GET" },
    );
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Cards are temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
