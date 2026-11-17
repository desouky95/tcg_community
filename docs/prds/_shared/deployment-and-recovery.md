# Deployment and database initialization

## UI Page Used
- N/A — shared guidance

## Backend API Route Used
- N/A — shared guidance

## Backend image

`infra/Dockerfile.backend` builds only `apps/backend` from the root workspace with the frozen pnpm lockfile. PostgreSQL and Redis remain external. Compose loads runtime configuration from `apps/backend/.env`; it adds no services, volumes, proxy, start command, or automatic migration.

Build: `docker compose -f infra/compose.yaml build backend`.

Migrate manually: `docker compose -f infra/compose.yaml run --rm backend pnpm exec medusa db:migrate`.

## Related Files
- infra/Dockerfile.backend
- infra/compose.yaml
- docs/prds/README.md
- AGENTS.md

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
