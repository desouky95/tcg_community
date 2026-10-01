import {
  initServerI18next,
  getT,
  getResources,
  generateI18nStaticParams,
} from "next-i18next/server";
import { I18nProvider } from "next-i18next/client";
import i18nConfig from "../../i18n.config";
import Providers from "../providers";
import { Metadata } from "next";

initServerI18next(i18nConfig);

export const metadata: Metadata = {
  title: "TCG Nexus | Collect, trade, belong",
  description:
    "An Egypt-first home for collectors, checklists, and thoughtful trades.",
};
export async function generateStaticParams() {
  return generateI18nStaticParams()
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { i18n } = await getT();
  const resources = getResources(i18n);

    if (process.env.NODE_ENV === 'development') {
    await i18n.reloadResources();
  }

  return (
    <html lang={lng}>
      <body>
        <I18nProvider language={lng} resources={resources}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
