import { PageAnimatePresence, PublicShell } from "@tcg/ui-web/next";
import { cookies } from "next/headers";
import { SharedPageTransition } from "./shared-page-transition";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  const authenticated =_cookies.has(process.env.AUTH_COOKIE_NAME as string)
  console.log({authenticated})
  const applink = process.env.NEXT_PUBLIC_APP_URL;
  console.log({authenticated})
  return (
    <PublicShell
      authenticated={authenticated}
      applink={applink}
      isNext
    >
      <SharedPageTransition>{children}</SharedPageTransition>
    </PublicShell>
  );
}
