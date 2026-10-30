# Local-first Docker and AWS implementation guide

> **Read this first:** the local-first walkthrough below is the primary implementation sequence. The AWS sections that follow explain production changes. The examples are unverified starting points: the Docker daemon was inaccessible while this guide was written, so no image build, service startup, migration or persistence test has been claimed successful. Follow each gate and fix actual failures before moving on. No existing Docker or application files were changed by writing this guide.

## Local-first walkthrough

### 0. Inventory and prerequisites

Run these commands from the repository root in PowerShell:

```powershell
Set-Location D:\Work\mine\tcg_community
git status --short
Get-ChildItem docker -Force
Get-Content package.json
Get-Content apps/backend/package.json
Get-Content apps/cms/package.json
node --version
pnpm --version
docker compose version
docker info
```

Your existing `docker/` files and `apps/cms` are user work. Save a copy or commit your own work before changing them; do not blindly overwrite them. At the time of inspection, `compose.local.yaml` only starts DB/Redis; `compose.yaml` has production image placeholders; API/Medusa Dockerfiles run unfrozen `npm install`; `Dockerfile.cms` lacks workspace metadata and contains `--filer`; `Dockerfile.strapi` expects a nonexistent per-app npm lockfile; Next requests standalone output that is not enabled. Strapi 5.60 exists but has no editorial schemas. Verify these facts again because files may change.

Root `package.json` pins pnpm 11.24.0; Medusa declares 12.15.0. Choose **11.24.0 at the workspace root** for the following examples, remove or align Medusa's conflicting `packageManager` only after confirming compatibility, and review the root lockfile after any dependency change. The workspace has **one root `pnpm-lock.yaml`**, not per-app lockfiles. Run:

```powershell
corepack enable
corepack prepare pnpm@11.24.0 --activate
pnpm --version
pnpm install --frozen-lockfile
```

Expected: Node 24, the selected pnpm version, Docker daemon accessible and a successful frozen install. If pnpm reports an out-of-date lockfile, compare the error's importer with its manifest, intentionally update the root lockfile using the chosen pnpm version, review the diff, then retry frozen install. Do not delete a lockfile or use npm in an app runtime to bypass this. Docker Desktop must run before continuing. Network downloads and native-module toolchains are required.

### 1. Build context and workspace configuration

Create or merge this root `.dockerignore`, keeping any existing needed exclusions:

```dockerignore
.git
**/node_modules
**/.env
**/.env.*
!**/.env.example
!**/.env.template
docker/secrets
docker/env
**/build
**/dist
**/.next
**/.medusa
**/coverage
apps/api/storage
apps/backend/static
apps/cms/public/uploads
*.dump
*.pem
```

Do not exclude `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, package manifests or source. Ensure `docker/env/` and `docker/secrets/` are ignored by Git, and never paste production credentials into them or build arguments. If Medusa requires checked-in assets under `static`, separate those assets from uploaded files before excluding the directory.

Edit `apps/public-web/next.config.ts` by retaining `transpilePackages` and adding `output: 'standalone'` and `outputFileTracingRoot` pointing two directories up to the repository root. Example for its current TypeScript configuration:

```ts
import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
  transpilePackages: [
    '@tcg/api-contracts', '@tcg/auth-client', '@tcg/design-tokens',
    '@tcg/ui-web', '@tcg/locale',
  ],
}
export default nextConfig
```

This assumes Next builds with `apps/public-web` as its working directory. Verify the trace and `server.js` path when you build. Expected: no secret appears in `git status`, and Next's build traces the shared workspace packages.

### 2. Image definitions — candidate templates, test before use

These multi-stage examples deliberately use the workspace root lockfile in the build. The `pnpm deploy --legacy` packaging strategy, generated Adonis/Medusa paths, production dependencies, native modules and Strapi admin files have **not** been tested here. They are explicit hypotheses to validate—not a guarantee the commands will work. If a service needs files absent from its deployed package, inspect its generated manifest and trace, adjust the corresponding Dockerfile, and repeat the image test. Do not replace the final stage with an unfrozen npm install. All four use the same image for local and production.

Replace the content of `docker/Dockerfile.api` only after saving your current version:

```dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /src
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @tcg/api build
RUN pnpm --filter @tcg/api --prod deploy --legacy /out
RUN cp -a /src/apps/api/build/. /out/
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /out/ ./
RUN mkdir -p /app/storage && chown node:node /app/storage
USER node
EXPOSE 3333
CMD ["node", "bin/server.js"]
```

Replace `docker/Dockerfile.medusa`:

```dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /src
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @tcg/backend build
RUN pnpm --filter @tcg/backend --prod deploy --legacy /out
RUN cp -a /src/apps/backend/.medusa/server/. /out/
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /out/ ./
RUN mkdir -p /app/static && chown node:node /app/static
USER node
EXPOSE 9000
CMD ["node", "node_modules/@medusajs/medusa/cli.js", "start"]
```

The Medusa CLI entrypoint above is **unverified**: inspect `/out/package.json` and the installed package's actual `bin` before using it; change `CMD` to the confirmed generated-server start command. Confirm the static file provider's real path, admin output and migration CLI. Merging build output over a deployed manifest can change dependencies; verify with a clean container and the root lockfile. If `pnpm deploy` cannot package these generated applications reproducibly, stop and resolve the package/output layout before production.

Replace `docker/Dockerfile.cms`:

```dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /src
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production
RUN pnpm --filter @tcg/cms build
RUN pnpm --filter @tcg/cms --prod deploy --legacy /out
RUN cp -a /src/apps/cms/dist /out/dist
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=1337
COPY --from=build --chown=node:node /out/ ./
RUN mkdir -p /app/public/uploads && chown -R node:node /app/public
USER node
EXPOSE 1337
CMD ["node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
```

Verify the Strapi CLI bin, build output and all admin/config/schema assets after scaffolding. `pnpm deploy` file selection can omit files; include them explicitly as needed. Preserve `Dockerfile.strapi` until you decide what to do with your existing file; it is not used below.

Replace `docker/Dockerfile.public-web`:

```dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /src
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
RUN pnpm --filter @tcg/public-web build
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /src/apps/public-web/.next/standalone/ ./
COPY --from=build --chown=node:node /src/apps/public-web/.next/static/ ./apps/public-web/.next/static/
COPY --from=build --chown=node:node /src/apps/public-web/public/ ./apps/public-web/public/
USER node
EXPOSE 3000
CMD ["node", "apps/public-web/server.js"]
```

Verify the standalone directory contains `apps/public-web/server.js`; Next traces can omit dynamically loaded workspace assets. Build-time `NEXT_PUBLIC_*` values are public and require rebuilding for production. Do not put secrets in `ARG` or `ENV`.

Build each candidate individually from the root once the Compose file and public env below exist:

```powershell
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml build api
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml build medusa
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml build cms
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml build public-web
```

Expected: four images build from the **root** lockfile. Inspect generated output and image entrypoints; fix build errors before continuing. A successful build alone does not validate runtime.

### 3. Local configuration files

Create `docker/env/local-build.env` containing **public values only**. Obtain a Medusa publishable API key after seeding/configuring a local store; the placeholder will not authorize catalog requests until replaced and the storefront rebuilt:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:5173
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=replace-with-local-publishable-key
```

Create `docker/env/api.env` (the values are for a disposable local environment; TextBee calls must remain disabled or mocked):

```dotenv
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
LOG_LEVEL=info
APP_KEY=local-only-32-character-app-key-value
APP_URL=http://localhost:3333
WEB_ORIGINS=http://localhost:3000,http://localhost:5173
SESSION_DRIVER=cookie
DB_HOST=db
DB_PORT=5432
DB_USER=tcg_api
DB_PASSWORD=local-api-password
DB_DATABASE=tcg_api
TEXT_BEE_API_KEY=local-not-a-real-key
TEXT_BEE_DEVICE_ID=local-not-a-real-device
COLLECTOR_DISK_ENABLED=true
SWAPS_ENABLED=false
QUEUE_DRIVER=database
DRIVE_DISK=fs
MEDUSA_INTERNAL_URL=http://medusa:9000
MEDUSA_SERVICE_KEY=local-service-key-change-me
```

Create `docker/env/medusa.env`:

```dotenv
NODE_ENV=production
DATABASE_URL=postgres://tcg_medusa:local-medusa-password@db:5432/tcg_medusa
STORE_CORS=http://localhost:3000,http://localhost:5173
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3000,http://localhost:9000
JWT_SECRET=local-jwt-secret-change-me
COOKIE_SECRET=local-cookie-secret-change-me
NEXT_PULL_SERVICE_KEY=local-service-key-change-me
REDIS_URL=redis://redis:6379
CACHE_REDIS_URL=redis://redis:6379
LOCKING_REDIS_URL=redis://redis:6379
```

Create `docker/env/cms.env`; use freshly generated local secrets if Strapi rejects any sample format. Never reuse them in production:

```dotenv
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
APP_KEYS=local-key-one-1234567890,local-key-two-1234567890
API_TOKEN_SALT=local-api-token-salt-1234567890
ADMIN_JWT_SECRET=local-admin-jwt-secret-1234567890
TRANSFER_TOKEN_SALT=local-transfer-token-salt-1234567890
JWT_SECRET=local-cms-jwt-secret-1234567890
ENCRYPTION_KEY=local-encryption-key-123456789012
DATABASE_CLIENT=postgres
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=tcg_strapi
DATABASE_USERNAME=tcg_strapi
DATABASE_PASSWORD=local-strapi-password
DATABASE_SSL=false
```

Create `docker/env/public-web.env`:

```dotenv
NODE_ENV=production
API_URL=http://api:3333/api/v1
MEDUSA_BACKEND_URL=http://medusa:9000
MEDUSA_PUBLISHABLE_KEY=replace-with-local-publishable-key
AUTH_COOKIE_NAME=replace-with-actual-cookie-name
STRAPI_URL=http://cms:1337
```

`AUTH_COOKIE_NAME` must match the actual login cookie; inspect the authentication configuration rather than assuming the placeholder. `STRAPI_URL` does nothing until the storefront CMS client is implemented. Your `apps/cms/config/database.ts` already supports PostgreSQL fields above; inspect its SSL behavior before production. Compose `env_file` variables go into the container; `--env-file local-build.env` separately provides Compose interpolation and build arguments. Do not commit either file.

### 4. Local Compose, proxy and databases

Create `docker/compose.full-local.yaml`. It is separate from your existing files and uses Docker DNS names for internal traffic. The browser reaches localhost ports; the proxy is a local integration route. This example is **unvalidated** until you run `config --quiet` and build/start it.

```yaml
services:
  db:
    image: postgres:16
    environment: {POSTGRES_USER: postgres, POSTGRES_PASSWORD: local-only-password}
    ports: ["127.0.0.1:5432:5432"]
    volumes: ["local_pg:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 10
  redis:
    image: redis:7.4
    ports: ["127.0.0.1:6379:6379"]
    command: ["redis-server", "--appendonly", "yes", "--maxmemory-policy", "noeviction"]
    volumes: ["local_redis:/data"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10
  api:
    build: {context: .., dockerfile: docker/Dockerfile.api}
    image: tcg-api:local
    env_file: ./env/api.env
    ports: ["127.0.0.1:3333:3333"]
    volumes: ["api_uploads:/app/storage"]
    depends_on: {db: {condition: service_healthy}}
  worker:
    image: tcg-api:local
    env_file: ./env/api.env
    command: ["node", "ace.js", "queue:work"]
    volumes: ["api_uploads:/app/storage"]
    depends_on: {db: {condition: service_healthy}}
  medusa:
    build: {context: .., dockerfile: docker/Dockerfile.medusa}
    image: tcg-medusa:local
    env_file: ./env/medusa.env
    ports: ["127.0.0.1:9000:9000"]
    volumes: ["medusa_uploads:/app/static"]
    depends_on: {db: {condition: service_healthy}, redis: {condition: service_healthy}}
  cms:
    build: {context: .., dockerfile: docker/Dockerfile.cms}
    image: tcg-cms:local
    env_file: ./env/cms.env
    ports: ["127.0.0.1:1337:1337"]
    volumes: ["cms_uploads:/app/public/uploads"]
    depends_on: {db: {condition: service_healthy}}
  public-web:
    build:
      context: ..
      dockerfile: docker/Dockerfile.public-web
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:?missing API URL}
        NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:?missing app URL}
        NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL:?missing Medusa URL}
        NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:?missing publishable key}
    image: tcg-public-web:local
    env_file: ./env/public-web.env
    ports: ["127.0.0.1:3000:3000"]
  proxy:
    image: caddy:2
    ports: ["127.0.0.1:8080:80"]
    volumes: ["./Caddyfile.local:/etc/caddy/Caddyfile:ro"]
volumes:
  local_pg:
  local_redis:
  api_uploads:
  medusa_uploads:
  cms_uploads:
```

Create `docker/Caddyfile.local`:

```caddyfile
http://:80 {
  reverse_proxy public-web:3000
}
```

This proxy only exercises the storefront route; direct localhost ports are exposed for local API/admin testing. The local HTTP URLs do **not** validate production HTTPS, secure cookie domains, or AWS networking. For an end-to-end production-like routing test, add local hostnames and corresponding Caddy routes, then update both public build URLs and CORS consistently.

Start infrastructure first:

```powershell
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml config --quiet
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml up -d db redis
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml ps
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml exec redis redis-cli ping
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml exec -it db psql -U postgres -d postgres
```

Expected: DB is healthy; Redis prints `PONG`; psql opens. In psql paste the following **local-only** initialization, then exit with `\q`:

```sql
CREATE ROLE tcg_api LOGIN PASSWORD 'local-api-password';
CREATE DATABASE tcg_api OWNER tcg_api;
CREATE ROLE tcg_medusa LOGIN PASSWORD 'local-medusa-password';
CREATE DATABASE tcg_medusa OWNER tcg_medusa;
CREATE ROLE tcg_strapi LOGIN PASSWORD 'local-strapi-password';
CREATE DATABASE tcg_strapi OWNER tcg_strapi;
\q
```

These commands only apply to a fresh local volume; do not run them a second time against existing roles or production. Do not remove existing volumes to fix an error without first identifying and backing up their data. Local credentials are intentionally disposable; production uses interactive password prompts or a secret manager.

### 5. Medusa providers, scheduler and CMS source changes

Edit `apps/backend/medusa-config.ts`: keep the current `projectConfig` and add the `modules` array in the later **ElastiCache and Medusa** section, which configures Redis event bus, workflow engine, cache and locking. Install missing matching Medusa 2.22.1 provider packages in the workspace and review `pnpm-lock.yaml` before a frozen install. Validate the actual provider exports and options. Local env uses `redis://redis:6379`; production uses authenticated TLS endpoints. Expected: Medusa starts without in-memory-provider fallback and can process an event/workflow.

Edit `apps/api/adonisrc.ts` by adding `() => import('#start/scheduler')` to `preloads`. Edit the existing schedule's cron expression in `apps/api/start/scheduler.ts` to `0 * * * *` and ensure a stable schedule identifier with the installed queue version's API. Check `node ace.js queue:work --help` and scheduler commands in the built image; registration may happen during more than HTTP startup, so verify idempotency. Expected: one hourly schedule, one worker and exactly one execution for one test trigger. See the later worker section and [Adonis queue docs](https://docs.adonisjs.com/guides/digging-deeper/queues).

Use the existing Strapi app in development mode to create Page, Banner and Article content types with draft/publish; commit its generated schemas. Configure published-only read permission or a restricted read-only token. Add a server-side Next client using `STRAPI_URL`, validate responses, and render a simple published page with a fallback. This requires application implementation; setting the environment variable alone does not integrate the CMS. Medusa remains authoritative for products/orders. Expected: draft is inaccessible to a public reader; published sample renders.

### 6. Build, migrate and start in order

The Compose file, all env files, database roles and source changes must exist first. Run the four `build` commands from step 2. Then inspect the actual commands in the built images:

```powershell
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml run --rm api node ace.js list
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml run --rm api node ace.js migration:run --help
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml run --rm api node ace.js queue:work --help
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml run --rm --entrypoint sh medusa -c "ls -la /app; cat /app/package.json"
```

If `ace.js`, Medusa's CLI or a package dependency is missing, repair the candidate image; do not proceed using an unverified entrypoint. Use the actual Medusa binary exposed by the generated runtime manifest to inspect `db:migrate --help`. Then run the verified Adonis migration and Medusa `db:migrate` once, for example **only if those entrypoints were confirmed**:

```powershell
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml run --rm api node ace.js migration:run
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml run --rm --entrypoint node medusa node_modules/@medusajs/medusa/cli.js db:migrate
```

Start the apps individually to isolate failures, then inspect logs:

```powershell
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml up -d api worker
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml up -d medusa
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml up -d cms
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml up -d public-web proxy
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml ps
docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml logs --tail=100 api worker medusa cms public-web proxy
```

Expected: each app remains running; migrations complete; worker connects; CMS creates its schema; `http://localhost:3000`, `http://localhost:8080`, `http://localhost:9000` and `http://localhost:1337/admin` respond. Query an actual API route configured in `apps/api/start/routes` rather than assuming `/health` exists. Medusa requires configured store, region and publishable key; create them using documented local setup, update both Medusa keys in env files, rebuild `public-web` and confirm catalog reads. Do not run demo seeders against production. Local Vite collector remains separate: set `VITE_API_URL=http://localhost:3333/api/v1`, `VITE_PUBLIC_WEB_URL=http://localhost:3000`, then `pnpm --filter @tcg/web dev`; build and deploy it to Pages for production.

### 7. Local verification and persistence

- **Images:** `docker compose ... exec api id` and equivalents show a non-root user; inspect actual image filesystem for required generated code, native dependencies and absence of `.env` files. The `...` stands for `--env-file docker/env/local-build.env -f docker/compose.full-local.yaml` in the commands above; type the full options rather than literal ellipses.
- **Data:** insert a disposable record, upload a sample through each app, then `docker compose --env-file docker/env/local-build.env -f docker/compose.full-local.yaml up -d --force-recreate api medusa cms`; verify records and uploads still exist. Confirm the actual Medusa file provider location, since `/app/static` is a hypothesis. Test volume ownership as the non-root user. A named volume survives container recreation, not `down -v` or host loss.
- **Jobs:** inspect `queue:scheduler:list` if supported by the installed version, trigger a safe test job, verify the worker log and database queue status, restart the worker and check retry and duplicate behavior. The in-memory scraper runner needs separate durable-queue implementation and idempotency testing.
- **CMS:** create draft and published sample content, verify only the published item is accessible to the intended public/read-only role, and verify Next renders it. Confirm CMS outage gives the intended fallback.
- **Failure:** stop local DB or Redis, check readiness/alerts and reject unsafe commerce operations, restart and check recovery. Test queue retries and duplicate event delivery. Do not infer AWS failover or durable-storage guarantees from local Docker behavior.
- **Recovery:** create local disposable DB dumps and upload copies, restore them to isolated test resources, and verify data. Record observations; never overwrite a live database or use `docker compose down -v` to clear an unknown volume.

Only after these gates pass should you publish immutable images and follow the AWS production sections below. Record actual image digests, versions, command corrections, output paths and failures in this guide or a release log.

### 8. Production parity and deployment gates

Use the same tested images on EC2, with production build-time public URLs. Replace local DB/Redis hostnames and dummy credentials with RDS and ElastiCache endpoints; production must configure verified TLS, restricted networking, real app secrets, CORS and secure cookies. Add an RDS CA read-only mount and code-level TLS configuration for the Adonis/Medusa/Strapi clients; the existing Adonis configuration does not do this yet. Use AWS security groups/private networking, managed backups and tested restoration. The later production Compose and AWS sections give the infrastructure configuration and cost checklist.

Local Redis 7.4 without auth and plain local PostgreSQL do not emulate ElastiCache TLS/auth, cluster mode, AWS IAM, failover, managed backup, RDS point-in-time restore or network latency. Test those separately in an isolated AWS environment. Confirm your complete EC2/RDS/ElastiCache/network/backup cost before purchase; it may exceed $35/month. Launching real orders additionally requires payment checkout, verified webhooks, idempotency, reconciliation and operational support.

---

The production reference below is a guide for **you to implement**. The workspace contains initial Compose, Dockerfile and Strapi files; production images, AWS resources and a tested integration have not been verified. Examples involving generated files, application configuration and container images are **untested templates**, not a ready-to-run release. Follow all verification gates before accepting orders. The other [deployment guides](README.md) contain useful background, but their PostgreSQL/Redis container and backup instructions describe the earlier architecture; where they conflict, this guide's production architecture takes precedence.

## 1. Architecture and budget

```text
LOCAL: browser -> app containers -> PostgreSQL container + Redis container
PRODUCTION:
  Browser -> Cloudflare Pages (collector static files)
  Browser -> Caddy on EC2 -> Next.js / Adonis / Medusa / Strapi containers
                              Adonis worker -> RDS PostgreSQL (3 databases)
                              Medusa -> RDS PostgreSQL + ElastiCache
  Uploads -> persistent storage / S3; backups -> independent AWS storage
```

Run the applications, worker and Caddy as separate containers on an EC2 instance. Run **RDS PostgreSQL and ElastiCache outside Docker**. Only ports 80/443 are public; RDS and cache use private subnets and security groups. Local PostgreSQL and Redis containers are development-only. RDS and ElastiCache being managed does not automatically make a Single-AZ setup highly available, and one EC2 host remains a failure point. Docker images/containers can be replaced without deleting a named volume, but volumes are not backups.

Target the prior **$35/month** initial ceiling, but do not assume EC2 + RDS + ElastiCache fit. On 30 October 2026, [AWS ElastiCache pricing](https://aws.amazon.com/elasticache/pricing/) advertises Valkey starting at $6/month, not a complete system price. New-account credits are temporary and eligibility-dependent. Use the [AWS Pricing Calculator](https://calculator.aws/) before purchasing: select region, EC2 instance and EBS size, IPv4, hours, RDS instance/Single-AZ or Multi-AZ, storage and backup retention, ElastiCache engine/node count or serverless usage, CloudWatch alarms/logs, S3, DNS, data transfer, VAT and credits expiry. Record estimated **post-credit** total and margin; include Pages and email costs. If above budget, increase budget or use managed PostgreSQL plus a separately persisted Redis container on the VPS as a deliberate compromise; test failure/recovery before orders.

Illustrative capacity only: 100 daily users × 40 requests / 86,400 ≈ 0.05 requests/sec average, 5× ≈ 0.25 peak; campaigns may exceed it. Twenty 1 MB uploads/day add ~0.6 GB/month before variants and backups. Replace assumptions with load tests, connection counts, cache memory, upload growth and recovery objectives. Measure the app host; do not assume an 8 GB machine or any specific AWS plan is sufficient.

## 2. Workspace, images and local configuration

The repo has **one root `pnpm-lock.yaml`** with importers for each app, not per-app pnpm lockfiles. Use root `pnpm-workspace.yaml`, `.npmrc`, manifests and the lockfile in a build context rooted at the repository. The root currently pins pnpm 11.24.0 and Node >=24, whereas `apps/backend/package.json` declares pnpm 12.15.0. Resolve/test the mismatch explicitly; use a single verified root version in CI. `pnpm install --frozen-lockfile` checks the root lock against the workspace manifests and fails if out of date or incompatible; it does not create per-app locks. Updating the lock is a deliberate source change followed by review, not a CI workaround.

The previous guide's app-stage `npm install` and Strapi `package-lock.json` assumptions were incorrect for this workspace. Build each image using the root lock; package only the app's production output and its complete runtime dependency closure. `pnpm deploy --prod` can be investigated for workspace packages, but its requirements and Medusa/Adonis generated manifests need to be verified for the pinned pnpm version; do not assume it works for generated directories or replace it with an unfrozen npm install. Next can use `output: 'standalone'` with monorepo `outputFileTracingRoot` and copied `public`/`.next/static`; inspect tracing output. See [Next standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output). The existing `apps/cms` is a workspace member; review the **root** lockfile when changing its dependencies. See [Strapi Docker](https://docs.strapi.io/cms/installation/docker).

Create `.dockerignore` excluding `.git`, `**/node_modules`, env/secret files, generated builds, uploads and backups, while retaining the root lockfile, workspace configuration and required source files. Build using `docker build -f docker/Dockerfile.api .` from the root. Multi-stage image targets must: install with the frozen root lock; build one service; assemble and test only its built artifacts plus production dependency closure; run as non-root; and create owned writable upload directories. Native modules need compatible build/runtime OS and architecture. Verify actual paths for `apps/api/build`, `.medusa/server`, Next standalone and Strapi outputs. Never copy the whole monorepo to the final runtime image or claim paths verified without running images.

**Implementation gate:** first run these commands from the workspace root and fix actual errors without concealing them:

```bash
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm --filter @tcg/api build
pnpm --filter @tcg/backend build
pnpm --filter @tcg/public-web build
```

After CMS creation, build it using its workspace filter. Test each image with no source-tree bind mounts, confirm `node` user, runtime dependencies, and working entrypoint. Record image digests and verify no secrets or development-only files were copied. Framework build-output packaging and pnpm deploy steps remain unresolved until tested; do not treat these notes as a complete Dockerfile recipe.

### Local PostgreSQL and Redis

Example `docker/compose.local.yaml` for development **only**. It is a standalone infrastructure file, not the production file. It publishes ports only on localhost; choose different local ports if occupied. Use disposable credentials; do not reuse production values.

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: local-only-password
    ports: ["127.0.0.1:5432:5432"]
    volumes: ["local_pg:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 10
  redis:
    image: redis:7.4
    ports: ["127.0.0.1:6379:6379"]
    volumes: ["local_redis:/data"]
    command: ["redis-server", "--appendonly", "yes"]
volumes:
  local_pg:
  local_redis:
```

Run `docker compose -f docker/compose.local.yaml config --quiet` then `docker compose -f docker/compose.local.yaml up -d`. Create the three local databases as in section 4. Containers on the same Compose network use `db:5432` and `redis:6379`; apps running directly on the host use `127.0.0.1`. Local unauthenticated Redis must never be exposed publicly. Named volumes survive normal container replacement; `docker compose down -v` removes them. Recreate a container and confirm test data persists. Local development TLS can differ, but production TLS validation is mandatory.

## 3. AWS networking and cost controls

Recommended baseline: app EC2 and both managed services in the same AWS region and VPC. Use private subnets for RDS/ElastiCache, private endpoints, and security groups permitting DB/cache connections **only from the EC2 app security group** on their required ports. Permit public 80/443 to EC2 and use SSM or restricted SSH for administration. Configure TLS end-to-end, private DNS, firewall and backups. ElastiCache Serverless requires TLS and cluster-aware compatibility; AWS documents [serverless cluster mode](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.corecomponents.html) and its ports. Do not assume a single Redis URL works with cluster mode or IAM token refresh.

If using a VPS outside AWS, plan a VPN/private connection into the VPC, latency, cross-provider transfer and VPN/network charges. RDS can be made public with tightly restricted source IP and verified TLS, but that increases exposure. AWS also offers [ElastiCache Serverless public endpoints](https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-elasticache-serverless-public-endpoints/) for specified Valkey versions using IAM/TLS; Medusa client compatibility and token refresh must be demonstrated first. Do not expose Redis to `0.0.0.0/0` or assume external access is automatic.

Enable AWS Budgets and billing alerts. A budget alert is **not** a hard spending cap. Estimate backup storage, logs, EC2 volumes, snapshots, inter-AZ transfer, public IPs and networking, not just instance rates. Choose an AWS region based on availability, latency and total cost, then confirm prices at checkout.

## 4. RDS PostgreSQL setup

1. Provision an RDS for PostgreSQL instance in private subnets, initially Single-AZ only if its outage risk is acceptable. Select a major version supported by all applications, enable encryption at rest, automated backups, deletion protection, monitoring and maintenance windows. Configure the security group to accept TCP 5432 from the app host security group only. The separate RDS instance protects data from an EC2/container replacement, but is not immune to deletion or regional failure.
2. From a secure admin client inside the VPC or through SSM, verify endpoint and CA. Download the current RDS CA bundle from AWS, provide it to each runtime container read-only and rotate it when AWS rotates certificates. Example for `psql` (password prompt, no secret in shell history):

```bash
PGSSLMODE=verify-full PGSSLROOTCERT=/path/to/rds-ca.pem \
  psql -h YOUR_RDS_ENDPOINT -U YOUR_RDS_ADMIN -d postgres
```

3. Inside `psql` create dedicated roles and databases with prompted passwords; this requires a role with appropriate RDS privileges:

```sql
CREATE ROLE tcg_api LOGIN;
\password tcg_api
CREATE DATABASE tcg_api OWNER tcg_api;
CREATE ROLE tcg_medusa LOGIN;
\password tcg_medusa
CREATE DATABASE tcg_medusa OWNER tcg_medusa;
CREATE ROLE tcg_strapi LOGIN;
\password tcg_strapi
CREATE DATABASE tcg_strapi OWNER tcg_strapi;
\q
```

Review default `PUBLIC` privileges and prevent cross-database access; test each application's role. RDS administrator is not the PostgreSQL OS superuser. Keep admin credentials out of app containers.
4. Implement SSL options **in each actual Node database client**, not merely `PGSSLMODE` in an env file: Adonis currently defines host/user/password in `apps/api/config/database.ts` with no TLS option. Add config using the RDS CA and `rejectUnauthorized: true`; use the genuine RDS endpoint as hostname. Configure Medusa's database driver options and Strapi's PostgreSQL SSL settings similarly for their pinned versions. Do not use `rejectUnauthorized: false`; `sslmode=verify-full` for `psql` is not proof that Node clients verify certificates. See [RDS SSL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html).
5. Set conservative per-process connection pools for API, worker, Medusa and Strapi. Add their maximum pools plus migration/admin connections and leave reserve under the instance's connection limit. Monitor connections and latency; RDS Proxy may add cost and needs compatibility testing.
6. Create and validate migrations once per release, as described below. Enable automated backups with retention matching the business's recovery-point objective; practice point-in-time restore to a **new isolated instance**, verify all three databases and reconnect test apps. RDS restores do not automatically restore Redis or uploaded media. Protect independent backups and reconcile orders with external payment systems after a restore.

## 5. ElastiCache and Medusa

Candidate initial production deployment: a **node-based, cluster-mode-disabled** ElastiCache for Redis OSS or compatible Valkey engine, private VPC access, in-transit TLS, authentication/ACL, encryption at rest where supported, backups and maintenance configured. Select a version/node type and retention only after testing against Medusa 2.22.1 and its Redis/BullMQ clients. A single node is not HA; Multi-AZ and replicas cost more and their failover/data-loss behavior must be measured.

Separate disposable cache from durable events/workflows/locks when budget permits. Avoid eviction of workflow/queue data; confirm the selected offering supports an appropriate `noeviction` policy and alert before memory is exhausted. Full memory can block writes and checkout flows. Do not assume serverless supports configurable eviction: AWS says serverless parameter settings are not modifiable. ElastiCache snapshot/replication alone is not a transactional guarantee across RDS and Redis. Choose a durability mode and backup/restore strategy meeting your RPO, test it, and reconcile orders, event delivery and idempotent retries after failure. See [ElastiCache configuration](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/RedisConfiguration.html).

Medusa currently has no Redis providers configured. Install matching Medusa 2.22.1 dependencies and merge the following into `apps/backend/medusa-config.ts`, retaining existing `projectConfig`:

```ts
modules: [
  { resolve: '@medusajs/medusa/caching', options: { providers: [{
    resolve: '@medusajs/caching-redis', id: 'caching-redis', is_default: true,
    options: { redisUrl: process.env.CACHE_REDIS_URL },
  }] } },
  { resolve: '@medusajs/medusa/event-bus-redis', options: { redisUrl: process.env.REDIS_URL } },
  { resolve: '@medusajs/medusa/workflow-engine-redis', options: { redis: { redisUrl: process.env.REDIS_URL } } },
  { resolve: '@medusajs/medusa/locking', options: { providers: [{
    resolve: '@medusajs/medusa/locking-redis', id: 'locking-redis', is_default: true,
    options: { redisUrl: process.env.LOCKING_REDIS_URL },
  }] } },
],
```

Use `rediss://` endpoints with authenticated ACL credentials in server-side secrets, and configure client TLS/CA/hostname validation as supported by the pinned providers; verify connections rather than assuming the URL alone configures everything. If IAM authentication is selected, implement and test token refresh in the actual clients; static env tokens expire. Confirm provider exports/options against installed 2.22.1 packages. The example follows [Medusa's deployment guide](https://docs.medusajs.com/learn/deployment/general). Exercise an event subscriber, workflow, concurrent locking and cache, restart/fail over the cache, and confirm retries/duplicate handling before taking orders. Alert on connectivity, memory, evictions, rejected writes, queue depth and backup failures.

## 6. Production app Compose and configuration

This example has **no PostgreSQL or Redis service**. It assumes tested images, protected env files, working endpoints and verified writable paths; it will not build the repository as-is. Pin exact image digests in a release. The worker command must be verified against the generated Adonis build. Create the files under `/opt/tcg`; use a real registry and replace every placeholder.

```yaml
  services:
    api:
      image: REGISTRY/tcg-api:RELEASE
      restart: unless-stopped
      env_file: ./secrets/api.env
      volumes: ["api_uploads:/app/storage", "./certs/rds-ca.pem:/run/certs/rds-ca.pem:ro"]
    worker:
      image: REGISTRY/tcg-api:RELEASE
      restart: unless-stopped
      env_file: ./secrets/api.env
      command: ["node", "ace.js", "queue:work"]
      volumes: ["api_uploads:/app/storage", "./certs/rds-ca.pem:/run/certs/rds-ca.pem:ro"]
    medusa:
      image: REGISTRY/tcg-medusa:RELEASE
      restart: unless-stopped
      env_file: ./secrets/medusa.env
      volumes: ["medusa_uploads:/app/static", "./certs/rds-ca.pem:/run/certs/rds-ca.pem:ro"]
    cms:
      image: REGISTRY/tcg-cms:RELEASE
      restart: unless-stopped
      env_file: ./secrets/cms.env
      volumes: ["cms_uploads:/app/public/uploads", "./certs/rds-ca.pem:/run/certs/rds-ca.pem:ro"]
    public-web:
      image: REGISTRY/tcg-public-web:RELEASE
      restart: unless-stopped
      env_file: ./secrets/public-web.env
    proxy:
      image: caddy:2
      restart: unless-stopped
      ports: ["80:80", "443:443"]
      volumes: ["./Caddyfile:/etc/caddy/Caddyfile:ro", "caddy_data:/data", "caddy_config:/config"]
  volumes:
    api_uploads:
    medusa_uploads:
    cms_uploads:
    caddy_data:
    caddy_config:
```

Only proxy publishes ports. Verify upload paths against each image and configure volume ownership for its non-root UID; initialize **only the specific empty volumes** if needed. Configure Caddy routing for `www`, `api`, `commerce`, `cms` to app ports 3000, 3333, 9000, 1337. Restrict Medusa and Strapi admin routes with a tested VPN or identity-aware proxy without blocking the storefront API; set trusted proxy, secure cookies and exact CORS origins. Persist Caddy certificate data. Use S3-compatible uploads in production when implemented, particularly before adding app replicas; verify private/public file access and backups. Local volumes are not shared across EC2 instances.

Production env files (mode 600, outside Git) use separate credentials. Values below are placeholders, not actual secrets:

```dotenv
# api.env (plus APP_KEY, APP_URL, WEB_ORIGINS, NODE_ENV, HOST, PORT,
# LOG_LEVEL, SESSION_DRIVER, TEXT_BEE_API_KEY, TEXT_BEE_DEVICE_ID and flags)
DB_HOST=YOUR_RDS_ENDPOINT
DB_PORT=5432
DB_DATABASE=tcg_api
DB_USER=tcg_api
DB_PASSWORD=REPLACE_FROM_SECRET_STORE
DB_CA_PATH=/run/certs/rds-ca.pem
QUEUE_DRIVER=database
DRIVE_DISK=fs

# medusa.env (plus DATABASE_URL, STORE_CORS, ADMIN_CORS, AUTH_CORS,
# JWT_SECRET, COOKIE_SECRET and NODE_ENV)
REDIS_URL=rediss://USER:URL_ENCODED_SECRET@YOUR_CACHE_ENDPOINT:6379
CACHE_REDIS_URL=rediss://USER:URL_ENCODED_SECRET@YOUR_CACHE_ENDPOINT:6379
LOCKING_REDIS_URL=rediss://USER:URL_ENCODED_SECRET@YOUR_CACHE_ENDPOINT:6379
```

`DB_CA_PATH` is an implementation placeholder, **not currently supported** by Adonis env validation: add and consume it, along with the SSL changes in section 4. Set Medusa `DATABASE_URL` with its own role, RDS endpoint and URL-encoded password, and explicitly wire verified TLS options. Set Strapi database host/user/password/CA in its version-specific config and `cms.env`. Match Adonis `MEDUSA_SERVICE_KEY` with Medusa `NEXT_PULL_SERVICE_KEY` for customer linking. Configure Next server-only `API_URL`, `MEDUSA_BACKEND_URL`, `STRAPI_URL` and optional restricted CMS token; build `NEXT_PUBLIC_*` with public values only. `VITE_*` values are public; never put a scraper secret there.

Do not rely on Compose `depends_on` for managed services. Implement app readiness checks that verify required dependencies, appropriate retry/backoff and alerts; do not serve checkout as healthy if durable Redis or PostgreSQL is unavailable. Configure log rotation, connection timeouts and pool limits. Validate with `docker compose -f /opt/tcg/compose.yaml config --quiet` after placeholder env files exist; it checks configuration, not connectivity or app readiness.

## 7. CMS, migrations and jobs

Create a pinned Strapi workspace app following [05 — Strapi](05-strapi.md), but use local PostgreSQL for development and RDS for production. Define Page, Banner and Article schemas in development, enable draft/publish and commit schema files; the content-type builder is not used to change production schemas. Add a server-only Next client using a limited read token or carefully scoped public reads, request published content only, validate responses and fail gracefully when CMS is unavailable. Medusa owns catalog and orders.

After images have been built and the databases and roles created, use one-off containers to inspect the actual generated CLIs:

```bash
docker compose -f /opt/tcg/compose.yaml run --rm api node ace.js migration:run --help
docker compose -f /opt/tcg/compose.yaml run --rm api node ace.js queue:work --help
```

Verify Medusa's installed `medusa db:migrate` command inside its runtime image; do not assume an npm/pnpm entrypoint exists. Run the confirmed Adonis and Medusa migrations once before starting a release; Strapi initializes/migrates its schema according to its pinned version. Take and test a backup before changing production schemas, use a deployment role with required permissions, and never seed demo data. Migrations may not be reversible by switching image tags.

Run one Adonis database queue worker using the same tested API image and `QUEUE_DRIVER=database`. The current `apps/api/start/scheduler.ts` is **not registered** in `adonisrc.ts`; its `*/60 * * * *` expression must also be replaced with a verified hourly schedule such as `0 * * * *`. Add scheduler registration using the installed queue version's documented preload lifecycle and a stable schedule ID; verify correct UTC/business timezone. Repeated starts must not create duplicates. Test job execution, restart, retries and alerting. The scraper runner currently holds job state in memory; move it to durable jobs and implement idempotency before claiming restart recovery.

## 8. Ordered implementation and release

1. **Local:** verify Node/pnpm and the root frozen lockfile; implement and test the app Dockerfiles. Start only the local DB/Redis Compose file, create test databases/roles, build images and run migrations. Use fake data and credentials. Test application startup without mounting the repository, then verify the actual runtime paths and non-root volume permissions.
2. **Local service tests:** test API authentication, CORS and worker; Medusa catalog, events, workflows and locks; CMS published/draft permissions; Next content and CMS failure fallback; uploads surviving container recreation. Simulate DB/cache outages and ensure readiness fails without silently losing commerce operations. Test retry/idempotency and volume restore.
3. **AWS cost and security:** complete the calculator worksheet in section 1, confirm actual price and quota in the chosen region, then provision EC2/VPC/RDS/ElastiCache with restricted access and backups. Make no assumptions about free credits, HA or engine compatibility. Configure alerts and confirm operator access without public database/cache ports.
4. **AWS integration:** configure RDS certificates and each client's TLS verification; test a valid connection and reject an invalid CA or hostname. Verify Redis TLS/authentication and test the actual Medusa provider stack, no-eviction behavior, backup/restore and failure handling. Confirm connection pool totals and alarms. Avoid logging credential-bearing URLs.
5. **Release:** build images in CI from the root lockfile with public build variables, run smoke tests, push immutable version tags/digests to a private registry, and record the prior release. Put Compose, Caddy, CA bundle and protected env files on EC2. Run `docker compose config --quiet`, pull images, take/verify backups, run migrations once, and start containers. Check HTTPS, admin restrictions, logs, job health, DB/cache and representative pages.
6. **Recover:** restore RDS to a new isolated instance at a chosen point in time; restore ElastiCache using the selected offering's documented process and restore app media separately. Start isolated test apps against restored services, verify order data, CMS, users and uploads, then measure RPO/RTO. An RDS restore and a cache snapshot are not a single transaction: reconcile events and orders with payment providers. Test regularly and after major changes. See [08 — backups](08-backups-recovery.md) for general backup principles; its Docker PostgreSQL steps are not the production method here.
7. **Rollback:** stop unsafe writes if needed, restore prior compatible image digests and confirm health. For incompatible schema changes, use the tested data restore and reconciliation process; an image rollback does not reverse migrations. Keep externally accessible deployment logs and runbooks.

Before real orders, separately implement and verify payment checkout, signed webhook handling, idempotent retries, stock control, refunds, email and order reconciliation. Load-test real traffic, worker scheduling, connection pools and cache memory. Protect all AWS credentials; enable MFA and least-privilege IAM, and keep secrets out of Git, public build arguments and logs.

## 9. Design diagnostic and expansion

**Diagnostic: 5/10 (4 of 8), prior to implementation.** Database scaling path, public caching strategy, monitoring plan and release/rollback approach are specified. The remaining checks are unmet or unverified: (1) confirm traffic, latency, availability and recovery requirements; (2) measure request rate/storage rather than relying on the illustrative estimate; (3) add a second app host and appropriate Multi-AZ managed configuration when cost and availability justify it; (4) prove queue/event durability, scheduling, retry and reconciliation through failure tests. The score is not an SLA.

As budget grows, move app media to object storage with tested permissions, consider RDS Multi-AZ/point-in-time recovery, separate durable Redis from disposable cache, deploy an additional app instance and load balancer, and scale workers only after shared sessions/locks/providers are tested. Keep the affordable fallback—RDS plus a separately persisted Redis container—as a documented cost/risk trade-off, with backups and the same compatibility/failure checks. Managed services reduce operations but do not remove responsibility for recovery, security, cost or correctness.

## 10. Verification status

This guide was checked against repository manifests/configuration and official documentation; the example Compose and application images were **not executed** in this revision. Strapi exists but editorial schemas and storefront integration remain to be implemented. Runtime packaging, Node TLS wiring, provider-specific Redis compatibility and generated CLI paths remain implementation tasks. A successful Compose parse would not prove connectivity, runtime health or disaster recovery. Complete and record the tests above before production.
