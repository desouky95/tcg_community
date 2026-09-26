# Deployment, migration, and recovery

Use migration-safe rolling deployments at launch and canary releases for payment, order, authentication, and state-machine changes. Readiness requires database connectivity, queue publication, and required configuration; liveness checks process health only. Automated rollback triggers on error-rate, latency, state-transition, or reconciliation regression.

Database changes follow expand/migrate/contract: add nullable/backward-compatible schema, deploy dual-compatible code, backfill through resumable jobs, verify counts and checksums, switch reads, then remove old fields in a later release. Never combine irreversible financial migration with application cutover.

Feature flags gate GraphQL migration, marketplace publishing, payments, mobile rollout, market activation, and new providers. Backups use point-in-time recovery and encrypted object versioning. Quarterly restore exercises verify RPO/RTO. Provider outages use circuit breakers and explicit degraded states; queued reconciliation restores consistency after recovery.
