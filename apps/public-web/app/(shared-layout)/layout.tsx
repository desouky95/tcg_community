import { PageAnimatePresence, PublicShell } from "@tcg/ui-web/next";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await cookies();
  const applink = process.env.NEXT_PUBLIC_APP_URL;
  return (
    <PublicShell
      authenticated={!!authenticated.get("adonis-session")}
      applink={applink}
      isNext
    >
      {children}
    </PublicShell>
  );
}
