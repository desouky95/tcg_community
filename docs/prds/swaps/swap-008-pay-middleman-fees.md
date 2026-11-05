# SWAP-008: Pay middleman fees

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Swaps |
| Owner | Collector Disk and AdonisJS |
| Dependencies | [SWAP-004](../swaps/swap-004-respond-to-a-proposal.md), [PLAT-006](../platform/plat-006-configure-swap-operations.md) |

## Outcome

Both participants see their own configurable middleman fees before agreeing and pay before sending items.

## Requirements

- Display fee allocation and total before acceptance, record each payment separately, and prevent shipping instructions until all required fees are confirmed. Fee amounts and allocation are operator-configurable.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Apply the shared swap lifecycle and safety rules; retain an auditable history without exposing private evidence or contact details.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Test each affected participant and operator permission, state transition, block and dispute path.
