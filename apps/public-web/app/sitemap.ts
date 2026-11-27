import type { MetadataRoute } from "next";
import { legalDocument, publishedLegalSlugs } from "../src/lib/legal/documents";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_STOREFRONT_URL;
  if (!origin) return [];
  const entries = await Promise.all(publishedLegalSlugs().map(async (slug) => {
    const [en, ar] = await Promise.all([legalDocument(slug, "en"), legalDocument(slug, "ar")]);
    return en && ar ? ["en", "ar"].map((locale) => ({ url: new URL(`/${slug}?lang=${locale}`, origin).toString() })) : [];
  }));
  return entries.flat();
}
