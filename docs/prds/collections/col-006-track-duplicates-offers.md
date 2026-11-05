# COL-006: Track duplicate or offered cards

| Field | Value |
| --- | --- |
| Horizon | current |
| Implementation | unverified (previously implemented) |
| Actor | collector |
| Surface / owner | Existing Collector Disk collections and AdonisJS; preserve established behavior |
| Dependencies | [COL-005](../collections/col-005-update-card-ownership.md) |

Previous documented surface (unverified): `/collection/:id/edit`.

## Outcome and scope

Offered quantities remain nonnegative and do not exceed owned quantity. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: Existing user checklist update. This pointer is not a fresh implementation audit.
