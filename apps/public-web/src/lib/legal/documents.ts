import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { approvedLegalVersions, legalFiles, type LegalLocale, type LegalSlug } from "./publication";
export { publishedLegalSlugs } from "./publication";
export type { LegalLocale } from "./publication";

export function legalSlug(value: string): value is LegalSlug {
  return Object.hasOwn(legalFiles, value);
}

export async function legalDocument(slug: LegalSlug, locale: LegalLocale, preview = false) {
  const approved = approvedLegalVersions[slug];
  const allowPreview = preview && process.env.NODE_ENV === "development";
  if (!approved && !allowPreview) return null;
  const file = path.join(process.cwd(), "../../docs/legal/policies", locale, `${legalFiles[slug]}.md`);
  const markdown = await readFile(file, "utf8");
  const title = markdown.match(/^# (.+)$/m)?.[1];
  const version = markdown.match(/(?:Version|الإصدار)\s+([\d.]+)/)?.[1];
  if (!title || !version) throw new Error(`Invalid legal document: ${slug}/${locale}`);
  const publishable = !!approved && !!process.env.NEXT_PUBLIC_STOREFRONT_URL && version === approved.version && !/TODO\(confirm\)|غير معتمدة للنشر|not approved for publication/i.test(markdown);
  if (!allowPreview && !publishable) return null;
  const sections = [...markdown.matchAll(/^## (.+)$/gm)].map((match, index) => ({
    id: `section-${index + 1}`,
    title: match[1],
  }));
  return { title, version, effectiveDate: approved?.effectiveDate, lastUpdated: approved?.lastUpdated, markdown: markdown.replace(/^# .+\r?\n/, ""), sections, locale, draft: !publishable };
}
