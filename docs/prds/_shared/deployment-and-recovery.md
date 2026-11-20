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

Build each image from the repository root with `docker build --target backend -t tcg-backend .`, replacing `backend` with `public-web`, `web`, `api`, or `cms` for the other targets. The images listen on ports 9000, 3000, 80, 3333, and 1337 respectively. Provide each app's runtime environment with an environment file or deployment secrets; databases and Redis are external. Run Medusa migrations separately before starting an updated service; Strapi runs its internal migrations on startup. Medusa also requires `VITE_CARD_CATALOG_URL` and `VITE_CARD_CATALOG_API_KEY` at runtime.

The storefront embeds public configuration at build time. Pass `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_DEFAULT_REGION`, and `NEXT_PUBLIC_APP_URL` using `--build-arg` as needed. Collector web embeds `VITE_API_URL` and `VITE_PUBLIC_WEB_URL`; never pass secrets as Vite build arguments. Keep server-only tokens and secrets in runtime environment variables, not build arguments.

Mount persistent storage at `/app/public/uploads` for CMS uploads when using local file storage. Use external persistent storage for any CMS database or uploaded files required across deployments.

## Compose environments

Development: `docker compose -f infra/compose.dev.yaml up --build`. All five services share the `dev` Dockerfile target and run each app's dev script with hot reload; collector web runs Vite on port 5173. The repository is bind-mounted into `/workspace`; container `node_modules` and build directories are masked by anonymous volumes, so after dependency or lockfile changes run `docker compose -f infra/compose.dev.yaml up --build -V`. Each server reads its matching environment file. Compose passes `VITE_API_URL` and `VITE_PUBLIC_WEB_URL` to collector web, defaulting to `http://localhost:3333/api/v1` and `http://localhost:3000`; override through `infra/.env` or the shell. Use `NODE_ENV=development` and bind servers to `HOST=0.0.0.0`. Set backend `PORT=9000`, `HMR_PORT=24678`, `HMR_BIND_HOST=0.0.0.0`, and `VITE_CARD_CATALOG_URL=http://api:3333/api/v1/internal/card-catalog`; API `PORT=3333` and `MEDUSA_INTERNAL_URL=http://backend:9000`; CMS `PORT=1337` and `MEDUSA_BACKEND_URL=http://backend:9000`; public-web `API_URL=http://api:3333/api/v1` for Next server requests plus browser-facing `NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1`. Keep the local API session cookie host-only (`SESSION_COOKIE_DOMAIN` empty); allow browser origins `http://localhost:3000` and `http://localhost:5173` in `WEB_ORIGINS`. Run Medusa migrations separately: `docker compose -f infra/compose.dev.yaml run --rm backend pnpm medusa db:migrate`. The databases and Redis remain external: use container-reachable hosts such as `host.docker.internal` for services on the host. Browser-facing `NEXT_PUBLIC_*` and `VITE_*` URLs must be reachable from the browser; internal server URLs use Compose service names. CMS uploads persist in the development Compose volume.

### Production on a DigitalOcean Droplet

Use Docker Engine with the Compose plugin on the Droplet. Production Compose defaults to four runtime files under `infra/`: `.env.production.backend`, `.env.production.api`, `.env.production.cms`, and `.env.production.public-web`. Existing `BACKEND_ENV_FILE`, `API_ENV_FILE`, `CMS_ENV_FILE`, and `PUBLIC_WEB_ENV_FILE` overrides remain supported; relative paths resolve from `infra/`.

Production uses one Docker Hub image for all five services, with a separate container and runtime environment for each app. `Dockerfile` target `all-apps` combines the existing build outputs; `infra/compose.build.yaml` builds and tags it. `infra/compose.prod.yaml` only pulls and runs it. Databases and Redis are not included. The larger image couples all app releases to one tag.

Set `APP_IMAGE=YOUR_DOCKERHUB_USER/nextpull:RELEASE_TAG` in `infra/.env.production` on both the build machine and Droplet. Use a new immutable release tag for each build. Builds default to `linux/amd64` for an x86 Droplet, including when building on an ARM Mac; set `APP_PLATFORM=linux/arm64` only for an ARM deployment.

Provision the five env files securely on the Droplet. Keep the four existing service files separate; do not merge credentials or bake them into the image. The Droplet needs only `infra/compose.prod.yaml` and those env files, not the repository or build tools. Run commands below from the parent of `infra/`.

```bash
chmod 600 infra/.env.production infra/.env.production.backend infra/.env.production.api infra/.env.production.cms infra/.env.production.public-web
```

Edit all five files before starting containers. Replace `example.com` domains and supply database credentials, application secrets, integration credentials, and the Medusa publishable key. Blank values are intentionally not usable production credentials. Keep existing application keys when redeploying. Runtime files are ignored by Git and excluded from Docker build contexts. Single-quote literal secrets containing `$` to avoid Compose interpolation.

`infra/.env.production` supplies the public `NEXT_PUBLIC_*` and `VITE_*` build variables through the explicit `--env-file` option. The production Compose file also passes the storefront public values at runtime, so its server and browser use the same configuration. Rebuild frontend images after changing public variables. Never put private credentials in this public configuration file. The remaining files supply each service's runtime variables without sharing other services' secrets.

Use public HTTPS URLs for browser traffic. Configure DNS and a TLS reverse proxy to route the storefront to port 3000, collector app to 5173, API to 3333, commerce to 9000, and CMS to 1337. This change does not install a proxy or configure the Droplet firewall. Internal server calls use `http://api:3333` and `http://backend:9000`; `localhost` inside a container means that container. Keep CORS origins, OAuth redirect URLs, and cookie domain aligned with the actual public domains.

PostgreSQL and Redis remain external. Use hosts reachable from the Droplet containers. The CMS template supports database TLS and a CA certificate. **The current Medusa configuration explicitly disables PostgreSQL TLS, and the API database configuration exposes no TLS env option. DigitalOcean Managed PostgreSQL requires separate application TLS configuration before use; setting credentials alone does not resolve this.**

On the build machine, log into Docker Hub, build the combined image, and publish it. All public frontend build variables must be set before building. These values must match the runtime values on the Droplet. Runtime secrets are excluded from the build context, as are the local `next_pull` SSH key files.

```bash
docker login
docker compose --env-file infra/.env.production -f infra/compose.build.yaml build bundle
docker compose --env-file infra/.env.production -f infra/compose.build.yaml push bundle
```

Compose tags the build using `APP_IMAGE`; see [Docker's build reference](https://docs.docker.com/reference/cli/docker/compose/build/).

On the Droplet, use `docker login` if the repository is private. Validate configuration, pull the release, back up databases, run migrations, then start services:

```bash
docker compose --env-file infra/.env.production -f infra/compose.prod.yaml config --quiet
docker compose --env-file infra/.env.production -f infra/compose.prod.yaml pull
docker compose --env-file infra/.env.production -f infra/compose.prod.yaml run --rm backend /app/node_modules/.bin/medusa db:migrate
docker compose --env-file infra/.env.production -f infra/compose.prod.yaml run --rm api node ace migration:run --force
docker compose --env-file infra/.env.production -f infra/compose.prod.yaml up -d
```

For later releases, publish a new image tag, update `APP_IMAGE` on the Droplet, pull it, run required migrations, and run `up -d`. Do not use `up --build` on the Droplet. Roll back by restoring the previous image tag only when database migrations remain compatible. Back up databases before migrations. Strapi runs its internal migrations on startup. CMS uploads persist in the production Compose volume; back it up with the external databases. API filesystem uploads and background queue workers still require deployment-specific storage and worker setup; this environment change does not provision them.

Verification: both Compose configurations parse successfully and `docker compose --env-file infra/.env.production -f infra/compose.build.yaml build --check bundle` passes without warnings. This checks the Dockerfile configuration, not image compilation or runtime behavior. No full image build, registry push, migrations, application tests, or live Droplet deployment were performed.

## Related Files
- Dockerfile
- infra/compose.dev.yaml
- infra/compose.prod.yaml
- infra/compose.build.yaml
- infra/nginx.bundle.conf
- .dockerignore
- infra/.gitignore
- infra/nginx.web.conf
- docs/deployment/07-collector-frontend.md
- infra/Dockerfile.backend
- infra/compose.yaml
- docs/prds/README.md
- AGENTS.md

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
