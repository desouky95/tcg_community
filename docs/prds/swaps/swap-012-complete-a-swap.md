# SWAP-012: Complete a swap


## Outcome and scope

A deal completes after the applicable handoff conditions are met.

## Requirements

- Require both participant receipt or handoff confirmations; an authorized operator may resolve a disputed case with an auditable reason. Do not treat chat messages as confirmation.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Apply the shared swap lifecycle and safety rules; retain an auditable history without exposing private evidence or contact details.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Test each affected participant and operator permission, state transition, block and dispute path.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/start/routes/v1/swaps.routes.ts
- apps/api/app/controllers/swaps_controller.ts
- apps/api/app/controllers/swap_deals_controller.ts
- apps/api/app/services/swap_service.ts
- apps/web/src/pages/Swapping.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
