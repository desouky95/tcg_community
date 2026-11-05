# AUTH-001: Register an account

| Field | Value |
| --- | --- |
| Horizon | current |
| Implementation | unverified (previously implemented) |
| Actor | guest |
| Surface / owner | AdonisJS identity and applicable client |
| Dependencies | None |

Previous documented surface (unverified): `/signup`.

## Outcome and scope

A pending account is created and verification is requested. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/web/src/pages/Signup.tsx; apps/api AuthController.signup. This pointer is not a fresh implementation audit.
