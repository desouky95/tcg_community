export const legalFiles = {
  "privacy-policy": "privacy-policy",
  "terms-and-conditions": "terms-and-conditions",
  "cookie-policy": "cookie-policy",
  "refund-and-return-policy": "refund-return-policy",
  "shipping-and-delivery-policy": "shipping-delivery-policy",
  "pre-order-policy": "pre-order-policy",
  "account-deletion-policy": "account-deletion-data-rights",
  "acceptable-use-policy": "acceptable-use-policy",
  "community-guidelines": "community-guidelines",
} as const;
export type LegalSlug = keyof typeof legalFiles;
export type LegalLocale = "en" | "ar";
export type ApprovedLegalVersion = { version: string; effectiveDate: string; lastUpdated: string };

// Add a version only after both language files receive business and counsel approval.
export const approvedLegalVersions: Partial<Record<LegalSlug, ApprovedLegalVersion>> = {};

export function publishedLegalSlugs(): LegalSlug[] {
  return (Object.keys(legalFiles) as LegalSlug[]).filter((slug) => !!approvedLegalVersions[slug]);
}
