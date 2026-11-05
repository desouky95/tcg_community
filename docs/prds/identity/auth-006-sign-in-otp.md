# AUTH-006: Sign in with OTP

| Field | Value |
| --- | --- |
| Horizon | future |
| Implementation | unverified (previously absent) |
| Actor | guest |
| Surface / owner | AdonisJS identity and applicable client |
| Dependencies | [AUTH-002](../identity/auth-002-request-signup-otp.md) |

Previous documented surface (unverified): `/login`.

## Outcome and scope

A consumed login challenge creates a session without a password. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No dedicated route. This pointer is not a fresh implementation audit.
