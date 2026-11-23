# Deployment and database initialization

## UI Page Used
- N/A — shared guidance

## Backend API Route Used
- N/A — shared guidance

## Backend image

`infra/Dockerfile.backend` builds only `apps/backend` from the root workspace with the frozen pnpm lockfile. PostgreSQL and Redis remain external. Compose loads runtime configuration from the root `.env`; it adds no services, volumes, proxy, start command, or automatic migration.

Build: `docker compose -f infra/compose.yaml build backend`.

Migrate manually: `docker compose -f infra/compose.yaml run --rm backend pnpm exec medusa db:migrate`.

## Root Docker targets

Build each image from the repository root with `docker build --target backend -t tcg-backend .`, replacing `backend` with `public-web`, `web`, `api`, or `cms` for the other targets. The images listen on ports 9000, 3000, 80, 3333, and 1337 respectively. Provide each app's runtime environment with an environment file or deployment secrets; databases and Redis are external. Run Medusa migrations separately before starting an updated service; Strapi runs its internal migrations on startup. Medusa also requires `BACKEND_VITE_CARD_CATALOG_URL` and `BACKEND_VITE_CARD_CATALOG_API_KEY` at runtime.

The storefront embeds public configuration at build time. Pass `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_DEFAULT_REGION`, and `NEXT_PUBLIC_APP_URL` using `--build-arg` as needed. Collector web embeds `VITE_API_URL` and `VITE_PUBLIC_WEB_URL`; never pass secrets as Vite build arguments. Keep server-only tokens and secrets in runtime environment variables, not build arguments.

Mount persistent storage at `/app/public/uploads` for CMS uploads when using local file storage. Use external persistent storage for any CMS database or uploaded files required across deployments.

## Compose environments

Development: `docker compose --env-file .env -f infra/compose.dev.yaml up --build`. All services use the root `.env`; per-app infrastructure env files are no longer consumed. Compose overrides native `NODE_ENV`, `HOST`, and `PORT`, plus internal service URLs (`PUBLIC_WEB_API_URL`, `API_MEDUSA_INTERNAL_URL`, `BACKEND_VITE_CARD_CATALOG_URL`, and `CMS_MEDUSA_BACKEND_URL`) for its network. Choose browser-facing localhost URLs in the root file when running locally; the production domains are not automatically rewritten. Databases and Redis remain external. Use container-reachable database hosts. CMS uploads persist in the development volume. After lockfile changes use `up --build -V` to refresh anonymous dependency volumes.

Direct local scripts for API, Medusa, CMS, and MCP preload `../../.env` with Node's `--env-file-if-exists`; externally injected variables take precedence. Storefront scripts instead use `--import ./load-root-env.mjs`, which loads root `.env` through Node's `loadEnvFile` when present. This avoids passing `--env-file-if-exists` into Next.js worker `NODE_OPTIONS`, where Node rejects it. Missing root env files are expected in Docker builds; injected build arguments remain authoritative. Collector Vite uses the repository root as `envDir` and only exposes `VITE_*` variables to browsers. Mock API has no custom env reads. Run scripts through `pnpm --filter <package> ...` from the repository root. For a compiled API started from its build directory, load root env explicitly: `node --env-file=../../../.env bin/server.js`; deployed images use injected variables. Existing per-app env files are retained, but application settings now use root-prefixed names. Native framework controls such as `NODE_ENV`, `HOST`, and `PORT` remain unprefixed. API environment validation reads the repository root in source mode, including the root `.env.test` override for tests. Medusa Jest also resolves root env files. Test overrides must point to dedicated test services before integration tests are run. No tests were run during this migration.

## Single-container DigitalOcean App Platform deployment

### Outcome and scope

One published Node 24 image runs the existing Medusa, Next.js, AdonisJS, and Strapi production artifacts plus Nginx serving the collector SPA. The root Dockerfile reuses its existing per-app build stages and copies their outputs into a neutral Node 24 `bundle-runtime` through `all-apps` and `app-platform`; publishing separate intermediate images is unnecessary. Medusa is explicitly copied alongside the other apps, not inherited as the runtime base. The final command always launches the whole bundle. Dependency downloads use a manifest/lockfile-only `pnpm fetch` layer before source copying; per-app installation then runs offline. Source changes still rerun installation/linking and compilation, but do not invalidate the download layer. PostgreSQL and durable uploads remain external. The bundle runs its own temporary Redis on loopback port 6379. No cloud resources are created by this repository change.

### Requirements

GitHub Actions retains the existing Docker Hub publication flow: commit-SHA tags plus the rolling `latest` tag. Existing secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` remain in use. Repository variable `DOCKERHUB_IMAGE` overrides the default `5715/nextpull`. Keep the current App Platform image connection and deployment mechanism; no registry migration or DigitalOcean API token is required. The workflow uses the existing Compose build definition and frozen workspace lockfile. It never runs database migrations.

Set these GitHub repository variables before building: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_DEFAULT_REGION`, `NEXT_PUBLIC_APP_URL`, `VITE_API_URL`, and `VITE_PUBLIC_WEB_URL`. They are public build inputs. Private tokens must never be added as build arguments. A frontend URL change requires a new image; runtime variables cannot rewrite already-built browser JavaScript.

Copy `.env.example` to `.env` only if no root `.env` exists. Preserve existing credentials and signing keys. The root file is ignored by Git and excluded from image builds. Keep permissions at `0600`. Local production Compose reads this file; App Platform does not read repository env files, so import the runtime values into the component settings and mark credentials as encrypted secrets.

Applications read root variable names directly:

| Application | Configuration names |
| --- | --- |
| Adonis API | `API_APP_KEY`, `API_DB_HOST`, `API_SESSION_DRIVER`, and other `API_*` keys |
| Medusa | `BACKEND_DATABASE_URL`, `BACKEND_JWT_SECRET`, and other `BACKEND_*` keys |
| Strapi | `CMS_DATABASE_HOST`, `CMS_JWT_SECRET`, and other `CMS_*` keys |
| Next storefront server | `PUBLIC_WEB_BETTER_AUTH_SECRET`, `PUBLIC_WEB_API_URL`, and other `PUBLIC_WEB_*` keys |
| Browser bundles | Existing `NEXT_PUBLIC_*` and `VITE_*` public names |
| Local MCP | `MCP_TCG_API_URL`, `MCP_MEDUSA_BACKEND_URL`, `MCP_MEDUSA_PUBLISHABLE_KEY`, `MCP_MEDUSA_REGION_ID` |

`infra/run-app.sh` filters other applications' namespaces but no longer strips prefixes. This is configuration isolation, not a security boundary between processes sharing one container and OS user. Medusa config bridges only framework-owned onboarding/MFA keys to their required native names. Strapi explicitly configures its JWT secret from `CMS_JWT_SECRET`. Adonis retains validation under the new `API_*` names. Native Node/Vite/framework controls keep their existing names; the production launcher fixes bind addresses and ports. Do not widen Vite's public prefix to include backend namespaces.

Integration values must agree: `API_SOCIAL_AUTH_BRIDGE_SECRET` equals `PUBLIC_WEB_SOCIAL_AUTH_BRIDGE_SECRET`; `API_MEDUSA_SERVICE_KEY` equals `BACKEND_NEXT_PULL_SERVICE_KEY`; and the card catalog key used by Medusa must match `API_CARD_CATALOG_API_KEY`. Keep the CMS sync token aligned with the receiving Strapi integration. Configure public HTTPS origins, OAuth callbacks, and cookies for the chosen domains. Leave `API_SESSION_COOKIE_DOMAIN` empty for a host-only API cookie unless cross-subdomain cookies are explicitly needed.

Internal server URLs use the same container's loopback network: `PUBLIC_WEB_API_URL=http://127.0.0.1:3333/api/v1`, `API_MEDUSA_INTERNAL_URL=http://127.0.0.1:9000`, `BACKEND_VITE_CARD_CATALOG_URL=http://127.0.0.1:3333/api/v1/internal/card-catalog`, and `CMS_MEDUSA_BACKEND_URL=http://127.0.0.1:9000`. Public browser URLs use HTTPS domains, never these loopback URLs. The bundle launcher sets both `BACKEND_REDIS_URL` and `BACKEND_EVENTS_REDIS_URL` to `redis://127.0.0.1:6379`, overriding stale deployment values. It starts Redis first, requires a successful PING before launching applications, and supervises Redis with the other processes. Port 6379 is bound to loopback only and is not exposed through Nginx.

### Initial deployment

1. Retain the existing Docker Hub secrets and repository setting. Configure public build variables and run the workflow to publish the updated image.
2. Use `.do/app.yaml` as a reference for the existing app: domains, port 8080, environment keys, and health check. Do not replace the existing app wholesale. Match its image repository to the workflow. For a new app, customize region and instance size; the 4 GB size is a starting allocation, not a measured capacity guarantee.
3. Add all runtime values from the root environment to the existing App Platform component before deploying. Retain its Docker Hub connection and registry credentials. Leave Run Command unset so the image command starts the entire bundle.
4. Set five distinct bare hostnames: `STOREFRONT_DOMAIN`, `COLLECTOR_DOMAIN`, `API_DOMAIN`, `MEDUSA_DOMAIN`, and `CMS_DOMAIN`. Register all five domains on the app. Follow DigitalOcean's DNS records and certificate verification instructions. Every domain routes to the same component; Nginx uses the incoming Host header.
5. Back up databases and run required migrations separately before accepting traffic. Strapi runs its internal migrations on startup.

App Platform pulls the finished image; it does not rebuild it. The user reports that the existing deployment already pulls the image published by the old workflow; preserve that setup. The reference spec does not add the DOCR-only `deploy_on_push` setting to a Docker Hub source. The existing deployment trigger was not inspected or changed. Do not add a GitHub source to the same component. Use a SHA tag when pinning a release or rolling back. Schema compatibility still determines whether an image rollback is safe.

The existing Bash supervisor and Tini start Redis, all four servers, the readiness service, and Nginx. Any child exit stops the group with a failure status so App Platform can restart it. Shutdown signals reach each process group. Medusa, storefront, API, and CMS output is streamed to container logs with `[MEDUSA]`, `[STOREFRONT]`, `[API]`, and `[CMS]` line prefixes. All apps share memory, CPU, deployments, and scaling. Nginx exposes port 8080; internal app ports are 3000, 3333, 9000, and 1337. The default App Platform domain serves the storefront. Forwarded HTTPS assumes DigitalOcean terminates TLS.

### Local production commands

```bash
docker compose --env-file .env -f infra/compose.build.yaml build bundle
docker compose --env-file .env -f infra/compose.prod.yaml up -d
```

Set `APP_IMAGE` to the desired registry image/tag first. To use a published image, run `pull` before `up`. Local production Compose keeps CMS uploads in a named volume; this volume is not available on App Platform.

For one-off migrations using the same isolated variables:

```bash
docker compose --env-file .env -f infra/compose.prod.yaml run --rm --workdir /app/.medusa/server bundle /usr/local/bin/run-app BACKEND /app/node_modules/.bin/medusa db:migrate
docker compose --env-file .env -f infra/compose.prod.yaml run --rm --workdir /srv/api bundle /usr/local/bin/run-app API node ace migration:run --force
```

Inside an App Platform console use the corresponding `run-app` command from the same working directory. Do not run migrations concurrently on multiple instances.

### Storage and database limitations

App Platform container filesystems are ephemeral. External PostgreSQL must be reachable from the component; do not use Compose service names or localhost for it. Bundle Redis runs without snapshots or AOF persistence: replacement/restart loses sessions, cache, queued events, and locks stored there. Keep one App Platform instance; independent container-local Redis instances cannot coordinate shared jobs or locks. Move Redis to durable external infrastructure before scaling or requiring retained queued jobs. Standalone app images and development Compose still require their own reachable Redis. Configure external upload storage before relying on uploaded files. Current API `DRIVE_DISK=fs` and default Strapi local uploads do not survive replacement. This change does not install storage providers or start an Adonis background queue worker.

The current Medusa PostgreSQL connection enables TLS with certificate verification disabled. Adonis database configuration has no TLS option; a managed PostgreSQL connection requiring TLS needs a separate application configuration change. Strapi already accepts database TLS/CA variables. Root environment migration does not resolve those existing database limitations.

### Acceptance and verification

Static checks cover shell and JavaScript syntax, Compose configuration, environment-key uniqueness, and diff whitespace. The root-name migration passed typechecks for API, Medusa, CMS, storefront, collector, and MCP; a configuration self-check confirmed namespace filtering keeps original root names. Application tests were not run for that migration. The focused `infra/verify-bundle.py` check uses the actual `bundle-runtime` image and launcher with fixture HTTP servers, not production applications or credentials. Run `docker build --target bundle-runtime -t tcg-bundle-runtime:audit .` followed by `python3 infra/verify-bundle.py` to verify routing, readiness failure/recovery, crashes, and shutdown. Verified locally on Linux ARM64: the shared runtime image builds; all five hostname routes pass; an unresponsive app makes readiness return 503 and recovery restores 200; each of the four server exits and Nginx exit stop the container with status 1; graceful shutdown exits 0 and terminates descendant processes. These checks use fixtures, so a full application image build, registry publication, migrations, and cloud deployment remain separate verification steps.

After deployment, visit all five domains and verify the intended application, authentication redirects, CORS, and API access. Inspect logs for all four servers. `/healthz` proxies to a loopback-only readiness service on port 8081. It checks storefront `/`, API `/`, Medusa `/health`, and Strapi `/_health` concurrently with three-second deadlines. A Redis PING with a two-second timeout is also required. Connection failures, timeouts, and HTTP 5xx produce 503; responding 4xx are accepted because the API root may legitimately return 404. This checks HTTP responsiveness, not database correctness or authenticated business flows. Confirm those separately before accepting production traffic. Check external storage persistence across a replacement deployment.

References: [DigitalOcean app specification](https://docs.digitalocean.com/products/app-platform/reference/app-spec/) and [domain setup](https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/).

The Redis addition was checked for shell/JavaScript/Python syntax and Compose validity. The fixture script now includes Redis startup and exit assertions; it has not been rerun for this change. Previous lifecycle results above predate bundled Redis.

## Related Files
- apps/api/start/env.ts
- apps/api/package.json
- apps/backend/medusa-config.ts
- apps/backend/package.json
- apps/cms/config
- apps/cms/package.json
- apps/public-web/load-root-env.mjs
- apps/public-web/package.json
- apps/mcp/package.json
- apps/mcp/README.md
- apps/web/vite.config.ts
- .env.example
- .do/app.yaml
- infra/run-app.sh
- infra/bundle-readiness.mjs
- infra/verify-bundle.py
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
