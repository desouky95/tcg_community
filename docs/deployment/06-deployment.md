# 06 — Deployment and HTTPS

Prerequisites: working application images, private registry access, env files, PostgreSQL roles, and DNS. This repository currently has no Compose file or Dockerfiles. The following is an architecture template, not a drop-in deployment: replace image tags, working paths, startup and health commands after validating each image.

Create `/opt/tcg/compose.yaml` with services `proxy`, `db`, `api`, `worker`, `medusa`, `public-web`, and `cms` on one private network. Use `restart: unless-stopped`; only proxy publishes `80:80` and `443:443`. Give each service its own `env_file` and pin tested image tags. Attach named volumes for PostgreSQL and all upload directories described in guide 03. Worker uses the API image with the verified queue command; register the scheduler exactly once. Do not mount the Docker socket into apps. Set log rotation and health checks verified against real endpoints; readiness must not be assumed from container startup.

Example proxy service to incorporate into that file:

```yaml
services:
  proxy:
    image: caddy:2
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
volumes:
  caddy_data:
  caddy_config:
```

Create `/opt/tcg/Caddyfile`, replacing the domains and confirming container ports:

```caddyfile
www.example.com { reverse_proxy public-web:3000 }
api.example.com { reverse_proxy api:3333 }
commerce.example.com { reverse_proxy medusa:9000 }
cms.example.com { reverse_proxy cms:1337 }
```

Caddy requests and renews certificates automatically when DNS and ports work. Persist its data volume. Apply access controls to admin surfaces, allow only needed public API routes, and test real user access; restrict CMS and Medusa admin with a VPN or an identity-aware proxy if available. Configure framework trusted-proxy settings and secure cookies. See [Caddy HTTPS documentation](https://caddyserver.com/docs/automatic-https).

## Release procedure

1. In CI, build each image from the monorepo with the exact public build variables, test it, push an immutable commit tag, and record image digests. Registry credentials must stay in CI secrets.
2. On the VPS, authenticate to the registry using its documented secure login; never put tokens in shell history. Take and verify a backup before deployment.
3. Update the image tags in the server Compose file, then `cd /opt/tcg && sudo docker compose config --quiet` and `sudo docker compose pull`. Run migrations using [04](04-postgresql.md). `sudo docker compose up -d` starts or recreates services.
4. Check `sudo docker compose ps`, `sudo docker compose logs --tail=100`, HTTPS, product reads, auth, jobs, and media. Store the release version and migration outcome.
5. For rollback, restore the previous image tags and run `sudo docker compose up -d`. If migrations are incompatible, image rollback alone is unsafe: use a tested restore plan and reconcile any orders created after the backup.

Troubleshooting: certificate failure usually means wrong DNS or blocked 80/443; 502 means an unhealthy service, wrong port or network. Check logs without revealing secrets. A restore test and live-commerce gates are required before launch. Next: [collector frontend](07-collector-frontend.md).
