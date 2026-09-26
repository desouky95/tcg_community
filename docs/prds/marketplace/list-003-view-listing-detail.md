# LIST-003: View listing detail

## Metadata

| Field | Value |
| --- | --- |
| PRD status | Complete |
| Product horizon | v1 |
| Implementation state | mocked |
| Domain | Marketplace listings |
| Actors | guest, buyer |
| Platforms | public web, collector web, mobile |
| Surface | `/marketplace/:id` |
| Dependencies | [LIST-001](../marketplace/list-001-browse-listings.md) |

**Current evidence:** Mock detail route.

## Problem and outcome

The product needs a consistent, authorized way to **view listing detail**. Success means: The buyer sees current price, condition, seller trust, and availability. The scenario starts when an eligible guest initiates the action from `/marketplace/:id` and ends when the canonical result is persisted or a typed terminal error is returned.

### Preconditions and permissions

- Authentication and ownership follow [actors and permissions](../_shared/actors-and-permissions.md); public access is allowed only where the actor list includes guest.
- Referenced resources must exist, be visible to the actor, belong to the active market, and be in a legal state from [shared state machines](../_shared/state-machines.md).
- Commands require an idempotency key; versioned aggregate commands also require the last observed version.
- The operation must not expose another user's private collection, contact, payment, moderation, or provider data.

## End-to-end sequence

1. The client validates required local input and attaches locale, market, correlation ID.
2. The interface invokes `GET /api/v1/listings/:id`; middleware authenticates, rate-limits, and authorizes before loading domain data.
3. Marketplace module validates the business invariant for **view listing detail** and rejects illegal or stale state without side effects.
4. PostgreSQL returns an authorization-scoped snapshot from listings, listing_media, users.
5. The response is serialized with stable pagination/version metadata where applicable.
6. The client renders the canonical result and the next valid action. The buyer sees current price, condition, seller trust, and availability.

## Experience requirements

- Show a stable loading state after 150 ms and preserve navigation context on retry.
- Explain empty, forbidden, missing, conflict, rate-limited, offline, and dependency-unavailable outcomes with one safe next action.
- Never optimistically confirm financial, inventory, identity, moderation, swap-completion, or fulfillment state.
- English and Arabic copy must be natural, RTL-safe, and use market-aware date, number, currency, and phone formatting.
- Meet keyboard, focus, label, error association, status announcement, reduced-motion, contrast, and 44 px touch-target requirements.
- Emit `marketplace.view-listing-detail.started`, `.succeeded`, and `.failed` analytics without personal or provider secrets.

## Interface contract

### REST

- Operation: `GET /api/v1/listings/:id`.
- Inputs are path/query filters with opaque cursor pagination and a maximum page size of 100.
- Success returns the canonical resource projection, version, server timestamp, and `requestId`.
- Errors use the shared envelope and include 401, 403, 404, 409, 422, 429, and 503 only when applicable.
- Existing incompatible routes remain available through an announced REST deprecation period.

### GraphQL target

`query viewListingDetail` exposes the same authorization and state rules for shared web/mobile clients. Commands return a typed payload containing the updated resource, `clientMutationId`, and domain errors. Administrative bulk transfers may remain REST-first.

## Backend and data rules

- Owning component: Marketplace module; other domains interact through application interfaces and outbox events, not direct cross-domain writes.
- Authoritative records: listings(id, seller_id, card_id, title, description, condition, price_minor, currency, quantity, status, version); listing_media(id, listing_id, object_key, sort_order, status); saved_listings(user_id, listing_id, created_at); listing_reports(id, listing_id, reporter_id, reason, status).
- Required indexes and constraints: listings(status, currency, created_at); listings(seller_id, status); listings(card_id, condition, price_minor); unique saved_listings(user_id, listing_id).
- Published listing detail and search facets use cache-aside Redis for 60 seconds with event-driven invalidation.
- Queries are side-effect free and use a consistent authorization-scoped snapshot.
- Personal data follows purpose-based retention; financial, dispute, moderation, and audit references are retained or anonymized rather than hard-deleted.

## Failure, security, and operations

- Validation fails before mutation. Authorization is rechecked inside the service before sensitive writes.
- Concurrent changes return 409 with the latest safe version; clients refresh and ask the actor to confirm again.
- Provider or queue failure cannot roll back an already committed core transaction; recovery uses the outbox, retries with jitter, and dead-letter review.
- Logs include operation, safe aggregate ID, actor class, result code, duration, request ID, and correlation ID. Secrets, OTPs, raw contact data, and provider payloads are redacted.
- Alert on sustained failure above 2%, p95 above the applicable SLO for 15 minutes, dead-letter growth, or an impossible state transition.

## Acceptance criteria

- Given valid prerequisites and authorization, the scenario ends with: The buyer sees current price, condition, seller trust, and availability.
- An unauthorized actor receives 401 or 403 without learning whether a private resource exists.
- Invalid input produces field-addressable 422 errors in English and Arabic and no persisted side effects.
- Repeated queries with the same cursor and unchanged version return a stable page without side effects.
- Concurrent stale commands cannot overwrite a newer version.
- Audit/outbox data is committed with the domain change and asynchronous retries cannot duplicate user-visible effects.
- Declared web and mobile clients render loading, empty, offline, conflict, failure, and success states accessibly.

## Verification

- Unit: authorization policy, validation boundaries, state transition, amount/count invariants, and event payload.
- Integration: `GET /api/v1/listings/:id`, database constraints, idempotency, optimistic concurrency, audit/outbox write, and rollback on failure.
- Contract: REST and GraphQL produce equivalent domain results and typed errors.
- E2E: complete the scenario on its declared platforms in English and Arabic/RTL, including keyboard/screen-reader behavior on web.
- Resilience: retry after timeout, duplicate command/event, stale version, dependency outage, queue replay, and restored connectivity.

## Rollout and exclusions

Roll out behind the domain feature flag when implementation is not already current. Apply expand/migrate/contract database changes, instrument dashboards before exposure, canary transactional changes, and retain a rollback path that does not reverse confirmed financial or audit facts.

This PRD does not broaden the actor's role, guarantee participant-arranged shipping, make TCG Community an escrow custodian, or define unrelated scenarios. Shared NFRs are in [capacity and SLOs](../_shared/capacity-and-slos.md), [security](../_shared/security-and-privacy.md), [observability](../_shared/observability.md), and [deployment](../_shared/deployment-and-recovery.md).
