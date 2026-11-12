# Four-service Docker stack

This stack runs the API, CMS, Medusa backend and public storefront. PostgreSQL and Redis are external; provide separate existing databases for the three server apps. Docker Desktop's `host.docker.internal` reaches services listening on the host. On Linux the Compose host-gateway mapping provides this name inside containers; make sure the external services accept connections from Docker's network. Never use `localhost` for an external service from inside a container.

## Configuration

From the repository root:

```sh
cp infra/.env.example infra/.env
for app in api cms backend public-web; do cp "infra/.env.$app.example" "infra/.env.$app"; done
```

Edit all five files. Generate unique secrets and supply database credentials, integration credentials, and a Medusa publishable key. Use the same social bridge secret in the API and storefront. Do not commit the resulting files. In production set `NODE_ENV=production` in each service environment file and use production secrets, TLS-enabled external services where appropriate, and real public origins. Choose `QUEUE_DRIVER=database` only after setting up the relevant tables and worker; `sync` is suitable for local use.

The Next.js `NEXT_PUBLIC_*` values are embedded at build time. Set identical values in `infra/.env` and `infra/.env.public-web`; rebuild the image whenever these change. Some storefront server-rendered requests use the same public CMS and Medusa URLs as the browser. Those URLs must resolve and route to the stack from both locations. The examples use `host.docker.internal`, which Docker resolves inside the container; configure that name on the browser's machine if it does not resolve there, or use a shared DNS name/reverse proxy. Update CORS, OAuth callback URLs and origins to match. `NEXT_PUBLIC_APP_URL` points to the separately hosted collector app, not this storefront.

## Run

```sh
# Development, source changes in mounted app directories reload in the container
docker compose --env-file infra/.env -f infra/compose.yaml -f infra/compose.dev.yaml up --build
# Production image build and startup
docker compose --env-file infra/.env -f infra/compose.yaml -f infra/compose.prod.yaml up --build -d
```

The default host ports are 3333, 1337, 9000 and 3000. Change the corresponding `*_PORT` variables in `infra/.env` if needed, and update the URLs and CORS settings accordingly. Install/dependency and configuration changes outside mounted source directories require rebuilding. Development mounts do not replace container dependencies; the storefront's Next cache uses a named volume.

## Database and storage

Create the external databases and run migrations explicitly before accepting traffic. For example, after configuring the external database and environment files:

```sh
docker compose --env-file infra/.env -f infra/compose.yaml -f infra/compose.dev.yaml run --rm api node ace migration:run --force
docker compose --env-file infra/.env -f infra/compose.yaml -f infra/compose.dev.yaml run --rm backend pnpm exec medusa db:migrate
```

Strapi manages its schema at startup. Review migrations and back up databases before production changes. These commands target the configured databases, including external ones. API storage, CMS uploads and Medusa local files use named volumes. Back up those volumes separately from databases; `docker compose down -v` deletes them.

## Diagnostics

Use the same Compose file arguments as the selected mode with `config --quiet`, `ps`, and `logs -f SERVICE`. Check database and Redis reachability from the Docker network, application secrets, public URL resolution, and CORS when a service cannot start or a browser request fails. This setup does not provision a reverse proxy or TLS termination.
