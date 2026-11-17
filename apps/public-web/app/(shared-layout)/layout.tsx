import { PageAnimatePresence, PublicShell } from "@tcg/ui-web/next";
import { cookies } from "next/headers";
import { SharedPageTransition } from "./shared-page-transition";
import { createServerApiClient } from "../../src/lib/clients/adonis.server";
import { getPageTransition, getStrapiURL } from "#lib/cms/homepage.server";
import { CartButton } from "../../src/providers/CartProvider";
import { getShopNavigation } from "../../src/lib/catalog/shop-navigation.server";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  const authenticated = _cookies.has(process.env.AUTH_COOKIE_NAME as string);
  const applink = process.env.NEXT_PUBLIC_APP_URL;
  const config = await createServerApiClient().getConfig();

  const [page_transition, categories] = await Promise.all([
    getPageTransition(),
    getShopNavigation(),
  ]);

  const images = (page_transition?.packs ?? []).map((_) => getStrapiURL(_.url));

  return (
    <PublicShell
      authenticated={authenticated}
      applink={applink}
      isNext
      config={config.data}
      storeNavigation
      categories={categories}
      cartAction={<CartButton />}
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
