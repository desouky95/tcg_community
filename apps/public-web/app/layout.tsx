import {
  initServerI18next,
  getT,
  getResources,
  generateI18nStaticParams,
} from "next-i18next/server";
import { I18nProvider } from "next-i18next/client";
import i18nConfig from "../i18n.config";
import Providers from "./providers";
import { Metadata } from "next";
import { Suspense } from "react";
import { PageAnimatePresence } from "@tcg/ui-web/next";
import "./globals.css";
import { sdk } from "#lib/clients/medusa";
import { RegionProvider } from "../src/providers/RegionProvider";
initServerI18next(i18nConfig);

export const metadata: Metadata = {
  title: "Next Pull | Collect, trade, belong",
  description:
    "An Egypt-first home for collectors, checklists, and thoughtful trades.",
};
export async function generateStaticParams() {
  return generateI18nStaticParams();
}

async function I18nBoundary({ children }: { children: React.ReactNode }) {
  const { i18n } = await getT();
  const lng = i18n.resolvedLanguage || i18n.language || "en";
  const resources = getResources(i18n);

  if (process.env.NODE_ENV === "development") {
    await i18n.reloadResources();
  }

  return (
    <I18nProvider language={lng} resources={resources}>
      <Providers>{children}</Providers>
    </I18nProvider>
  );
}

async function RegionsServerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { regions } = await sdk.store.region.list();

  console.log({regions})
  return <RegionProvider regions={regions}>{children}</RegionProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var m=document.cookie.match(/(?:^|; )i18next=([^;]*)/);if(m){var l=decodeURIComponent(m[1]);if(l==="en"||l==="ar")document.documentElement.lang=l}}catch(e){}})()',
          }}
        />
      </head>
      <body>
        <Suspense
          fallback={
            <main
              className="min-h-screen bg-paper-50 px-gutter py-section"
              aria-busy="true"
            >
              <p className="mx-auto max-w-360">Loading Next Pull…</p>
            </main>
          }
        >
          <I18nBoundary>
            <RegionsServerProvider>{children}</RegionsServerProvider>
          </I18nBoundary>
        </Suspense>
      </body>
    </html>
  );
}
