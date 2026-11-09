# SHOP-003: View product


## Outcome and scope

A shopper can inspect a product before purchase.

## Requirements

- Show product information, purchasable variants, price and availability from Medusa.
- Authorized administrators can append an AVIF image (up to 10 MB) through the product details widget while retaining existing media.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

- Medusa product and variant changes synchronize to Strapi by Medusa ID with unique product handles and retryable failures. Prices and inventory remain in Medusa.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- Medusa Admin product details — AVIF upload widget.
- `apps/public-web/app/(shared-layout)/(store)/shop/[handle]/page.tsx`

## Backend API Route Used
- `POST /admin/products/:id/avif` — authenticated AVIF upload and product media update.

## Related Files
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
