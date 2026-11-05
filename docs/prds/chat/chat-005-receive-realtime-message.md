# CHAT-005: Receive realtime message

| Field | Value |
| --- | --- |
| Horizon | v1 |
| Implementation | unverified (previously partial) |
| Actor | collector |
| Surface / owner | Collector Disk conversations and AdonisJS messaging |
| Dependencies | [CHAT-004](../chat/chat-004-send-text-message.md) |

Previous documented surface (unverified): `/chat/:id`.

## Outcome and scope

Connected participants receive ordered message events. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Conversations contain messages; swap proposals and deal management live on dedicated deal pages. A conversation may link to a deal.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: Realtime target is documented but not fully implemented. This pointer is not a fresh implementation audit.
