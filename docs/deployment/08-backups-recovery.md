# 08 — Backups and recovery

Prerequisites: a working Compose stack, sufficient free disk space, a private off-server S3-compatible bucket such as R2, and a recovery machine. This guide uses `restic`: snapshots are encrypted using its repository password. Store the repository password and bucket credentials separately from the server, in a password manager; losing the password makes backups unrecoverable. Enable account MFA and monitor storage/operation costs.

## Configure

Install restic using your distribution package manager (`sudo apt install restic`) and verify `restic version`. Create a private bucket and a token limited to that bucket. In `/opt/tcg/secrets/restic.env`, accessible only to the backup operator, set the values below. Substitute your R2 account endpoint and bucket; do not quote placeholder text literally:

```bash
export RESTIC_REPOSITORY='s3:https://ACCOUNT_ID.r2.cloudflarestorage.com/PRIVATE_BUCKET/tcg'
export AWS_ACCESS_KEY_ID='ACCESS_KEY'
export AWS_SECRET_ACCESS_KEY='SECRET_KEY'
export RESTIC_PASSWORD='LONG_UNIQUE_BACKUP_PASSWORD'
```

Run `chmod 600 /opt/tcg/secrets/restic.env`, then `. /opt/tcg/secrets/restic.env` and `restic init` once. Never initialize over an existing repository. See [restic S3 configuration](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#amazon-s3). Check the provider's endpoint and credentials with a small test before scheduling.

## Backup procedure

Run a scheduled script as a dedicated privileged operator with access to Docker and the secrets. Use restrictive permissions and `set -euo pipefail`. In a temporary directory, dump each database as the PostgreSQL superuser, e.g. `sudo docker compose exec -T db pg_dump -U postgres -Fc tcg_api > "$backup_dir/tcg_api.dump"`, repeating for `tcg_medusa` and `tcg_strapi`. PostgreSQL custom dumps are transaction-consistent per database, but the three dumps and uploads are not a single point-in-time snapshot. Record the backup time and coordinate or pause writes if cross-service consistency is needed.

Archive each upload volume by mounting it read-only into a short-lived container, for example (substitute the actual volume name shown by `sudo docker volume ls`):

```bash
sudo docker run --rm -v TCG_API_UPLOAD_VOLUME:/source:ro -v "$backup_dir:/backup" alpine:3.21 tar -czf /backup/api-uploads.tar.gz -C /source .
```

Repeat for Medusa and Strapi uploads. Confirm that every volume and any custom persistent path is covered. Run `restic backup "$backup_dir"`, `restic snapshots`, then `restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 3 --prune`. Only delete the specific temporary directory after successful backup and verification. Schedule this procedure daily using a systemd timer, capture exit status, and alert on failure or a missing daily snapshot. An operator must create and test the script and timer; this document does not install them automatically.

## Restore test

1. On an isolated recovery machine install restic and Docker, configure the same repository credentials, and run `restic snapshots` and `restic check`.
2. Restore to an empty directory: `restic restore latest --target /tmp/tcg-restore`. Locate the dumps under the restored backup directory. Start a **new, isolated** PostgreSQL instance matching the backed-up major version; create the three roles/databases as in [04](04-postgresql.md).
3. Restore each dump into its corresponding empty test database with `pg_restore --no-owner --role=tcg_api -d tcg_api PATH_TO_DUMP`, using the test database connection settings. Repeat with the matching role/database. Restore each archive to a new matching upload volume, never over a live volume during a test.
4. Start test app images against restored data with outbound email/payment jobs disabled. Verify representative users, catalog, orders, CMS content and media. Record duration and any data loss window. Repeat monthly and after material changes.

If restic cannot connect, check endpoint, token scope and network; if restore reports ownership errors, create roles before restoring. An encrypted backup is not a validated recovery until this test succeeds. Next: [monitoring and launch](09-monitoring-launch.md).
