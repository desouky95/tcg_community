# SHOP-002: Browse products

## Outcome and scope

A shopper can discover Medusa collections and categories, browse products, compare available prices and narrow the results.

## Requirements

- Display Medusa product types `Coming Soon` and `Pre-order` on shop, collection, and homepage cards. Keep Coming Soon products browsable; purchase eligibility is enforced by Medusa rather than CMS content.

- The shop presents collection and category links and an all-products listing; category handles open dedicated listings that include products from the category and all descendant categories, without duplicates.
- The public Shop navigation exposes a category hierarchy in a desktop mega menu and mobile disclosure, with a direct Shop all link and a safe fallback if categories are unavailable. The desktop menu remains open as a pointer moves from the trigger into the panel.
- Next.js resolves a collection by handle and reads its products, region-calculated prices and available inventory from Medusa; unpublished products are not shown.
- Product list and homepage queries request `+variants.metadata` for Medusa Variant Images.
- Collection pages use a shared product card with prominent artwork, playful brand-color geometry, price and available stock status.
- Standard homepage product cards use a four-line title area at phone widths. Longer titles scroll within that area. At wider widths the title wraps freely.
- Missing-list product cards reuse the normal product card background geometry and surface treatment. Pack and revealed sticker images stay contained without cropping or zooming; revealed stickers have no backing color. Pack gradient and shimmer effects are prop-controlled and disabled for these cards; the open button appears on desktop hover or keyboard focus.
- Storefront classifies missing-list products from Medusa product `metadata.type === "missing_list"`; CMS media does not determine product type. CMS provides optional pack thumbnails and sticker images. Cards with both images offer one floating pack-opening button that starts `PackOpening2D` inline; cards missing either image show no opening button. Product title links to normal product details. No modal; keyboard and reduced-motion support remain.
- Shop and category listings show the active sort and removable URL-backed price and availability filters, validate price ranges, and paginate results. Manufacturer and release-year filters are deferred.
- Discovery and product results load independently; missing region pricing is explained with a retry. Discovery rails expose keyboard-accessible horizontal scrolling.
- Default ordering and pagination use the Store API; price and availability filtering and price ordering evaluate the complete matching set to preserve accurate counts.
- Unknown collections return 404; empty collections, no matching results and service failures have distinct states.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

- The desktop Shop menu groups each top-level category in its own responsive column, with visible descendants beneath it and direct links for navigable categories.
- Desktop parent and child labels share the same starting point. Child labels use lighter type and tighter vertical spacing, and reveal an arrow before the label on hover or keyboard focus.
- Desktop category links shift slightly in the reading direction on hover or keyboard focus. Reduced-motion preferences suppress the shift.
- In the desktop Shop menu, hovering or focusing a category reveals its image from bottom to top while retaining the branded graphics; missing or broken images use the branded fallback, and reduced motion removes the directional reveal.

## Acceptance and verification

- Open Shop at desktop widths and verify each child appears under its parent. Tab through parent and child links to verify the category preview follows focus and each link opens the correct listing.
- Check a long homepage product title at phone and desktop widths. Verify the full title can be read by scrolling on phones without growing the card, and is visible in full at desktop widths.
- Manually verify both labels across shop, collection, and homepage sections, including missing-list products and products without a special type.

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Missing-list pack previews open inline; their open button is visible on touch screens and revealed on desktop hover or keyboard focus.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used

- `/collections/[handle]` — dynamic storefront collection listing.
- `/shop` — collection and category discovery and general product listing.
- `/categories/[handle]` — dynamic category listing.
- Homepage collection product cards.

## Backend API Route Used

- Medusa Store API: `GET /store/collections`, `GET /store/product-categories` and `GET /store/products`, plus `GET /store/regions` for country-to-region resolution.
- Medusa Store API: `GET /store/products` includes product metadata for card classification.
- Strapi Content API: `GET /api/products` provides pack thumbnails and sticker images for the Medusa product IDs.
- `POST /api/commerce/customer` links the signed-in shopper's account in the background using the browser's CSRF header.

## Related Files
- apps/public-web/src/components/homepage-product-section.tsx

- apps/public-web/app/(shared-layout)/(store)/shop/page.tsx
- apps/public-web/app/(shared-layout)/(store)/shop/commerce-customer-link.tsx
- apps/public-web/app/(shared-layout)/(store)/categories/[handle]/page.tsx
- apps/public-web/app/(shared-layout)/(store)/_components/product-listing.tsx
- apps/public-web/app/(shared-layout)/(store)/_components/discovery-section.tsx
- packages/ui-web/src/components/next/shop-menu/index.tsx
- packages/ui-web/src/components/next/shop-menu/shop-menu.css
- packages/ui-web/src/components/next/public-header/index.tsx
- packages/ui-web/src/components/next/public-shell/index.tsx
- apps/public-web/src/lib/catalog/shop-navigation.server.ts
- apps/public-web/src/lib/clients/medusa.ts
- apps/public-web/tests/shop-navigation.test.mjs
- packages/ui-web/src/shop-menu.test.tsx
- apps/public-web/src/lib/catalog/shop-data.server.ts
- apps/public-web/tests/shop-data.test.mjs
- apps/public-web/app/(shared-layout)/(store)/collections/[handle]/page.tsx
- apps/public-web/app/(shared-layout)/(store)/collections/[handle]/filter-drawer.tsx
- packages/ui-web/src/components/patterns/product-card/index.tsx
- apps/public-web/src/components/missing-list-product-card.tsx
- apps/public-web/src/components/shop-product-card.tsx
- apps/public-web/src/lib/catalog/product-card-visuals.server.ts
- packages/ui-web/src/components/interactive/pack-opening/pack-opening-2d.tsx
- apps/public-web/src/lib/catalog/collection-data.server.ts
- apps/public-web/src/lib/catalog/collection-queries.ts
- apps/public-web/src/lib/catalog/homepage-product-queries.ts
- apps/public-web/tests/collection-queries.test.mjs
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
