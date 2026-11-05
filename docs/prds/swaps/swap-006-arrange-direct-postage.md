# SWAP-006: Arrange direct postage

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Swaps |
| Owner | Collector Disk and AdonisJS |
| Dependencies | [SWAP-004](../swaps/swap-004-respond-to-a-proposal.md) |

## Outcome

Both participants arrange and record their direct shipments.

## Requirements

- Each records shipment and tracking where available and confirms receipt separately. NextPull does not possess, verify or guarantee items in this mode.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Apply the shared swap lifecycle and safety rules; retain an auditable history without exposing private evidence or contact details.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Test each affected participant and operator permission, state transition, block and dispute path.
