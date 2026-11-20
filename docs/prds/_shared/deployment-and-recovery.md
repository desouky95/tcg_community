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

Production uses one Docker Hub image for all five apps plus a Redis 7 service with AOF persistence in a named volume. Medusa uses the Compose Redis service by default for its event bus and locks; `REDIS_URL` and `EVENTS_REDIS_URL` can override it. Redis is internal to Compose and has a health check. Use the root `.env` as the single production configuration file. Compose passes flat DigitalOcean environment keys to each owning app; credentials are passed only to their owning service. No application source changes are required. Development Compose still uses its existing development env files.

Set `APP_IMAGE=YOUR_DOCKERHUB_USER/nextpull:RELEASE_TAG` in `.env`. Use immutable release tags. Builds default to `linux/amd64`; override `APP_PLATFORM` for an ARM Droplet.

The storefront build consumes `NEXT_PUBLIC_*` values, and collector builds consume `VITE_API_URL` and `VITE_PUBLIC_WEB_URL` directly from the root `.env` or GitHub Actions variables. These public names are also used by the storefront at runtime. Other `WEB_VITE_*` entries are not automatically embedded. Never pass private credentials as build arguments. Rebuild the image when public build values change.

Provision `/opt/tcg/.env` and `/opt/tcg/infra/compose.prod.yaml` on the Droplet. The root env file contains secrets: keep it ignored by Git, excluded from Docker contexts, and restricted with `chmod 600 .env`. Preserve application keys between deployments. The old per-app production files are no longer read by production Compose. Fill required production values before launch; configuration parsing does not validate application credentials.

GitHub Actions (`.github/workflows/deploy.yml`) only builds the combined image and pushes it to Docker Hub on pushes to `main` or manual dispatch. DigitalOcean owns deployment; the workflow does not use SSH or run migrations. Configure repository secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` (write access), and optionally repository variable `DOCKERHUB_IMAGE` without a tag. If unset or empty, the workflow publishes to `5715/nextpull`. Keep the existing `NEXT_PUBLIC_*` and `VITE_*` repository variables for public build configuration. The job passes them directly to Compose without needing a committed `.env`.

Each successful publication pushes the full Git commit SHA tag, then updates `latest`. Select `latest` in DigitalOcean for the rolling image, or a commit SHA for a pinned release. Existing `DEPLOY_*` secrets are unused and can be removed. Docker Hub publication itself does not trigger an App Platform redeployment; configure or initiate deployment through DigitalOcean. Runtime credentials belong in DigitalOcean's component settings (App Platform) or the root `.env` (Droplet).

Use public HTTPS URLs for browser traffic. Configure DNS and a TLS reverse proxy to route the storefront to port 3000, collector app to 5173, API to 3333, commerce to 9000, and CMS to 1337. This change does not install a proxy or configure the Droplet firewall. Internal server calls use `http://api:3333` and `http://backend:9000`; `localhost` inside a container means that container. Keep CORS origins, OAuth redirect URLs, and cookie domain aligned with the actual public domains.

PostgreSQL remains external. Use hosts reachable from the Droplet containers. Redis persists in the Compose `redis-data` volume; back it up when retaining event jobs matters. CMS configuration supports database TLS and a CA certificate. **The current Medusa configuration explicitly disables PostgreSQL TLS, and the API database configuration exposes no TLS env option. DigitalOcean Managed PostgreSQL requires separate application TLS configuration before use; setting credentials alone does not resolve this.**

On the build machine, log into Docker Hub, build the combined image, and publish it. All public frontend build variables must be set before building. These values must match the runtime values on the Droplet. Runtime secrets are excluded from the build context, as are the local `next_pull` SSH key files.

```bash
docker login
docker compose --env-file .env -f infra/compose.build.yaml build bundle
docker compose --env-file .env -f infra/compose.build.yaml push bundle
```

Compose tags the build using `APP_IMAGE`; see [Docker's build reference](https://docs.docker.com/reference/cli/docker/compose/build/).

On the Droplet, use `docker login` if the repository is private. Validate configuration, pull the release, back up databases, run migrations, then start services:

```bash
docker compose --env-file .env -f infra/compose.prod.yaml config --quiet
docker compose --env-file .env -f infra/compose.prod.yaml pull
docker compose --env-file .env -f infra/compose.prod.yaml run --rm backend /app/node_modules/.bin/medusa db:migrate
docker compose --env-file .env -f infra/compose.prod.yaml run --rm api node ace migration:run --force
docker compose --env-file .env -f infra/compose.prod.yaml up -d
```

For later releases, publish a new image tag, update `APP_IMAGE` on the Droplet, pull it, run required migrations, and run `up -d`. Do not use `up --build` on the Droplet. Roll back by restoring the previous image tag only when database migrations remain compatible. Back up databases before migrations. Strapi runs its internal migrations on startup. CMS uploads persist in the production Compose volume; back it up with the external databases. API filesystem uploads and background queue workers still require deployment-specific storage and worker setup; this environment change does not provision them.

Verification: both Compose configurations parse successfully and `docker compose --env-file .env -f infra/compose.build.yaml build --check bundle` passes without warnings. This checks the Dockerfile configuration, not image compilation or runtime behavior. No full image build, registry push, migrations, application tests, or live Droplet deployment were performed.

## Single-container DigitalOcean App Platform deployment

The `app-platform` Dockerfile target starts Medusa, Next.js, AdonisJS, Strapi, and Nginx together. `infra/compose.build.yaml` and the existing GitHub publication workflow now build this target. Production Compose continues to select individual commands, including an explicit Medusa command. A child process exit stops the entire App Platform container so the platform can restart it. All apps share scaling and restart behavior.

For Walrus-app, deploy the published image as one web service, clear any Run Command override, and set HTTP port to `8080`. Set `STOREFRONT_HOST`, `COLLECTOR_HOST`, `API_HOST`, `MEDUSA_HOST`, and `CMS_HOST` to distinct bare hostnames. Add all five domains to the app and route them to this same component, preserving the original Host header. Configure DNS using DigitalOcean's supplied records; DigitalOcean terminates HTTPS. Nginx routes by hostname to local ports 3000, 3333, 9000, and 1337, and serves the collector directly. The default App Platform hostname serves the storefront. The HTTPS forwarded-protocol setting assumes traffic arrives through DigitalOcean's TLS ingress.

Each process inherits the flat environment variables, with its own fixed PORT and bind address. Shared key names such as `JWT_SECRET` must be compatible across apps. Set `API_URL=http://127.0.0.1:3333/api/v1`, `MEDUSA_INTERNAL_URL=http://127.0.0.1:9000`, and browser-facing URLs to the appropriate HTTPS domains. Configure CORS, OAuth callbacks, and cookie domains accordingly. Public frontend configuration still requires a rebuild with the matching GitHub variables. Do not point browser traffic at localhost.

Set `REDIS_URL` to an external Redis service; `EVENTS_REDIS_URL` defaults to that URL. Compose's `redis` hostname and persistent volumes are unavailable in App Platform. Use external PostgreSQL and object storage for uploads; container filesystem data is lost on replacement. Database TLS requirements noted above still apply. This change does not configure upload providers, run migrations, or deploy Walrus-app.

Acceptance: after deployment, visit each domain, verify it reaches its intended app, and check container logs for all four application servers. Builds, process lifecycle behavior, and live routing have not been tested for this target.

## Related Files
- infra/start-app-platform.sh
- infra/nginx.app-platform.conf.template
- .github/workflows/deploy.yml
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
