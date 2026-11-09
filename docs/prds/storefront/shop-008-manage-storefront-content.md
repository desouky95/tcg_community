# SHOP-008: Manage storefront content


## Outcome and scope

An authorized editor publishes storefront content.

## Requirements

- Strapi owns editorial content and publication; Next.js displays published content only.
- Editors arrange hero and selected-product sections in the homepage dynamic zone. Product details and prices remain owned by Medusa.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

- Editors can add a latest-products section and choose its Medusa collection using authenticated collection search. Products are ordered newest first and limited by the editor.

- Medusa product and variant changes synchronize to Strapi by Medusa ID with unique product handles and retryable failures. Prices and inventory remain in Medusa.

- Authorized Medusa administrators can sync an individual product and its variants to Strapi from the product details page.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- `apps/public-web/app/(shared-layout)/page.tsx` — renders the published homepage.

## Backend API Route Used
- `GET /api/homepage` — retrieves published homepage sections.
- `POST /admin/products/:id/sync-cms` — synchronizes one product to Strapi.

## Related Files
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx
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

- apps/backend/src/subscribers/sync-strapi-product.ts
- apps/backend/src/integrations/strapi/product-sync.ts
- apps/backend/src/admin/widgets/product-cms-sync.tsx
- apps/backend/src/api/admin/products/[id]/sync-cms/route.ts
- apps/backend/src/workflows/sync-product-cms.ts
- apps/cms/src/api/product/content-types/product/schema.json
- apps/cms/src/api/product-variant/content-types/product-variant/schema.json

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
