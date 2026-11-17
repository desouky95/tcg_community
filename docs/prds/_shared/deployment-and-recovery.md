# Deployment and database initialization

## UI Page Used
- N/A — shared guidance

## Backend API Route Used
- N/A — shared guidance

## Backend image

`infra/Dockerfile.backend` builds only `apps/backend` from the root workspace with the frozen pnpm lockfile. PostgreSQL and Redis remain external. Compose loads runtime configuration from `apps/backend/.env`; it adds no services, volumes, proxy, start command, or automatic migration.

Build: `docker compose -f infra/compose.yaml build backend`.

Migrate manually: `docker compose -f infra/compose.yaml run --rm backend pnpm exec medusa db:migrate`.

## Root Docker targets

Build each image from the repository root with `docker build --target backend -t tcg-backend .`, replacing `backend` with `public-web`, `api`, or `cms` for the other targets. The images listen on ports 9000, 3000, 3333, and 1337 respectively. Provide each app's runtime environment with an environment file or deployment secrets; databases and Redis are external. Run Medusa migrations separately before starting an updated service; Strapi runs its internal migrations on startup. Medusa also requires `VITE_CARD_CATALOG_URL` and `VITE_CARD_CATALOG_API_KEY` at runtime.

The storefront embeds public configuration at build time. Pass `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_DEFAULT_REGION`, and `NEXT_PUBLIC_APP_URL` using `--build-arg` as needed. Keep server-only tokens and secrets in runtime environment variables, not build arguments.

Mount persistent storage at `/app/public/uploads` for CMS uploads when using local file storage. Use external persistent storage for any CMS database or uploaded files required across deployments.

## Four-app Compose

Development: `docker compose --env-file infra/.env.public-web -f infra/compose.dev.yaml up --build`. It uses the same production image targets and startup commands as production, with local settings from `infra/.env.backend`, `.env.public-web`, `.env.api`, and `.env.cms`. The explicit `--env-file` supplies the storefront's build-time public variables. Rebuild after source or build-time configuration changes. Run Medusa migrations separately: `docker compose --env-file infra/.env.public-web -f infra/compose.dev.yaml run --rm backend /app/node_modules/.bin/medusa db:migrate`. The databases and Redis remain external: use container-reachable hosts such as `host.docker.internal` for services on the host. Browser-facing `NEXT_PUBLIC_*` URLs must be reachable from the browser; internal server URLs use Compose service names. CMS uploads persist in the development Compose volume.

Production: set `BACKEND_ENV_FILE`, `PUBLIC_WEB_ENV_FILE`, `API_ENV_FILE`, and `CMS_ENV_FILE` to absolute paths to production environment files. Export the storefront's `NEXT_PUBLIC_*` build variables separately, then run `docker compose -f infra/compose.prod.yaml up --build -d`. Run Medusa migrations before starting or updating the backend with `docker compose -f infra/compose.prod.yaml run --rm backend /app/node_modules/.bin/medusa db:migrate`. Production CMS uploads persist in its own Compose volume; back up that volume and the external databases.

## Related Files
- Dockerfile
- infra/compose.dev.yaml
- infra/compose.prod.yaml
- infra/Dockerfile.backend
- infra/compose.yaml
- docs/prds/README.md
- AGENTS.md

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
