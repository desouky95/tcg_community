# SYS-014: View product landing page


## Outcome and scope

A guest understands the product and can reach storefront, Collector Disk, sign-in, or signup.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

- Render the published Strapi homepage sections in editor-defined order. Support responsive hero banners and an editor-selected Medusa product grid. The product section uses a navy field with paper product cards.
- Show a setup state when no homepage is published, and preserve other sections when product data is unavailable.

- Editors can add a latest-products section and choose its Medusa collection using authenticated collection search. Products are ordered newest first and limited by the editor.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/Landing.tsx. This pointer is not a fresh implementation audit.

## UI Page Used
- `apps/public-web/app/(shared-layout)/page.tsx` — homepage with a responsive featured banner slider.

## Backend API Route Used
- `GET /api/homepage` — published Strapi homepage and populated sections.
- Medusa Store API product listing — selected product data.

## Related Files
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/app/exceptions/handler.ts
- apps/web/src/main.tsx
- packages/ui-web/src/components/patterns/hero-slider/index.tsx
- apps/public-web/src/lib/homepage.server.ts
- apps/public-web/src/lib/homepage-product-queries.ts
- apps/public-web/src/lib/homepage-product-data.ts
- apps/public-web/tests/homepage-product-queries.test.mjs
- apps/cms/tests/medusa-collections.test.cjs
- apps/cms/src/api/homepage/content-types/homepage/schema.json
- apps/cms/src/components/homepage/product-section.json
- apps/cms/src/components/homepage/latest-products.json
- apps/cms/src/plugins/medusa-collections/strapi-server.js
- apps/cms/src/admin/components/MedusaCollectionInput.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
