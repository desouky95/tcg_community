# CAT-005: Search and filter cards

| Field | Value |
| --- | --- |
| Horizon | v1 |
| Implementation | unverified (previously partial) |
| Actor | guest, collector |
| Surface / owner | Collector Disk and AdonisJS catalogue |
| Dependencies | [CAT-003](../catalogue/cat-003-browse-checklists.md) |

Previous documented surface (unverified): `catalogue search`.

## Outcome and scope

Users receive paginated cards matching normalized filters. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: Client-side search exists; server search is incomplete. This pointer is not a fresh implementation audit.
