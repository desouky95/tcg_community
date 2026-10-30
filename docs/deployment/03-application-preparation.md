# 03 — Application preparation

Prerequisites: server and DNS ready; local Node and pnpm versions compatible with the repo. This guide requires application development before deployment: no production images are supplied yet.

## Build images

Create and test a Dockerfile per service using the monorepo root as build context, the checked-in lockfile, and the versions in `package.json`. Build in CI, push versioned immutable tags to a private registry, and deploy those tags. Images must contain built workspace dependencies and production runtime dependencies; do not copy `.env`, secrets, or local uploads into images. Confirm the Adonis build's runtime directory and executable `ace.js`, Medusa's `.medusa/server` output and admin assets, Next's runtime dependencies, and Strapi's built admin before finalizing the images. Medusa's package and root specify different minimum Node versions: test a common supported version before choosing it.

Run locally first: `pnpm install --frozen-lockfile`, `pnpm --filter @tcg/api build`, `pnpm --filter @tcg/backend build`, and `pnpm --filter @tcg/public-web build`. Run the resulting images against a disposable PostgreSQL database and verify startup. Build Strapi after [05](05-strapi.md). Avoid `pnpm build` as a deployment shortcut: the workspace includes mock apps and other packages.

## Environment and persistence

Keep separate production env files on the server under `/opt/tcg/secrets`, owned by deploy with directory mode 700 and files mode 600. Never commit them. Use `openssl rand -hex 32` independently for each secret and retain an encrypted copy outside the VPS. Follow each framework's exact secret format requirements.

| Service | Required configuration |
| --- | --- |
| Adonis | `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=3333`, `LOG_LEVEL`, `APP_KEY`, `APP_URL`, `WEB_ORIGINS`, `SESSION_DRIVER=cookie`, `DB_HOST=db`, `DB_PORT=5432`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `QUEUE_DRIVER=database`, `DRIVE_DISK=fs`, `TEXT_BEE_API_KEY`, `TEXT_BEE_DEVICE_ID`, `COLLECTOR_DISK_ENABLED`; configure feature flags and optional service keys deliberately. The TextBee fields are required by current validation even if unused. |
| Medusa | `DATABASE_URL`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, unique `JWT_SECRET` and `COOKIE_SECRET`, and `NEXT_PULL_SERVICE_KEY` matching Adonis `MEDUSA_SERVICE_KEY` if the customer link is enabled. |
| Next | `API_URL` and `MEDUSA_BACKEND_URL` for server-side access; `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, and the Medusa publishable key for browser/build use; set `AUTH_COOKIE_NAME` to the actual auth cookie. Public variables are embedded at build time. |
| Strapi | PostgreSQL credentials, app/admin/API token secrets and its public URL; see guide 05. |

The API currently writes to its `storage` directory and Medusa has local `static` files. Mount these directories and Strapi's `public/uploads` on persistent volumes at the actual working paths inside each image. Verify by uploading a file, recreating the container, and reading it again. Volumes are not backups.

Run exactly one Adonis queue worker using the built image and database queue driver. Check supported commands with `node ace list` and `node ace queue:work --help` **inside the built image**, then configure the verified worker command with restart policy. The existing `start/scheduler.ts` is not registered in `adonisrc.ts`, and its cron expression must be verified; scheduling is not currently proven operational. Implement and test one scheduler registration process using the installed queue version, and ensure only one instance runs. Do not invent a scheduler command or start duplicate schedulers.

Verification: check startup and worker logs without printing secrets, and confirm a queued test job executes once after a container restart. If builds fail, fix dependency or runtime mismatches before going on; no guide can substitute for working images. Next: [PostgreSQL](04-postgresql.md).
