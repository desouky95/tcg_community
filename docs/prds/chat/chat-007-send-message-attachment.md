# CHAT-007: Send message attachment

| Field | Value |
| --- | --- |
| Horizon | future |
| Implementation | unverified (previously absent) |
| Actor | collector |
| Surface / owner | Collector Disk conversations and AdonisJS messaging |
| Dependencies | [CHAT-004](../chat/chat-004-send-text-message.md) |

Previous documented surface (unverified): `/chat/:id`.

## Outcome and scope

A scanned media attachment is associated with a message. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Conversations contain messages; swap proposals and deal management live on dedicated deal pages. A conversation may link to a deal.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current implementation. This pointer is not a fresh implementation audit.
