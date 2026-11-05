# CHAT-010: Report conversation

| Field | Value |
| --- | --- |
| Horizon | future |
| Implementation | unverified (previously absent) |
| Actor | collector |
| Surface / owner | Collector Disk conversations and AdonisJS messaging |
| Dependencies | [CHAT-003](../chat/chat-003-open-conversation.md) |

Previous documented surface (unverified): `/chat/:id`.

## Outcome and scope

A moderation report is created without notifying the reported participant. 

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Conversations contain messages; swap proposals and deal management live on dedicated deal pages. A conversation may link to a deal.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No current implementation. This pointer is not a fresh implementation audit.
