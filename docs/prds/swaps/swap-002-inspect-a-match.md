# SWAP-002: Inspect a match

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Swaps |
| Owner | Collector Disk and AdonisJS |
| Dependencies | [SWAP-001](../swaps/swap-001-find-matching-collectors.md) |

## Outcome

A collector reviews a match before proposing a deal.

## Requirements

- Show mutually relevant offered and wanted cards, quantities and permitted profile information; recheck availability when proposing.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Apply the shared swap lifecycle and safety rules; retain an auditable history without exposing private evidence or contact details.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Test each affected participant and operator permission, state transition, block and dispute path.
