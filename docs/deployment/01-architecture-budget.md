# 01 — Architecture and budget

Prerequisites: decide your domain and approximate launch traffic. The target is a low-traffic initial launch, not high availability.

## Layout

| Hostname example | Service | Location |
| --- | --- | --- |
| `www.example.com` | Next.js public site and storefront | VPS |
| `app.example.com` | Vite collector application | Cloudflare Pages |
| `api.example.com` | Adonis API | VPS |
| `commerce.example.com` | Medusa API and admin | VPS |
| `cms.example.com` | Strapi admin and content API | VPS |

On the VPS, run each Node application, PostgreSQL, reverse proxy and the Adonis worker in separate containers on a private Docker network. Use one PostgreSQL server with three databases and roles. Persist PostgreSQL, API uploads, Medusa static files and Strapi uploads in named volumes. Only the proxy publishes ports 80 and 443. The collector application is static, so it does not need a server container.

A VPS failure affects the store, CMS, API and database together. Daily backups can lose up to a day of changes; checkout recovery also requires reconciling orders with the payment provider. This is a launch compromise, not a high-availability design.

## Budget checklist

- [ ] Compare an x86-64 Ubuntu VPS with **at least 8 GB RAM**, preferably 4 shared vCPUs, SSD storage, IPv4, sufficient traffic, and a nearby region. Verify availability and renewal price.
- [ ] Include VAT, currency conversion, IPv4, backups, storage, domain renewal, email, and provider overage charges. Keep a reserve; the total must be at most $35/month.
- [ ] Budget domain registration as annual price divided by 12. Treat payment processing and SMS as separate variable business costs unless they must fit the same $35.
- [ ] Confirm that off-server backups fit the included storage and that you can restore them without the VPS.
- [ ] Check provider billing alerts and disable optional paid upgrades unless budgeted.

As checked 30 October 2026, [DigitalOcean's basic 8 GiB/4 vCPU plan is $48/month](https://www.digitalocean.com/pricing/droplets), before backups, so it does **not** meet this budget. A cheaper provider must be selected and its actual checkout price verified; no qualifying offer is guaranteed. [Cloudflare Pages free limits](https://developers.cloudflare.com/pages/platform/limits/) include 500 builds/month; [R2 Standard](https://developers.cloudflare.com/r2/pricing/) includes 10 GB-month, 1 million Class A and 10 million Class B operations monthly, with usage charges beyond those allowances. R2 requires an account and billing setup; monitor usage. Prices and limits can change.

Verify: write down the full recurring estimate and reserve before buying. If it exceeds $35, do not downsize blindly: defer launch or increase the budget. Next: [server setup](02-server-setup.md).
