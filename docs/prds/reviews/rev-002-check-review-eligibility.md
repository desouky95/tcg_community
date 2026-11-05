# REV-002: Check review eligibility

| Field | Value |
| --- | --- |
| Horizon | v1 |
| Implementation | unverified (previously partial) |
| Actor | collector |
| Surface / owner | Collector Disk and AdonisJS |
| Dependencies | [REV-001](../reviews/rev-001-view-collector-reviews.md) |

Previous documented surface (unverified): `/profile/:id`.

## Outcome and scope

Only completed counterparties can review once. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: Store validation exists; explicit eligibility endpoint absent. This pointer is not a fresh implementation audit.
