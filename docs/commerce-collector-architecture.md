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

## Data ownership

Adonis owns collector identity, checklists, and future swaps. Medusa owns
products, inventory, carts, payments, orders, and fulfilment. The
`commerce_customer_links` table is the only cross-system identity reference;
it is created lazily when a signed-in customer first opens `/shop`.

Guest checkout remains a Medusa responsibility. An email supplied at checkout
is used for that order's updates and is not used to claim an account later.
