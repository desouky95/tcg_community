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
initServerI18next(i18nConfig);

export const metadata: Metadata = {
  title: "Next Pull | Collect, trade, belong",
  description:
    "An Egypt-first home for collectors, checklists, and thoughtful trades.",
};
export async function generateStaticParams() {
  return generateI18nStaticParams();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = await getT();
  const lng = i18n.resolvedLanguage || i18n.language || "en";
  const resources = getResources(i18n);

  if (process.env.NODE_ENV === "development") {
    await i18n.reloadResources();
  }

  return (
    <html lang={lng}>
      <body>
        <I18nProvider language={lng} resources={resources}>
          <Suspense fallback={null}>
            <Providers>
              {children}
            </Providers>
          </Suspense>
        </I18nProvider>
</body>
    </html>
  );
}
