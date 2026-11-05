# SHOP-005: Checkout

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Storefront |
| Owner | Next.js, Medusa and Strapi as applicable |
| Dependencies | [SHOP-004](../storefront/shop-004-manage-cart.md), [PLAT-001](../platform/plat-001-authenticate-across-applications.md) |

## Outcome

A shopper submits delivery and payment details for a NextPull order.

## Requirements

- Medusa validates cart, shipping, totals and payment before order placement; show final charges before confirmation.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
