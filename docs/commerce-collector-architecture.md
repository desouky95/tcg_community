# Next Pull commerce and collector suite

## Deployment boundary

- `www.nextpull.com` (or the root domain) deploys `apps/public-web`.
- `app.nextpull.com` deploys `apps/web`.
- `api.nextpull.com` deploys `apps/api`.
- Medusa is service-facing at `commerce.nextpull.com` (or a private origin) and is never called with admin credentials from a browser.

## Required production configuration

Set `WEB_ORIGINS=https://www.nextpull.com,https://app.nextpull.com` and
`SESSION_COOKIE_DOMAIN=.nextpull.com` in Adonis. Set
`NEXT_PUBLIC_APP_URL=https://app.nextpull.com` in the public site. Configure
Medusa `STORE_CORS` with the public store origin only; configure
`NEXT_PULL_SERVICE_KEY` in Medusa and the identical `MEDUSA_SERVICE_KEY` plus
`MEDUSA_INTERNAL_URL` in Adonis.

`MEDUSA_PUBLISHABLE_KEY` is safe for the Next.js server storefront and is the
only Medusa credential it may use. Keep Medusa admin keys and the service key
server-only.

## Card catalog connection

Set `CARD_CATALOG_API_KEY` to the same secret in the Adonis API and Medusa
environments. Set `CARD_CATALOG_URL` in Medusa to the API's internal catalog
endpoint. When both services run directly on this machine, use
`http://localhost:3333/api/v1/internal/card-catalog`; when both run in the
Docker Compose network, use `http://api:3333/api/v1/internal/card-catalog`.
For the local Compose setup, add the shared key to both `docker/env/api.env`
and `docker/env/medusa.env`, and add the Docker URL to `docker/env/medusa.env`.
Use a different secret for each environment, keep it out of source control and
logs, and restart both services after changing their environments. A 401 from
the catalog usually means their keys do not match.

## Data ownership

Adonis owns collector identity, checklists, and future swaps. Medusa owns
products, inventory, carts, payments, orders, and fulfilment. The
`commerce_customer_links` table is the only cross-system identity reference;
it is created lazily when a signed-in customer first opens `/shop`.

Guest checkout remains a Medusa responsibility. An email supplied at checkout
is used for that order's updates and is not used to claim an account later.

## Account commerce bridge

The signed-in account hub calls Adonis account commerce routes. Adonis validates the session, resolves the linked Medusa customer server-side, and calls the private Medusa account endpoint using the service key. Medusa filters order and address access by that customer; browser-supplied customer IDs are never used. Orders and addresses are private and uncached. Commerce outages do not prevent profile access.

The bridge displays orders already associated with the linked customer. Guest orders are not claimed by email, and the current storefront cart does not yet attach the signed-in customer; cart and checkout association require a separate integration.
