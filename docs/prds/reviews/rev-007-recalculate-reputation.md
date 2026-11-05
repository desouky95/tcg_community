# REV-007: Recalculate reputation

| Field | Value |
| --- | --- |
| Horizon | v1 |
| Implementation | unverified (previously planned) |
| Actor | worker |
| Surface / owner | Collector Disk and AdonisJS |
| Dependencies | [REV-003](../reviews/rev-003-submit-review.md), [REV-006](../reviews/rev-006-moderate-review.md) |

Previous documented surface (unverified): `background worker`.

## Outcome and scope

A deterministic projection updates the public trust score. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current worker. This pointer is not a fresh implementation audit.
