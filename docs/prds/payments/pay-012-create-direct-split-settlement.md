# PAY-012: Create direct split settlement

## Metadata

| Field | Value |
| --- | --- |
| PRD status | Complete |
| Product horizon | future |
| Implementation state | absent |
| Domain | Payments |
| Actors | worker, external provider |
| Platforms | backend-only |
| Surface | `payment capture` |
| Dependencies | [PAY-006](../payments/pay-006-process-payment-webhook.md) |

**Current evidence:** No current implementation.

## Problem and outcome

The product needs a consistent, authorized way to **create direct split settlement**. Success means: Provider-connected seller settlement records gross, fee, and net values. The scenario starts when the named system trigger or dependency event occurs and ends when the canonical result is persisted or a typed terminal error is returned.

### Preconditions and permissions

- Authentication and ownership follow [actors and permissions](../_shared/actors-and-permissions.md); public access is allowed only where the actor list includes guest.
- Referenced resources must exist, be visible to the actor, belong to the active market, and be in a legal state from [shared state machines](../_shared/state-machines.md).
- System triggers require a unique event, schedule, or job key and consumers deduplicate it before side effects.
- The operation must not expose another user's private collection, contact, payment, moderation, or provider data.

## End-to-end sequence

1. The worker or adapter validates the trigger signature, schedule, or event identity and attaches market and correlation metadata.
2. The interface invokes `SettlementCreationPolicy`; middleware authenticates, rate-limits, and authorizes before loading domain data.
3. Payment module validates the business invariant for **create direct split settlement** and rejects illegal or stale state without side effects.
4. PostgreSQL commits the aggregate change, audit/outbox record, and idempotency result atomically across settlements, orders.
5. The outbox publishes PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated; noncritical notifications, projections, and analytics run asynchronously.
6. The worker records the canonical result; dependent clients observe it through their owning query or event. Provider-connected seller settlement records gross, fee, and net values.

## Experience requirements

- Expose progress, terminal status, and safe replay controls to authorized operators rather than an end-user loading surface.
- Explain empty, forbidden, missing, conflict, rate-limited, offline, and dependency-unavailable outcomes with one safe next action.
- Never optimistically confirm financial, inventory, identity, moderation, swap-completion, or fulfillment state.
- English and Arabic copy must be natural, RTL-safe, and use market-aware date, number, currency, and phone formatting.
- Any operator surface must meet the shared web accessibility requirements.
- Emit `payments.create-direct-split-settlement.started`, `.succeeded`, and `.failed` analytics without personal or provider secrets.

## Interface contract

### REST

- Operation: `SettlementCreationPolicy`.
- Input is the versioned job/event payload with event ID, correlation ID, attempt, and occurred-at timestamp.
- Success returns the canonical resource projection, version, server timestamp, and `requestId`.
- Errors use the shared envelope and include 401, 403, 404, 409, 422, 429, and 503 only when applicable.
- Existing incompatible routes remain available through an announced REST deprecation period.

### GraphQL target

No public GraphQL operation owns this backend trigger. Authorized clients observe its result through the related resource query or subscription. Provider webhooks remain REST-only.

## Backend and data rules

- Owning component: Payment module; other domains interact through application interfaces and outbox events, not direct cross-domain writes.
- Authoritative records: payment_intents(id, order_id, provider, provider_intent_id, amount_minor, currency, status, idempotency_key); payment_events(id, provider_event_id, intent_id, type, payload_hash, processed_at); settlements(id, order_id, seller_account_id, gross_minor, fee_minor, net_minor, provider_transfer_id, status); refunds(id, order_id, payment_intent_id, amount_minor, reason, status).
- Required indexes and constraints: unique payment_intents(idempotency_key); unique provider identifiers; payment_events(processed_at, type); settlements(status, updated_at); refunds(order_id, status).
- Payment and settlement state is never cached; provider capability metadata may use a 15-minute cache.
- Workers record event/job deduplication before side effects and commit domain change plus outbox atomically.
- Personal data follows purpose-based retention; financial, dispute, moderation, and audit references are retained or anonymized rather than hard-deleted.

## Failure, security, and operations

- Validation fails before mutation. Authorization is rechecked inside the service before sensitive writes.
- Concurrent changes return 409 with the latest safe version; clients refresh and ask the actor to confirm again.
- Provider or queue failure cannot roll back an already committed core transaction; recovery uses the outbox, retries with jitter, and dead-letter review.
- Logs include operation, safe aggregate ID, actor class, result code, duration, request ID, and correlation ID. Secrets, OTPs, raw contact data, and provider payloads are redacted.
- Alert on sustained failure above 2%, p95 above the applicable SLO for 15 minutes, dead-letter growth, or an impossible state transition.

## Acceptance criteria

- Given valid prerequisites and authorization, the scenario ends with: Provider-connected seller settlement records gross, fee, and net values.
- An unauthorized actor receives 401 or 403 without learning whether a private resource exists.
- Invalid input produces field-addressable 422 errors in English and Arabic and no persisted side effects.
- Replaying the same event or job key produces at most one domain effect.
- Concurrent stale commands cannot overwrite a newer version.
- Audit/outbox data is committed with the domain change and asynchronous retries cannot duplicate user-visible effects.
- Authorized operations tooling exposes progress, failure reason, retry state, and terminal outcome.

## Verification

- Unit: authorization policy, validation boundaries, state transition, amount/count invariants, and event payload.
- Integration: `SettlementCreationPolicy`, database constraints, idempotency, optimistic concurrency, audit/outbox write, and rollback on failure.
- Contract: REST and GraphQL produce equivalent domain results and typed errors.
- E2E: complete the scenario on its declared platforms, verifying trigger authentication, observability, and operator recovery.
- Resilience: retry after timeout, duplicate command/event, stale version, dependency outage, queue replay, and restored connectivity.

## Rollout and exclusions

Roll out behind the domain feature flag when implementation is not already current. Apply expand/migrate/contract database changes, instrument dashboards before exposure, canary transactional changes, and retain a rollback path that does not reverse confirmed financial or audit facts.

This PRD does not broaden the actor's role, guarantee participant-arranged shipping, make TCG Community an escrow custodian, or define unrelated scenarios. Shared NFRs are in [capacity and SLOs](../_shared/capacity-and-slos.md), [security](../_shared/security-and-privacy.md), [observability](../_shared/observability.md), and [deployment](../_shared/deployment-and-recovery.md).
