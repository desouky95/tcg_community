import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ReactMarkdown from "react-markdown";
import { legalDocument, legalSlug, type LegalLocale } from "../../../src/lib/legal/documents";

type Props = {
  params: Promise<{ legalSlug: string }>;
  searchParams: Promise<{ preview?: string; lang?: string }>;
};

async function requestedDocument({ params, searchParams }: Props) {
  const { legalSlug: slug } = await params;
  if (!legalSlug(slug)) return null;
  const query = await searchParams;
  const saved = (await cookies()).get("i18next")?.value;
  const locale: LegalLocale = query.lang === "ar" || query.lang === "en" ? query.lang : saved === "ar" ? "ar" : "en";
  return legalDocument(slug, locale, query.preview === "1");
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const document = await requestedDocument(props);
  if (!document) return { robots: { index: false, follow: false } };
  const slug = (await props.params).legalSlug;
  const origin = process.env.NEXT_PUBLIC_STOREFRONT_URL;
  const url = origin ? new URL(`/${slug}?lang=${document.locale}`, origin).toString() : undefined;
  return {
    title: `${document.title} | Next Pull`,
    robots: { index: !document.draft, follow: !document.draft },
    alternates: document.draft || !origin ? undefined : {
      canonical: url,
      languages: {
        en: new URL(`/${slug}?lang=en`, origin).toString(),
        ar: new URL(`/${slug}?lang=ar`, origin).toString(),
      },
    },
  };
}

export default async function LegalPage(props: Props) {
  const document = await requestedDocument(props);
  if (!document) notFound();
  return (
    <section aria-labelledby="legal-title" lang={document.locale} dir={document.locale === "ar" ? "rtl" : "ltr"} className="bg-paper-50 px-gutter py-12 text-primary-500 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-wax-line pb-8">
          <h1 id="legal-title" className="max-w-4xl font-display text-4xl font-bold leading-tight sm:text-6xl">{document.title}</h1>
          <p className="mt-5 text-sm">{document.locale === "ar" ? "الإصدار" : "Version"} {document.version}</p>
          {document.effectiveDate && <p className="mt-1 text-sm">{document.locale === "ar" ? "تاريخ النفاذ" : "Effective"}: {document.effectiveDate} · {document.locale === "ar" ? "آخر تحديث" : "Updated"}: {document.lastUpdated}</p>}
          {document.draft && <p role="status" className="mt-4 max-w-2xl rounded-md bg-wax-navy p-4 text-wax-paper">{document.locale === "ar" ? "معاينة تطوير فقط. هذه الوثيقة غير معتمدة للنشر." : "Development preview only. This document is not approved for publication."}</p>}
        </header>
        <div className="grid gap-10 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={document.locale === "ar" ? "أقسام الوثيقة" : "Document sections"} className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-4 font-semibold">{document.locale === "ar" ? "المحتويات" : "Contents"}</p>
            <ol className="space-y-3 text-sm">{document.sections.map((section) => <li key={section.id}><a className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2" href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          </nav>
          <article className="min-w-0 max-w-[75ch] space-y-4 leading-relaxed [&_a]:underline [&_h2]:scroll-mt-8 [&_h2]:pt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:pt-4 [&_h3]:font-semibold [&_li]:ms-5 [&_li]:list-disc [&_strong]:font-semibold">
            <ReactMarkdown skipHtml components={{ h2: ({ children, ...rest }) => {
              const index = document.sections.findIndex((section) => section.title === String(children));
              return <h2 id={index >= 0 ? document.sections[index].id : undefined} {...rest}>{children}</h2>;
            } }}>{document.markdown}</ReactMarkdown>
          </article>
        </div>
      </div>
    </section>
  );
}
