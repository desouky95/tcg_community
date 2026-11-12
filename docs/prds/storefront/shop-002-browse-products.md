# SHOP-002: Browse products


## Outcome and scope

A shopper can discover Medusa collections and categories, browse products, compare available prices and narrow the results.

## Requirements

- The shop presents collection and category links and an all-products listing; category handles open dedicated listings that include products from the category and all descendant categories, without duplicates.
- The public Shop navigation exposes a category hierarchy in a desktop mega menu and mobile disclosure, with a direct Shop all link and a safe fallback if categories are unavailable. The desktop menu remains open as a pointer moves from the trigger into the panel.
- Next.js resolves a collection by handle and reads its products, region-calculated prices and available inventory from Medusa; unpublished products are not shown.
- Collection pages use a shared product card with prominent artwork, playful brand-color geometry, price and available stock status.
- Shop and category listings show the active sort and removable URL-backed price and availability filters, validate price ranges, and paginate results. Manufacturer and release-year filters are deferred.
- Discovery and product results load independently; missing region pricing is explained with a retry. Discovery rails expose keyboard-accessible horizontal scrolling.
- Default ordering and pagination use the Store API; price and availability filtering and price ordering evaluate the complete matching set to preserve accurate counts.
- Unknown collections return 404; empty collections, no matching results and service failures have distinct states.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

- In the desktop Shop menu, hovering or focusing a category reveals its image from bottom to top while retaining the branded graphics; missing or broken images use the branded fallback, and reduced motion removes the directional reveal.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- `/collections/[handle]` — dynamic storefront collection listing.
- `/shop` — collection and category discovery and general product listing.
- `/categories/[handle]` — dynamic category listing.

## Backend API Route Used
- Medusa Store API: `GET /store/collections`, `GET /store/product-categories` and `GET /store/products`, plus `GET /store/regions` for country-to-region resolution.

## Related Files
- apps/public-web/app/(shared-layout)/(store)/shop/page.tsx
- apps/public-web/app/(shared-layout)/(store)/categories/[handle]/page.tsx
- apps/public-web/app/(shared-layout)/(store)/_components/product-listing.tsx
- apps/public-web/app/(shared-layout)/(store)/_components/discovery-section.tsx
- packages/ui-web/src/components/next/shop-menu/index.tsx
- packages/ui-web/src/components/next/shop-menu/shop-menu.css
- packages/ui-web/src/components/next/public-header/index.tsx
- packages/ui-web/src/components/next/public-shell/index.tsx
- apps/public-web/src/lib/shop-navigation.server.ts
- apps/public-web/tests/shop-navigation.test.mjs
- packages/ui-web/src/shop-menu.test.tsx
- apps/public-web/src/lib/shop-data.server.ts
- apps/public-web/tests/shop-data.test.mjs
- apps/public-web/app/(shared-layout)/(store)/collections/[handle]/page.tsx
- apps/public-web/app/(shared-layout)/(store)/collections/[handle]/filter-drawer.tsx
- packages/ui-web/src/components/patterns/product-card/index.tsx
- apps/public-web/src/lib/collection-data.server.ts
- apps/public-web/src/lib/collection-queries.ts
- apps/public-web/tests/collection-queries.test.mjs
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
