# SHOP-004: Manage cart

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Storefront |
| Owner | Next.js, Medusa and Strapi as applicable |
| Dependencies | [SHOP-003](../storefront/shop-003-view-product.md) |

## Outcome

A shopper can add, update and remove available products.

## Requirements

- Medusa owns cart pricing and availability; show a recoverable error when availability changes.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
