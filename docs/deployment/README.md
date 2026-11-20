# Deployment runbook

The current Docker Hub single-image deployment is documented in [deployment and recovery](../prds/_shared/deployment-and-recovery.md). Use that guide and `infra/compose.prod.yaml`; the numbered guides below contain older architecture examples and are not the current Compose specification.

- [ ] [01 — Architecture and budget](01-architecture-budget.md)
- [ ] [02 — Accounts and server setup](02-server-setup.md)
- [ ] [03 — Application preparation](03-application-preparation.md)
- [ ] [04 — PostgreSQL](04-postgresql.md)
- [ ] [05 — Strapi CMS](05-strapi.md)
- [ ] [06 — Deployment and HTTPS](06-deployment.md)
- [ ] [07 — Collector frontend](07-collector-frontend.md)
- [ ] [08 — Backups and recovery](08-backups-recovery.md)
- [ ] [09 — Monitoring and launch](09-monitoring-launch.md)

Examples use `example.com`, `/opt/tcg`, Ubuntu, and Bash on the server. Replace placeholders consistently. Never commit real environment files, private keys, tokens, backup passwords, or database dumps. Commands that change a live database or replace files require a verified backup first. Read the complete guide before running its commands.
