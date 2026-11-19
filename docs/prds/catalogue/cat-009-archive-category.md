# CAT-009: Archive category


## Outcome and scope

The category is hidden without orphaning historical references. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Taxonomy writes allow authenticated `admin` and `super_admin` roles.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: Existing delete route requires soft-delete semantics. This pointer is not a fresh implementation audit.

## UI Page Used
- `/admin/categories/:id/edit`
- `apps/web/src/components/molecules/CategoryEditForm/CategoryEditForm.tsx`

## Backend API Route Used
- `DELETE /api/v1/categories/:id`

## Related Files
- `apps/api/start/routes/v1/admin.routes.ts`
- `apps/api/app/middleware/admin_middleware.ts`
- `apps/api/app/controllers/catalogue_controller.ts`
- `apps/web/src/components/molecules/CategoryEditForm/CategoryEditForm.hook.ts`

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
