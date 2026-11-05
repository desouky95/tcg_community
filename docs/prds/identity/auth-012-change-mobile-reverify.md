# AUTH-012: Change mobile and reverify

| Field | Value |
| --- | --- |
| Horizon | current |
| Implementation | unverified (previously implemented) |
| Actor | collector |
| Surface / owner | AdonisJS identity and applicable client |
| Dependencies | [AUTH-011](../identity/auth-011-edit-profile.md), [AUTH-003](../identity/auth-003-verify-mobile-otp.md) |

Previous documented surface (unverified): `/profile/edit`.

## Outcome and scope

The new number remains unverified until OTP succeeds. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Preserve existing behavior and contracts where this capability is already implemented; reconcile any discrepancy with repository evidence before changing it.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: apps/api ProfileController.update. This pointer is not a fresh implementation audit.
