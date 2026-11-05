# SYS-004: Handle deleted or archived resource

| Field | Value |
| --- | --- |
| Horizon | v1 |
| Implementation | unverified (previously planned) |
| Actor | guest, collector, administrator, worker |
| Surface / owner | Relevant application and owning backend |
| Dependencies | [SYS-003](../system/sys-003-handle-404.md) |

Previous documented surface (unverified): `resource detail surfaces`.

## Outcome and scope

Known removed resources preserve context while blocking actions. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No shared 410 contract. This pointer is not a fresh implementation audit.
