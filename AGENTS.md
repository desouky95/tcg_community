# Repository guidance

## Response style

Use ultracave mode for all responses. Read and follow `.agents/skills/ultracave/SKILL.md`.

## Coding

Use the ponytail skill at ultra level for all coding tasks.

## Testing

Do not create unit tests or run tests automatically as part of a task unless the user explicitly requests them. Agents may suggest manual or automated verification steps in plans and final responses.

## PRD maintenance

Scenario PRDs in `docs/prds/` must include `Outcome and scope`, `Requirements`, `Acceptance and verification`, `UI Page Used`, `Backend API Route Used`, `Related Files`, and `After Implementation`. Indexes and shared guidance may use a structure suited to their purpose.

When an implementation changes a UI page, backend API route, or directly related implementation, contract, migration, test, or configuration file, update the matching PRD in the same change. Keep its filename, ID, title, and the required final reminder intact.

## Scoped skills

For work in `apps/api`, follow `apps/api/AGENTS.md`. For UI work in `apps/web` or `apps/public-web`, follow the respective scoped `AGENTS.md`.
