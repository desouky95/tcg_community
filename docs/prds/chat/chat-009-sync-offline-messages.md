# CHAT-009: Synchronize offline messages


## Outcome and scope

The device resumes from its durable cursor without gaps.

## Requirements

- Authorize access according to the actor and resource visibility; private data is visible only to permitted users.
- Present the relevant result and actionable loading, empty, validation and failure states in the owning client.
- Persist changes through the owning backend; reject invalid or unauthorized requests without partial effects.
- Conversations contain messages; swap proposals and deal management live on dedicated deal pages. A conversation may link to a deal.

## Acceptance and verification

- The stated outcome succeeds for an eligible actor and is denied for unauthorized access.
- Verify input and failure handling and the existing behavior through focused backend and client tests appropriate to the scenario.

Existing evidence pointer: No mobile implementation. This pointer is not a fresh implementation audit.

## UI Page Used
- N/A — no dedicated UI page

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/api/start/routes/v1/conversations.routes.ts
- apps/api/app/controllers/conversations_controller.ts
- apps/api/app/models/conversation.ts
- apps/web/src/pages/Chat.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
