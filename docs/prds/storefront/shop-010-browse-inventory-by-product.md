# SHOP-010: Browse inventory by product

## Outcome and scope

An authorized Medusa operator identifies linked products in the original inventory table, browses a separate product-grouped inventory view, and opens existing inventory details to manage stock.

## Requirements

- Referenced application configuration reads root `.env` names directly: `BACKEND_*`. See [shared environment guidance](../_shared/deployment-and-recovery.md).

- Enable Medusa’s experimental `view_configurations` feature and configure the Settings module’s `InventoryItem` entity with a computed `Product` column on the original inventory table. Default column order is title, SKU, Product, reserved, stocked. Existing saved views may need Product enabled through the table’s column settings.
- Register the `inventory_products` renderer through Medusa’s native `src/admin/cell-renderers.tsx` entry. Fetch linked variant product IDs and titles with the inventory rows, show each linked product once with a product-details link, and show “No linked product” for unlinked inventory. Do not enable unsupported Product sorting or filtering.
- Configurable views apply to other supported Admin tables as well; this feature remains experimental. The native inventory table retains stock-editing actions and item pagination. Product grouping remains available through the separate grouped view.

- Add a “Group by product” link above the native inventory list and an “Inventory by product” sidebar route. Use supported Admin widgets and UI routes without replacing Medusa’s built-in table.
- Fetch product groups from the authenticated native Admin product API with linked variant inventory and location levels. Search products and paginate by ten products, keeping each product’s linked inventory items together.
- Show each inventory item once per product, even when multiple variants share it, and list its linked variants. An inventory item shared across products can appear in each product group; do not present cross-product sums.
- Show item title, SKU, stocked quantity, reserved quantity, and available quantity across all stock locations. Available quantity is stocked minus reserved; retain negative values. Show a dash when location-level data is unavailable.
- Link product headings and actions to native product details and inventory items to native inventory details for stock editing. Refresh quantities on demand.
- Products without linked inventory show an explicit empty state. Inventory items without a product remain accessible through “All inventory items”; the grouped view does not claim to include them.
- Use Medusa UI components and authenticated SDK queries. Handle loading, errors with retry, empty search results, narrow-screen overflow, and keyboard navigation.
- Do not mutate inventory, product links, or stock quantities in this view.

## Acceptance and verification

- Restart/rebuild Medusa, open the original inventory list, and verify Product appears by default for a new view. For existing saved views, enable Product in column settings and save the view.
- Verify one linked product, several variants linked to the same product (deduplicated), several different linked products, and no linked product. Product links must open product details rather than triggering inventory row navigation.
- Verify native inventory search, pagination, stock actions, column visibility, and saved views. Verify other configurable Admin tables remain usable after enabling the feature flag.

- Manually verify a product with multiple variants, a shared inventory item, and a variant with multiple inventory components. Confirm each inventory item appears once within the product and links to the correct inventory detail page.
- Verify multiple stock locations, zero and negative available stock, missing SKU/title, products without inventory links, and items not linked to products.
- Search and paginate beyond ten products; verify groups stay complete and searching resets pagination.
- Edit stock through native inventory details, return to the grouped view, and refresh to confirm updated quantities.
- Verify loading, failed requests with retry, empty search results, unauthenticated access, horizontal scrolling, and keyboard access.
- Implementation verification: backend TypeScript compilation. Automated tests are not created or run unless explicitly requested.

## UI Page Used

- `/app/inventory` — native inventory list, with a “Group by product” widget.
- `/app/inventory-by-product` — searchable, paginated product groups.
- `/app/products/:id` and `/app/inventory/:id` — existing product and inventory details.

## Backend API Route Used

- `GET /admin/inventory-items` — native inventory table, including linked `variants.product.id` and `variants.product.title`.
- Native Settings entity-column and view-configuration APIs — generated columns and saved table views.
- `GET /admin/products` — authenticated product search and pagination, including variant inventory items and stock location levels.
- Native product and inventory detail APIs remain responsible for viewing and editing entities.

## Related Files

- apps/backend/medusa-config.ts
- apps/backend/src/admin/cell-renderers.tsx

- apps/backend/src/admin/routes/inventory-by-product/page.tsx
- apps/backend/src/admin/widgets/inventory-by-product.tsx
- apps/backend/src/admin/lib/client.tsx

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
