# 02 — Accounts and server setup

Prerequisites: completed budget, a domain, a VPS account, DNS access, and a laptop with SSH. Examples assume Ubuntu 24.04 LTS and a public IPv4 address.

1. Create an SSH key on your computer, if needed: `ssh-keygen -t ed25519 -C "tcg-deploy"`. Keep the private key private and register the `.pub` key with the VPS provider.
2. Create the 8 GB x86-64 VPS, install your public key, and record its IP. Connect with `ssh root@SERVER_IP`, or use the provider's documented initial user.
3. Create an operator: `adduser deploy` and `usermod -aG sudo deploy`. Install the public key for this user using your provider's instructions. Test `ssh deploy@SERVER_IP` and `sudo -v` in a second terminal before disabling password/root login.
4. Update: `sudo apt update && sudo apt upgrade -y`. Configure unattended security updates according to [Ubuntu documentation](https://ubuntu.com/server/docs/how-to/software/automatic-updates/).
5. Configure the provider firewall and UFW: allow TCP 22 from your IP where practical, and TCP 80/443 publicly. Run `sudo ufw allow OpenSSH`, `sudo ufw allow 80/tcp`, `sudo ufw allow 443/tcp`, then `sudo ufw enable` and `sudo ufw status`. Docker published ports can bypass UFW; never publish databases or internal services, and use the provider firewall as an additional boundary.
6. Install Docker Engine and the Compose plugin using [Docker's Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/). Verify `sudo docker version` and `sudo docker compose version`. Docker access is root-equivalent; use `sudo` rather than adding untrusted users to the Docker group.
7. Create the deployment directory: `sudo install -d -m 0750 -o deploy -g deploy /opt/tcg`.
8. In DNS, create A records for `www`, `api`, `commerce`, and `cms` pointing at the VPS IPv4. Add an AAAA record only if IPv6 is configured and reachable. Configure `app` in the Pages guide. Start DNS-only while validating certificates.

Verify: `dig +short api.example.com`, `ssh deploy@SERVER_IP`, and `sudo docker compose version`. If SSH fails, use the provider console; don't disable the existing access method until the new one works. If certificates later fail, check both IPv4 and IPv6 DNS and inbound ports 80/443. Next: [application preparation](03-application-preparation.md).
