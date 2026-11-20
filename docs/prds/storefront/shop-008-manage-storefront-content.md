# SHOP-008: Manage storefront content


## Outcome and scope

An authorized editor publishes storefront content.

## Requirements

- Referenced application configuration reads root `.env` names directly: `BACKEND_*`, `CMS_*`, `PUBLIC_WEB_* / NEXT_PUBLIC_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Native Medusa product types `Coming Soon` and `Pre-order` are created idempotently by `seed-product-availability-types.ts` during `medusa db:migrate`; the same file can be run with `medusa exec ./src/migration-scripts/seed-product-availability-types.ts`. Assign these exact type values in Medusa Admin product organization. Product publication remains separate: publish and assign the sales channel to make a product visible. Pre-order variants require available stock or enabled backorders. CMS missing-list metadata and media remain independent of these availability types.

- Medusa search and workflow integrations retain typed query and logger dependencies during production builds.

- Strapi owns editorial content and publication; Next.js displays published content only.
- If optional page-transition content is unavailable, the shared storefront layout still renders without transition images.
- Editors arrange hero and selected-product sections in the homepage dynamic zone. Product details and prices remain owned by Medusa.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

- Editors can add a latest-products section and choose its Medusa collection using authenticated collection search. Products are ordered newest first and limited by the editor.

- Medusa product and variant changes synchronize to Strapi by Medusa ID with unique product handles and retryable failures. Prices, inventory, and storefront product type remain owned by Medusa.
- Storefront classification reads Medusa product metadata (`type: "missing_list"`); editors add pack thumbnails and sticker images to the corresponding CMS records.

- Authorized Medusa administrators can sync an individual product and its variants to Strapi from the product details page.

## Acceptance and verification

- Manually run the availability-type seed twice and verify each type exists once, assign each to a published product, and confirm storefront labels and purchasing behavior. Confirm existing product types and assignments are preserved.

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- Medusa Admin product details — native product type selection under organization.
- `apps/public-web/app/(shared-layout)/page.tsx` — renders the published homepage.
- `apps/public-web/app/(shared-layout)/layout.tsx` — uses optional page-transition content.
- Strapi Content Manager — synced Product records and their thumbnail/sticker media.

## Backend API Route Used
- Native Medusa Admin product type and product update APIs — maintain and assign availability types.
- `GET /api/homepage` — retrieves published homepage sections.
- `POST /admin/products/:id/sync-cms` — synchronizes one product to Strapi.
- Medusa product lifecycle events — synchronize product type and catalog fields.
- Strapi Content API: `GET /api/products` — provides product media to storefront cards.
- Medusa Store API: `GET /store/products` — provides product metadata for card classification.

## Related Files
- apps/public-web/src/components/homepage-product-section.tsx
- apps/backend/src/migration-scripts/seed-product-availability-types.ts
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx
- apps/public-web/src/lib/cms/homepage.server.ts
- apps/public-web/src/lib/catalog/homepage-product-queries.ts
- apps/public-web/src/lib/catalog/homepage-product-data.ts
- apps/public-web/src/lib/clients/strapi.server.ts
- apps/public-web/src/lib/clients/medusa.ts
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
- apps/cms/types/generated/contentTypes.d.ts
- packages/strapi-client/src/generated/types.ts
- apps/cms/src/api/product-variant/content-types/product-variant/schema.json

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
