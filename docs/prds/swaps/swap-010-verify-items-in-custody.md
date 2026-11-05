# SWAP-010: Verify items in custody

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Swaps |
| Owner | Collector Disk and AdonisJS |
| Dependencies | [SWAP-009](../swaps/swap-009-send-items-to-nextpull.md) |

## Outcome

An authorized NextPull operator checks each received package against the agreed deal.

## Requirements

- Record receipt, item verification and evidence for each side. Mismatches or damaged items pause forwarding and enter a dispute; do not imply authentication or grading beyond the documented inspection.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Apply the shared swap lifecycle and safety rules; retain an auditable history without exposing private evidence or contact details.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Test each affected participant and operator permission, state transition, block and dispute path.
