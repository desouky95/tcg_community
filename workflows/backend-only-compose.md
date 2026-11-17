# Backend-only Docker Compose

## Outcome

Provide a fresh Docker flow that builds only `apps/backend`. PostgreSQL and Redis are external services. No other application, database, Redis, proxy, migration, or deployment workflow is included.

## Trigger

A developer needs a fresh backend image.

## Inputs

- Repository root, including the frozen pnpm lockfile and workspace manifests.
- `apps/backend/.env`, containing external `DATABASE_URL`, `EVENTS_REDIS_URL`, and the backend's remaining runtime variables.
- Reachable external PostgreSQL and Redis for migrations or runtime.

## Implementation

- Delete the retired files under `infra/`.
- Add `infra/Dockerfile.backend`. It builds the Medusa backend from the monorepo root context and produces the production backend image.
- Add `infra/compose.yaml` with one `backend` service. Its build context is the repository root; its Dockerfile is `infra/Dockerfile.backend`.
- The Compose service loads `apps/backend/.env`. It does not declare PostgreSQL, Redis, volumes, proxies, migration services, or any other app.
- Build command: `docker compose -f infra/compose.yaml build backend`.
- Manual migration command: `docker compose -f infra/compose.yaml run --rm backend pnpm exec medusa db:migrate`.

## Acceptance and verification

- `docker compose -f infra/compose.yaml config --quiet` succeeds with `apps/backend/.env` present.
- The build command builds only the `backend` image.
- The migration command receives the external database and Redis URLs from `apps/backend/.env`.
- No retired Compose service or Dockerfile remains under `infra/`.

## Exclusions

- No Compose-managed infrastructure.
- No automatic migrations.
- No runtime start command, deployment guidance, health checks, CI, or tests.
