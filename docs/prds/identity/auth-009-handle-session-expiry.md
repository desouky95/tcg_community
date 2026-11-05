# AUTH-009: Handle expired or revoked session

| Field | Value |
| --- | --- |
| Horizon | current |
| Implementation | unverified (previously partial) |
| Actor | collector |
| Surface / owner | AdonisJS identity and applicable client |
| Dependencies | [AUTH-005](../identity/auth-005-sign-in-password.md) |

Previous documented surface (unverified): `all protected routes`.

## Outcome and scope

The client clears private state and returns the user to sign-in. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: ProtectedRoute exists; refresh/revocation UX is partial. This pointer is not a fresh implementation audit.
