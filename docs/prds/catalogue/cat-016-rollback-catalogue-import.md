# CAT-016: Roll back catalogue import

| Field | Value |
| --- | --- |
| Horizon | v1 |
| Implementation | unverified (previously planned) |
| Actor | administrator |
| Surface / owner | Collector Disk and AdonisJS catalogue |
| Dependencies | [CAT-015](../catalogue/cat-015-commit-catalogue-import.md) |

Previous documented surface (unverified): `/admin/catalogue/import`.

## Outcome and scope

An eligible import restores the prior catalogue version through an auditable compensating change. This is an established capability; preserve current collection and checklist behavior rather than redesign it.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: Planned background import workflow. This pointer is not a fresh implementation audit.
