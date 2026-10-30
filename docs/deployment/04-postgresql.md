# 04 — PostgreSQL

Prerequisites: Docker and Compose installed; choose a supported PostgreSQL major version for all three apps and pin its image version. This example uses PostgreSQL 16; confirm compatibility before production. Never expose port 5432 publicly.

## Start and create databases

Create a protected `/opt/tcg/secrets/postgres.env` with `POSTGRES_USER=postgres` and a long random `POSTGRES_PASSWORD`. Configure the `db` Compose service with `image: postgres:16`, `env_file: ./secrets/postgres.env`, and `volumes: ["pg_data:/var/lib/postgresql/data"]`; define `pg_data` at the top level. Do not add `ports`. See the full topology in [06](06-deployment.md). Start only the database: `cd /opt/tcg && sudo docker compose up -d db`. Check `sudo docker compose logs --tail=50 db` and `sudo docker compose exec db pg_isready -U postgres`.

Create roles and databases interactively, so passwords are not stored in shell history. Use independently generated passwords and record them in your password manager:

```bash
sudo docker compose exec -it db psql -U postgres -d postgres
```

In `psql`, run the following; each `\password` prompts without echoing the password:

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

Set each app's own credentials in its protected env file. For Medusa, use `postgres://tcg_medusa:URL_ENCODED_PASSWORD@db:5432/tcg_medusa`; URL-encode special characters in URL passwords. Strapi uses separate DB fields. Test each app connects only to its own database; review PostgreSQL privileges and revoke unwanted public database access if necessary. Record PostgreSQL major version and roles for recovery.

## Migrations

With app images built and env files configured, run migrations as one-off containers on the Compose network before starting traffic. Check the built image commands with `node ace migration:run --help` for Adonis and the installed Medusa CLI's `db:migrate --help`; run them using `docker compose run --rm --no-deps api ...` and `docker compose run --rm --no-deps medusa ...` with the verified image working directory and executable. Strapi creates its schema on first startup. Do not seed demo products or users into production. Back up before every later migration; application rollback does not necessarily reverse database migrations.

Verify: connect as each service role and inspect its database, run migrations twice to confirm there are no pending migrations, and restart PostgreSQL to confirm data persists. If authentication fails, confirm env values, URL encoding, network and database ownership. Initialization environment variables only apply to an empty data directory; changing them later does not change an existing password. Next: [Strapi](05-strapi.md).
