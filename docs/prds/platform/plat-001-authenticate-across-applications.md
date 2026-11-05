# PLAT-001: Authenticate across applications

| Field | Value |
| --- | --- |
| Horizon | Planned |
| Implementation | Unverified; audit existing code before implementation |
| Domain | Platform |
| Owner | The named backend and its clients |
| Dependencies | None |

## Outcome

A user can authenticate with their AdonisJS account across the storefront and Collector Disk.

## Requirements

- AdonisJS is the identity authority; define a secure, verified integration to Medusa customer accounts without sharing passwords or creating duplicate identities. Token exchange and session details require technical design.
- Authorize each action against its resource and actor; reject invalid or stale operations without partial effects.
- Show relevant progress, confirmation, empty and failure states, including a clear next action.
- Use the service ownership and security boundaries in the shared contracts.

## Acceptance and verification

- The outcome is achieved for an eligible actor and unauthorized actors cannot access or change the resource.
- Verify the main flow, validation and failure handling, including retries and concurrent changes where applicable.
- Verify integration with the owning service and its persisted state.
