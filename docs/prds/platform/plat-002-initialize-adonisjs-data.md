# PLAT-002: Initialize AdonisJS data

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Platform |
| Owner | The named backend and its clients |
| Dependencies | None |

## Outcome

A clean AdonisJS database can be migrated and seeded.

## Requirements

- Run ordered migrations, then safe baseline seeders; separate optional development fixtures from required reference data. Preserve collection schema and verify users, catalogue, chat and swap dependencies.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
