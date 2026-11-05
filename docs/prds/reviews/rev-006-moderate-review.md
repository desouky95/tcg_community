# REV-006: Moderate review

| Field | Value |
| --- | --- |
| Horizon | future |
| Implementation | unverified (previously absent) |
| Actor | moderator |
| Surface / owner | Collector Disk and AdonisJS |
| Dependencies | [REV-005](../reviews/rev-005-report-abusive-review.md) |

Previous documented surface (unverified): `/admin/reports`.

## Outcome and scope

An authorized decision publishes, hides, or removes the review. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current implementation. This pointer is not a fresh implementation audit.
