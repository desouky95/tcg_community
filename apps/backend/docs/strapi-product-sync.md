# Medusa to Strapi product sync

Set `STRAPI_SYNC_URL` to the Strapi origin and `STRAPI_SYNC_TOKEN` to a server-only Strapi API token with find/create/update access to products and find/create/update/delete access to product variants. Configure `EVENTS_REDIS_URL` to use the Redis event bus and distributed lock provider; in production it is required when sync is configured. Do not use the local in-memory event bus for durable delivery. Redis event jobs use eight attempts with exponential backoff; failed jobs are retained in Redis. This event-bus configuration applies to all Medusa events.

Products and variants created or updated after deployment synchronize by Medusa ID. Product handles are required unique lookup keys. Medusa owns synchronized titles, descriptions, handles, SKUs and URL fields; existing Strapi media fields and other editorial relations remain untouched. Only variants marked `managedByMedusa` are removed during reconciliation. Deleted Medusa products stay in Strapi. No historical backfill runs automatically.

Before deployment, audit existing Strapi products for missing or duplicate handles and duplicate Medusa IDs, resolve conflicts, and take a database backup before applying the schema changes. Restart Strapi and regenerate the client with `pnpm --filter @tcg/strapi-client strapi:generate`. A conflicting handle is not reassigned: resolve it in Strapi or Medusa before retrying.

Failures are logged with the Medusa product ID without API tokens and retained as failed Redis event jobs. After correcting the issue, retry an individual product from the backend workspace with `STRAPI_SYNC_PRODUCT_ID=prod_... pnpm exec medusa exec ./src/scripts/retry-strapi-product.ts`. This command intentionally synchronizes only the named product. Monitor failed Redis jobs and service logs; configure Redis persistence and a worker in production.

Administrators can also open a product in Medusa Admin and select **Sync to CMS**. The button synchronizes immediately and reports success only after Strapi accepts the changes; failures can be retried. Product update permission is required.
