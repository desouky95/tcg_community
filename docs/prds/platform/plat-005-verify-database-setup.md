# PLAT-005: Verify database setup

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Platform |
| Owner | The named backend and its clients |
| Dependencies | [PLAT-002](../platform/plat-002-initialize-adonisjs-data.md), [PLAT-003](../platform/plat-003-initialize-medusa-data.md), [PLAT-004](../platform/plat-004-initialize-strapi-data.md) |

## Outcome

A developer or deployment operator can reproduce a clean backend setup.

## Requirements

- Document prerequisites and commands per service; test fresh setup, reruns where supported, failure reporting and isolation of development fixtures. Production secrets and real personal data must never be seeded.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
