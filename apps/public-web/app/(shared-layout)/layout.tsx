import { PageAnimatePresence, PublicShell } from "@tcg/ui-web/next";
import { cookies } from "next/headers";
import { SharedPageTransition } from "./shared-page-transition";
import { api } from "../../src/lib/api";
import { getPageTransition, getStrapiURL } from "#lib/homepage.server";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  const authenticated = _cookies.has(process.env.AUTH_COOKIE_NAME as string);
  const applink = process.env.NEXT_PUBLIC_APP_URL;
  const config = await api.getConfig();

  const page_transition = await getPageTransition();
  console.log({ page_transition });

  const images = (page_transition.packs ?? []).map((_) => getStrapiURL(_.url));

  return (
    <PublicShell
      authenticated={authenticated}
      applink={applink}
      isNext
      config={config.data}
      storeNavigation
      // mainClassName="flex-1"
      // className="flex flex-col items-baseline"
      links={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "/collector-disk", label: "Collector Disk" },
      ]}
    >
      <SharedPageTransition images={images}>{children}</SharedPageTransition>
    </PublicShell>
  );
}
