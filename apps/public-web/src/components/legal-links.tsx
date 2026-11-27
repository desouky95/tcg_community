import Link from "next/link";
import { publishedLegalSlugs, type LegalSlug } from "../lib/legal/publication";

const labels: Record<LegalSlug, string> = {
  "privacy-policy": "Privacy policy",
  "terms-and-conditions": "Terms and conditions",
  "cookie-policy": "Cookie policy",
  "refund-and-return-policy": "Refund and return policy",
  "shipping-and-delivery-policy": "Shipping and delivery policy",
  "pre-order-policy": "Pre-order policy",
  "account-deletion-policy": "Account deletion policy",
  "acceptable-use-policy": "Acceptable use policy",
  "community-guidelines": "Community guidelines",
};

export function LegalLinks({
  slugs,
  className,
}: {
  slugs?: LegalSlug[];
  className?: string;
}) {
  const published = publishedLegalSlugs();
  const selected = slugs
    ? slugs.filter((slug) => published.includes(slug))
    : published;
  if (!selected.length) return null;
  return (
    <nav aria-label="Legal documents" className={className}>
      {selected.map((slug) => (
        <Link
          key={slug}
          href={`/${slug}`}
          className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {labels[slug]}
        </Link>
      ))}
    </nav>
  );
}
