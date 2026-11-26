# SYS-014: View product landing page


## Outcome and scope

A guest understands the product and can reach storefront, Collector Disk, sign-in, or signup.

## Requirements

- Referenced application configuration reads root `.env` names directly: `CMS_*`, `PUBLIC_WEB_* / NEXT_PUBLIC_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Defer shared-layout and homepage service requests until runtime with the Cache Components IO boundary. Production builds must not require a running API, CMS, or commerce service; existing cached loaders and Suspense loading shells remain in use.

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

- Render the current Strapi homepage sections in editor-defined order. Collection sections load products from their selected Medusa collection using the configured limit and variant. Support responsive hero banners and collection product grids with a navy field and paper product cards.
- Standard homepage product cards use a four-line scrollable title area at phone widths and wrap the full title at wider widths.
- Cache public homepage content and successful homepage product results for one hour; keep failed product requests retryable. Fall back to the desktop hero image when no valid mobile image is available, and expose banner-strip alternative text to assistive technology.
- Show a homepage loading shell while CMS content loads, and stream product sections independently with section-level loading states.
- Show a setup state when no homepage is published, and preserve other sections when product data is unavailable.
- The shared sticker-pack page transition uses responsive pack sizing across mobile, tablet and desktop without adding a background color, and honors reduced-motion preferences.
- The shared storefront layout loads API configuration using the server-side API address, while browser requests use the public API address.
- In Dev Compose, use the browser-facing Strapi origin for homepage and transition media paths.
- Signed-in storefront shoppers can open the account menu from the header to see their username, visit their account, or sign out and clear the storefront cart cookie.
- The shared storefront header exposes Shop categories in a desktop mega menu and mobile disclosure; category service failures leave Shop all accessible, and the desktop panel remains open while moving the pointer into it.

- The desktop Shop menu groups category links by parent in responsive columns, with descendants listed beneath their parents.
- Desktop parent and child labels share the same starting point. Child labels use lighter type and tighter vertical spacing, and reveal an arrow before the label on hover or keyboard focus.
- Desktop category links shift slightly in the reading direction on hover or keyboard focus. Reduced-motion preferences suppress the shift.
- In the desktop Shop menu, hovering or focusing a category reveals its image from bottom to top while retaining the branded graphics; missing or broken images use the branded fallback, and reduced motion removes the directional reveal.

## Acceptance and verification

- Verify the desktop Shop menu keeps parent and child categories grouped as columns reflow, and keeps the Shop all link available.
- Open the localhost homepage and verify that the hero, banner strip and page transition can load local Strapi uploads.
- Production build verification: `pnpm --filter @tcg/public-web build` completes with the local API and CMS unavailable. Application tests and browser checks were not run.

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/Landing.tsx. This pointer is not a fresh implementation audit.

## UI Page Used
- `apps/public-web/app/(shared-layout)/page.tsx` — homepage with a responsive featured banner slider.
- `apps/public-web/app/(shared-layout)/loading.tsx` — homepage loading shell.

## Backend API Route Used
- `GET /api/homepage` — published Strapi homepage and populated sections.
- Medusa Store API product listing — selected product data.
- Storefront product fields include `+variants.metadata` for variant images.
- Medusa Store API category listing — storefront navigation hierarchy.
- `GET /api/v1/auth/me` — current storefront username and session validity.
- `POST /api/v1/auth/logout` — sign out from the account menu.

## Related Files
- apps/public-web/next-env.d.ts (Next.js-generated production route type imports)
- apps/api/start/routes/v1/auth.routes.ts
- apps/api/app/exceptions/handler.ts
- apps/web/src/main.tsx
- packages/ui-web/src/components/patterns/hero-slider/index.tsx
- packages/ui-web/src/components/patterns/cards-transition/index.tsx
- packages/ui-web/src/components/next/page-animate-presence/index.tsx
- apps/public-web/app/(shared-layout)/layout.tsx
- apps/public-web/app/(shared-layout)/_components/homepage-product-section.tsx
- apps/public-web/src/components/homepage-product-section.tsx
- apps/public-web/src/lib/clients/adonis.server.ts
- apps/public-web/src/lib/clients/adonis.ts
- apps/public-web/src/lib/catalog/shop-navigation.server.ts
- packages/ui-web/src/components/next/public-header/index.tsx
- packages/ui-web/src/components/next/public-shell/index.tsx
- apps/public-web/src/components/storefront-account-menu.tsx
- apps/public-web/src/lib/auth/use-storefront-logout.ts
- packages/ui-web/src/components/next/shop-menu/index.tsx
- packages/ui-web/src/components/next/shop-menu/shop-menu.css
- apps/public-web/src/lib/cms/homepage.server.ts
- apps/public-web/src/lib/catalog/homepage-product-queries.ts
- apps/public-web/src/lib/catalog/homepage-product-data.ts
- apps/public-web/tests/homepage-product-queries.test.mjs
- apps/cms/tests/medusa-collections.test.cjs
- apps/cms/src/api/homepage/content-types/homepage/schema.json
- apps/cms/src/plugins/medusa-collections/strapi-server.js
- apps/cms/src/admin/components/MedusaCollectionInput.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
