# Storefront legal integration

The single source of truth is `docs/legal/policies/{en,ar}/*.md`. The storefront reads those files on the server. `apps/public-web/src/lib/legal/publication.ts` maps routes to files and has an empty explicit approval registry. To publish a document, both localized copies must receive business and Egyptian counsel approval, and the registry must receive its version, effective date and last-updated date. The renderer rejects a version mismatch, draft banner or unresolved `TODO(confirm)`.

The page provides a responsive reading column, semantic headings, table of contents, keyboard links, English/Arabic content, RTL direction, localized title metadata and no-index preview. `react-markdown` skips raw HTML. Footer, registration, checkout review and order confirmation show links only for published documents. Sitemap and canonical language variants likewise include published versions only.

No terms checkbox or browser acceptance record is shown. Registration and Medusa order completion lack server-side version-aware acceptance; see `backend-requirements.md`. Privacy links are notices, not mandatory consent. Marketing consent is not bundled. The storefront uses session, cart and locale cookies and region local storage; no non-essential analytics tag was verified, so a fake cookie preference toggle was omitted. Reassess before enabling tracking.

No contact or newsletter form was found in this storefront. Account deletion/settings and Collector Disk need feature-specific notice and backend review before approved policies activate. Swapping is currently a coming-soon page.

Before publication: resolve policy placeholders, verify operational facts, approve both languages, archive the approved versions, add the exact version and dates to the registry, implement backend acceptance, then verify the production-like flows. This change neither approves documents nor deploys them.
