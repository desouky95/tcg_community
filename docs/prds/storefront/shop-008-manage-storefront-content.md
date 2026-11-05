# SHOP-008: Manage storefront content

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Storefront |
| Owner | Next.js, Medusa and Strapi as applicable |
| Dependencies | [SHOP-001](../storefront/shop-001-introduce-collector-disk.md) |

## Outcome

An authorized editor publishes storefront content.

## Requirements

- Strapi owns editorial content and publication; Next.js displays published content only.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
