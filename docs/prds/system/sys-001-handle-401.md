# SYS-001: Handle unauthenticated request

## Metadata

| Field | Value |
| --- | --- |
| PRD status | Complete |
| Product horizon | current |
| Implementation state | partial |
| Domain | Shared system behavior |
| Actors | guest, collector, administrator, worker |
| Platforms | public web, collector web, admin web, mobile, backend-only |
| Surface | `all protected surfaces` |
| Dependencies | None. |

**Current evidence:** ProtectedRoute and Axios handling exist.

## Problem and outcome

The product needs a consistent, authorized way to **handle unauthenticated request**. Success means: Clients clear private state and offer safe sign-in recovery. The scenario starts when the named system trigger or dependency event occurs and ends when the canonical result is persisted or a typed terminal error is returned.

### Preconditions and permissions

- Authentication and ownership follow [actors and permissions](../_shared/actors-and-permissions.md); public access is allowed only where the actor list includes guest.
- Referenced resources must exist, be visible to the actor, belong to the active market, and be in a legal state from [shared state machines](../_shared/state-machines.md).
- System triggers require a unique event, schedule, or job key and consumers deduplicate it before side effects.
- The operation must not expose another user's private collection, contact, payment, moderation, or provider data.

## End-to-end sequence

1. The worker or adapter validates the trigger signature, schedule, or event identity and attaches market and correlation metadata.
2. The interface invokes `HTTP 401 contract`; middleware authenticates, rate-limits, and authorizes before loading domain data.
3. Platform edge and client state layer validates the business invariant for **handle unauthenticated request** and rejects illegal or stale state without side effects.
4. PostgreSQL commits the aggregate change, audit/outbox record, and idempotency result atomically across access_tokens.
5. The outbox publishes DependencyDegraded, RateLimitExceeded, MaintenanceChanged; noncritical notifications, projections, and analytics run asynchronously.
6. The client renders the canonical result and the next valid action. Clients clear private state and offer safe sign-in recovery.

## Experience requirements

- Show a stable loading state after 150 ms and preserve navigation context on retry.
- Explain empty, forbidden, missing, conflict, rate-limited, offline, and dependency-unavailable outcomes with one safe next action.
- Never optimistically confirm financial, inventory, identity, moderation, swap-completion, or fulfillment state.
- English and Arabic copy must be natural, RTL-safe, and use market-aware date, number, currency, and phone formatting.
- Meet keyboard, focus, label, error association, status announcement, reduced-motion, contrast, and 44 px touch-target requirements.
- Emit `system.handle-401.started`, `.succeeded`, and `.failed` analytics without personal or provider secrets.

## Interface contract

### REST

- Operation: `HTTP 401 contract`.
- Input is the versioned job/event payload with event ID, correlation ID, attempt, and occurred-at timestamp.
- Success returns the canonical resource projection, version, server timestamp, and `requestId`.
- Errors use the shared envelope and include 401, 403, 404, 409, 422, 429, and 503 only when applicable.
- Existing incompatible routes remain available through an announced REST deprecation period.

### GraphQL target

`mutation handle-401` exposes the same authorization and state rules for shared web/mobile clients. Commands return a typed payload containing the updated resource, `clientMutationId`, and domain errors. Administrative bulk transfers may remain REST-first.

## Backend and data rules

- Owning component: Platform edge and client state layer; other domains interact through application interfaces and outbox events, not direct cross-domain writes.
- Authoritative records: request_logs(request_id, actor_id, route, status, duration_ms, created_at); idempotency_keys(scope, key, request_hash, response_ref, expires_at); maintenance_windows(id, starts_at, ends_at, message_key, status).
- Required indexes and constraints: request_logs(route, created_at); unique idempotency_keys(scope, key); maintenance_windows(status, starts_at).
- Only explicit domain reads are cached; error, authorization, and maintenance decisions are evaluated from authoritative state.
- Workers record event/job deduplication before side effects and commit domain change plus outbox atomically.
- Personal data follows purpose-based retention; financial, dispute, moderation, and audit references are retained or anonymized rather than hard-deleted.

## Failure, security, and operations

- Validation fails before mutation. Authorization is rechecked inside the service before sensitive writes.
- Concurrent changes return 409 with the latest safe version; clients refresh and ask the actor to confirm again.
- Provider or queue failure cannot roll back an already committed core transaction; recovery uses the outbox, retries with jitter, and dead-letter review.
- Logs include operation, safe aggregate ID, actor class, result code, duration, request ID, and correlation ID. Secrets, OTPs, raw contact data, and provider payloads are redacted.
- Alert on sustained failure above 2%, p95 above the applicable SLO for 15 minutes, dead-letter growth, or an impossible state transition.

## Acceptance criteria

- Given valid prerequisites and authorization, the scenario ends with: Clients clear private state and offer safe sign-in recovery.
- An unauthorized actor receives 401 or 403 without learning whether a private resource exists.
- Invalid input produces field-addressable 422 errors in English and Arabic and no persisted side effects.
- Replaying the same event or job key produces at most one domain effect.
- Concurrent stale commands cannot overwrite a newer version.
- Audit/outbox data is committed with the domain change and asynchronous retries cannot duplicate user-visible effects.
- Declared web and mobile clients render loading, empty, offline, conflict, failure, and success states accessibly.

## Verification

- Unit: authorization policy, validation boundaries, state transition, amount/count invariants, and event payload.
- Integration: `HTTP 401 contract`, database constraints, idempotency, optimistic concurrency, audit/outbox write, and rollback on failure.
- Contract: REST and GraphQL produce equivalent domain results and typed errors.
- E2E: complete the scenario on its declared platforms in English and Arabic/RTL, including keyboard/screen-reader behavior on web.
- Resilience: retry after timeout, duplicate command/event, stale version, dependency outage, queue replay, and restored connectivity.

## Rollout and exclusions

Roll out behind the domain feature flag when implementation is not already current. Apply expand/migrate/contract database changes, instrument dashboards before exposure, canary transactional changes, and retain a rollback path that does not reverse confirmed financial or audit facts.

This PRD does not broaden the actor's role, guarantee participant-arranged shipping, make TCG Community an escrow custodian, or define unrelated scenarios. Shared NFRs are in [capacity and SLOs](../_shared/capacity-and-slos.md), [security](../_shared/security-and-privacy.md), [observability](../_shared/observability.md), and [deployment](../_shared/deployment-and-recovery.md).
