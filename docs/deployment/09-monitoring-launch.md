# 09 — Monitoring and launch

Prerequisites: deployment is running, backups are configured, and an isolated restore test succeeded.

## Monitoring

- Configure an external uptime monitor for the public site and API. Send alerts to an address you check; test notifications by temporarily disabling a test endpoint.
- Alert on disk usage above 80%, sustained memory pressure or container restarts, certificate expiry, backup failure, and missing daily snapshots. Review `df -h`, `free -h`, `sudo docker stats --no-stream`, and `sudo docker compose ps` during the initial launch. Limit log retention so disk does not fill silently.
- Enable provider billing alerts and inspect VPS, backup, Pages, R2 and email usage monthly. Free tiers are allowances, not spending caps.
- Keep an inventory of server, DNS, registry, passwords, recovery keys, image versions and restore instructions accessible if the VPS is unavailable. Apply security updates on a schedule and verify backups first.

## Launch checks

- [ ] DNS and HTTPS work for every hostname; only proxy ports are reachable publicly. Admin access is restricted, production secrets are unique, and browser bundles contain no secret tokens.
- [ ] Confirm login, logout, sessions, CORS, catalog, collector API, CMS publication, upload persistence, queue worker and exactly one scheduler. Test failure and restart behavior.
- [ ] Verify separate database roles, successful migrations, monitoring notifications, off-server backup and a complete isolated restoration.
- [ ] Load-test browsing and concurrent API work with realistic data; verify memory and disk headroom. Record results rather than assuming an 8 GB server is sufficient.
- [ ] Keep real orders disabled until checkout, payment provider integration and signed webhooks are implemented and tested, including retries/idempotency, refunds, failure handling, stock behavior, order confirmations and reconciliation. The current storefront does not establish a complete checkout flow.

For an outage, check the provider dashboard, DNS, proxy, `docker compose ps`, logs and disk space in that order. If recovery requires restoring a database, stop writes, restore using the tested procedure, then reconcile orders and payments made after the recovery point. Escalate capacity or move the database to managed hosting when restore time, data-loss window or resource usage no longer meets business needs.
