import { createProxy } from "next-i18next/proxy";
import i18nConfig from "./i18n.config";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/marketplace" ||
    request.nextUrl.pathname.startsWith("/marketplace/")
  )
    return new NextResponse("Marketplace listings have been retired.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
    
  // return createProxy(i18nConfig);
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
    "/marketplace/:path*",
  ],
};
