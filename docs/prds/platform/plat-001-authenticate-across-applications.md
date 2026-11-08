# PLAT-001: Authenticate across applications


## Outcome and scope

A user can authenticate with their AdonisJS account across the storefront and Collector Disk.

## Requirements

- AdonisJS is the identity authority; define a secure, verified integration to Medusa customer accounts without sharing passwords or creating duplicate identities. Token exchange and session details require technical design.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/database/migrations
- apps/api/database/seeders
- apps/backend/src/scripts/seed-demo-products.ts
- apps/cms/config

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
