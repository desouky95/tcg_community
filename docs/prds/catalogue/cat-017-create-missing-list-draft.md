# CAT-017: Create missing-list draft product

## Outcome and scope

Administrators create draft products from an external card collection or CSV, then export and import a product CSV to update card prices, quantities, and availability, including collections with thousands of cards.

## Requirements

- The create form accepts up to 5,000 validated cards and creates a draft product. External collection selection uses the authenticated card-catalog collection endpoints under `/store/card-catalog/collections`; the retired Card Collections product-creation page and endpoint are not used.
- The create endpoint accepts request bodies up to 2 MB; larger bodies remain rejected.
- The product manager exports a CSV containing each variant ID, card identity, price, quantity, and availability.
- Import accepts a complete CSV matching every product variant once; invalid or incomplete files do not change the draft.
- Imported values are reviewed in the product manager and saved through the existing update route.
- The update endpoint accepts request bodies up to 2 MB; larger bodies remain rejected.
- Authentication, validation, and stock-location checks remain enforced.

## Acceptance and verification

- A large valid collection request within the configured limit reaches validation and creates a draft.
- Requests over 2 MB are rejected by the JSON body parser.
- Existing authentication and card validation remain in place.
- Exported CSV can be re-imported without edits; duplicate, unknown, missing, or malformed variant rows are rejected.
- Imported quantity, price, and availability changes persist after save.

## UI Page Used

- `apps/backend/src/admin/routes/missing-list/external/page.tsx`
- `apps/backend/src/admin/routes/missing-list/[id]/page.tsx`
- `apps/backend/src/admin/routes/missing-list/components/create-form.tsx`
- `apps/backend/src/admin/routes/missing-list/components/csv.ts`

## Backend API Route Used

- `GET /store/card-catalog/collections` and `GET /store/card-catalog/collections/:id` — authenticated catalog selection for the missing-list create form.
- `POST /admin/missing-lists`
- `GET /admin/missing-lists/:id`
- `POST /admin/missing-lists/:id`

## Related Files

- `apps/backend/src/api/store/card-catalog/collections/route.ts`
- `apps/backend/src/api/store/card-catalog/collections/[id]/route.ts`
- `apps/backend/src/api/middlewares.ts`
- `apps/backend/src/api/admin/missing-lists/route.ts`
- `apps/backend/src/api/admin/missing-lists/[id]/route.ts`
- `apps/backend/src/api/admin/missing-lists/validators.ts`
- `apps/backend/src/workflows/missing-list.ts`

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
