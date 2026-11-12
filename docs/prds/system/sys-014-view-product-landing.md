# SYS-014: View product landing page


## Outcome and scope

A guest understands the product and can reach storefront, Collector Disk, sign-in, or signup.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

- Render the published Strapi homepage sections in editor-defined order. Each collection section loads products from its selected Medusa collection using its configured limit and variant. Support responsive hero banners and an editor-selected Medusa product grid. The product section uses a navy field with paper product cards.
- Show a setup state when no homepage is published, and preserve other sections when product data is unavailable.
- The shared sticker-pack page transition uses responsive pack sizing across mobile, tablet and desktop without adding a background color, and honors reduced-motion preferences.
- The shared storefront layout loads API configuration using the server-side API address, while browser requests use the public API address.
- The shared storefront header exposes Shop categories in a desktop mega menu and mobile disclosure; category service failures leave Shop all accessible, and the desktop panel remains open while moving the pointer into it.

- Editors can add a latest-products section and choose its Medusa collection using authenticated collection search. Products are ordered newest first and limited by the editor.

- In the desktop Shop menu, hovering or focusing a category reveals its image from bottom to top while retaining the branded graphics; missing or broken images use the branded fallback, and reduced motion removes the directional reveal.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/Landing.tsx. This pointer is not a fresh implementation audit.

## UI Page Used
- `apps/public-web/app/(shared-layout)/page.tsx` — homepage with a responsive featured banner slider.

## Backend API Route Used
- `GET /api/homepage` — published Strapi homepage and populated sections.
- Medusa Store API product listing — selected product data.
- Medusa Store API category listing — storefront navigation hierarchy.

## Related Files
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/app/exceptions/handler.ts
- apps/web/src/main.tsx
- packages/ui-web/src/components/patterns/hero-slider/index.tsx
- packages/ui-web/src/components/patterns/cards-transition/index.tsx
- packages/ui-web/src/components/next/page-animate-presence/index.tsx
- apps/public-web/app/(shared-layout)/layout.tsx
- apps/public-web/src/lib/api.server.ts
- apps/public-web/src/lib/api.ts
- apps/public-web/src/lib/shop-navigation.server.ts
- packages/ui-web/src/components/next/public-header/index.tsx
- packages/ui-web/src/components/next/public-shell/index.tsx
- packages/ui-web/src/components/next/shop-menu/index.tsx
- packages/ui-web/src/components/next/shop-menu/shop-menu.css
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
