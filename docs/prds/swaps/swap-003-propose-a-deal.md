# SWAP-003: Propose a deal

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Swaps |
| Owner | Collector Disk and AdonisJS |
| Dependencies | [SWAP-002](../swaps/swap-002-inspect-a-match.md) |

## Outcome

A collector proposes an exchange from a dedicated swap page.

## Requirements

- Choose both sides’ cards and quantities and one mode: direct postage, on-ground, or NextPull middleman. Snapshot the proposal and notify the other participant. A chat may link to the deal but is not required.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Apply the shared swap lifecycle and safety rules; retain an auditable history without exposing private evidence or contact details.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Test each affected participant and operator permission, state transition, block and dispute path.
