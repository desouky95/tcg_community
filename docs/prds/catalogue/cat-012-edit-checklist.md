# CAT-012: Edit checklist


## Outcome and scope

Checklist metadata and version are updated. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Load checklist rows in the Cards tab through the dedicated cards API for administrators.
- Preload the current category for edit defaults and map a selected subcategory to both parent and subcategory IDs.
- Allow authenticated `admin` and `super_admin` roles to update checklist details.
- Show both the parent category and selected subcategory in the admin collections list.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- Build maintenance: The edit form omits development-only form debug panels; existing cover fixtures include the required checklist slug and aggregate counts. Verified by the collector production build; scenario tests were not run.

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api ChecklistsController.update. This pointer is not a fresh implementation audit.

## UI Page Used
- `apps/web/src/components/molecules/CollectionEditForm/CollectionEditForm.tsx`
- `/admin/collections/:id/edit`

## Backend API Route Used
- `GET /api/v1/checklists/:id?expand=category,subcategory`
- `GET /api/v1/checklists` (admin collections list, including category and subcategory)
- `GET /api/v1/checklists/:id/cards` (admin catalogue view)
- `PUT /api/v1/checklists/:id`

## Related Files
- apps/web/src/components/patterns/CategoriesSelect.tsx
- apps/web/src/components/molecules/CollectionForms.cover.test.tsx
- `apps/api/start/routes/v1/checklists.routes.ts`
- `apps/api/start/routes/v1/admin.routes.ts`
- `apps/api/app/middleware/admin_middleware.ts`
- `apps/api/app/controllers/checklists_controller.ts`
- `apps/api/app/services/checklist_service.ts`
- `apps/api/app/transformers/checklist_transformer.ts`
- `apps/api/app/controllers/cards_controller.ts`
- `apps/api/app/services/card_service.ts`
- `apps/api/app/models/card.ts`
- `apps/web/src/components/checklists/CollectionCardsTable.tsx`
- `apps/web/src/components/molecules/CollectionEditForm/CollectionEditForm.tsx`
- `apps/web/src/components/molecules/CollectionEditForm/CollectionEditForm.hook.ts`
- `apps/web/src/pages/admin/AdminCollections/AdminCollections.tsx`
- `packages/locale/src/locales/en/common.json`
- `packages/locale/src/locales/ar/common.json`

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
