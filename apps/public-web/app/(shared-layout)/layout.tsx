import { PublicShell } from "@tcg/ui-web/next";
import { cookies, headers } from "next/headers";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { SharedPageTransition } from "./shared-page-transition";
import { createServerApiClient } from "../../src/lib/clients/adonis.server";
import { getPageTransition, getStrapiURL } from "#lib/cms/homepage.server";
import { CartButton } from "../../src/providers/CartProvider";
import { getShopNavigation } from "../../src/lib/catalog/shop-navigation.server";

async function getPublicConfig() {
  "use cache";
  cacheLife("hours");
  return (await createServerApiClient().getConfig()).data;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collector-disk", label: "Collector Disk" },
];

type ShellProps = {
  authenticated: boolean;
  applink?: string;
  config: Awaited<ReturnType<typeof getPublicConfig>>;
  categories: Awaited<ReturnType<typeof getShopNavigation>>;
  images: string[];
  children: React.ReactNode;
};

function SharedShell({
  authenticated,
  applink,
  config,
  categories,
  images,
  children,
}: ShellProps) {
  return (
    <PublicShell
      authenticated={authenticated}
      applink={applink}
      isNext
      config={config}
      storeNavigation
      categories={categories}
      cartAction={<CartButton />}
      links={links}
    >
      <SharedPageTransition images={images}>{children}</SharedPageTransition>
    </PublicShell>
  );
}

async function AuthenticatedShell(props: Omit<ShellProps, "authenticated">) {
  const cookieStore = await cookies();
  let authenticated = false;

  try {
    await createServerApiClient().http.get("/auth/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    authenticated = true;
  } catch {
    // A missing, expired, or invalid session renders the public header.
  }

  return <SharedShell {...props} authenticated={authenticated} />;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const applink = process.env.NEXT_PUBLIC_APP_URL;
  const [config, page_transition, categories] = await Promise.all([
    getPublicConfig(),
    getPageTransition(),
    getShopNavigation(),
  ]);

  const images = (page_transition?.packs ?? []).map((_) => getStrapiURL(_.url));

  return (
    <Suspense
      fallback={
        <SharedShell
          applink={applink}
          authenticated={false}
          config={config}
          categories={categories}
          images={images}
        >
          <section
            className="mx-auto max-w-360 px-gutter py-section"
            aria-busy="true"
          >
            <p>Loading page…</p>
          </section>
        </SharedShell>
      }
    >
      <AuthenticatedShell
        applink={applink}
        config={config}
        categories={categories}
        images={images}
      >
        {children}
      </AuthenticatedShell>
    </Suspense>
  );
}
