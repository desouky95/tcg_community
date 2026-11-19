# SHOP-003: View product


## Outcome and scope

A shopper can inspect a product before purchase.

## Requirements

- Use the native Medusa product type (`product.type.value`) for availability: `Coming Soon` disables purchasing and quantity controls; `Pre-order` labels the purchase action and explains that shipping occurs when available. Pre-orders retain normal pricing, region, and inventory validation; enable variant backorders in Medusa Admin when accepting orders without stock. Missing-list products marked Coming Soon use the non-purchasable product detail panel.

- Medusa search and workflow integrations retain typed query and logger dependencies during production builds.

- Show product images, description, selected variant, region-calculated price and availability from Medusa. Product IDs and handles both resolve; unknown products return 404.
- Present product images in a swipeable gallery with a selectable, horizontally scrollable thumbnail strip. Size the gallery to keep the image and thumbnails together in the initial viewport when space permits.
- Group the product title and purchase controls beside the gallery on wide screens and below it on smaller screens; place the full description after the purchase controls.
- Display a nonempty product description with its line breaks; omit the section when the description is blank.
- Keep the space between the gallery and product information consistent as the gallery resizes with the viewport.
- Allow a valid in-stock or backorderable variant and quantity to be added to the region-matched cart, with pending and recoverable error states.
- Only products with Medusa `metadata.type === "missing_list"` replace the standard purchase panel with a searchable, paginated card selector. Card identity and price use missing-list variant metadata; catalog card images are optional.
- Sort cards by their API checklist order; use card number when no linked checklist order is available.
- Allow multiple available cards to be selected with per-card quantities, show an estimated selection total, and add selected variants as separate cart line items. Revalidate price and stock during cart addition; report partial failures and retain failed selections.
- Place the quantity input and its decrement and increment controls beside the add-to-cart action when space permits, respecting quantity and inventory limits.
- Authorized administrators can append an AVIF image (up to 10 MB) through the product details widget while retaining existing media.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

- Medusa product and variant changes synchronize to Strapi by Medusa ID with unique product handles and retryable failures. Prices and inventory remain in Medusa.

## Acceptance and verification

- Manually verify Coming Soon with positive stock cannot be purchased, Pre-order with stock or enabled backorders can be purchased, and ordinary products retain existing behavior. Verify missing-list products with either type.

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
- Verify gallery selection, swipe and keyboard interaction, unavailable images, and zero, one, or many images across mobile, desktop, and short landscape viewports.
- Verify the product and purchase information remains readable and usable with long titles and descriptions, multiple variants, and unavailable products at desktop and mobile sizes.
- Verify populated, multiline, empty, and whitespace-only product descriptions.
- Verify the gallery and information remain evenly spaced on wide and short viewports and after resizing.
- Verify quantity entry and stepper controls at their minimum and inventory limits, when changing variants, and when adding to cart.
- Verify missing-list classification, search by card number/name, pagination with selections retained, optional catalog images, unavailable cards, estimated totals, batch cart addition, stale stock, partial failure, and retry behavior at mobile and desktop sizes.

## UI Page Used
- Medusa Admin product details — AVIF upload widget.
- `apps/public-web/app/(shared-layout)/(store)/shop/[handle]/page.tsx`
- `apps/public-web/src/components/missing-list-card-selector.tsx`

## Backend API Route Used
- `POST /admin/products/:id/avif` — authenticated AVIF upload and product media update.
- `GET /store/products`, `GET /store/regions`, `POST /store/carts` and `POST /store/carts/:id/line-items` — product details, regional pricing and add to cart.
- `GET /store/missing-lists/:product_id/cards` — validated, searchable missing-list variants with optional catalog imagery.

## Related Files
- apps/backend/src/workflows/hooks/product-availability.ts
- apps/backend/src/api/store/missing-lists/[product_id]/cards/route.ts
- apps/public-web/src/lib/catalog/product-detail.server.ts
- apps/public-web/app/api/missing-lists/[productId]/cards/route.ts
- apps/public-web/src/providers/CartProvider.tsx
- apps/public-web/src/lib/commerce/cart-actions.ts
- apps/public-web/src/lib/clients/medusa.ts
- apps/public-web/app/api/cart/add/route.ts
- apps/public-web/app/(shared-layout)/(store)/shop/[handle]/_components/product-gallery.tsx
- apps/public-web/app/(shared-layout)/(store)/shop/[handle]/_components/purchase-panel.tsx
- apps/backend/src/admin/widgets/product-avif.tsx
- apps/backend/src/api/admin/products/[id]/avif/route.ts
- apps/backend/src/workflows/upload-product-avif.ts
- apps/backend/src/modules/card-catalog/service.ts
- apps/backend/src/modules/collection-sale/service.ts
- apps/public-web/app/(shared-layout)/checklists/page.tsx

- apps/backend/src/subscribers/sync-strapi-product.ts
- apps/backend/src/integrations/strapi/product-sync.ts
- apps/cms/src/api/product/content-types/product/schema.json
- apps/cms/src/api/product-variant/content-types/product-variant/schema.json

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
