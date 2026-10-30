import { NextRequest, NextResponse } from 'next/server'

/** Server-only proxy: browser code never receives the Medusa service credential. */
export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return NextResponse.json({ data: { linked: false, available: false } }, { status: 503 })
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/auth/commerce/customer`, { method: 'POST', headers: { cookie: request.headers.get('cookie') ?? '' }, cache: 'no-store' })
  return new NextResponse(await response.text(), { status: response.status, headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' } })
}
