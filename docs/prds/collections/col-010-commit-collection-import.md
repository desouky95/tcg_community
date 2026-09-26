# COL-010: Commit collection import

## Metadata

| Field | Value |
| --- | --- |
| PRD status | Complete |
| Product horizon | current |
| Implementation state | implemented |
| Domain | Collections |
| Actors | collector |
| Platforms | collector web, mobile |
| Surface | `/collection/:id/edit` |
| Dependencies | [COL-009](../collections/col-009-preview-collection-import.md) |

**Current evidence:** apps/api UserChecklistsController.importExcel.

## Problem and outcome

The product needs a consistent, authorized way to **commit collection import**. Success means: Valid import rows commit with a summary and audit reference. The scenario starts when an eligible collector initiates the action from `/collection/:id/edit` and ends when the canonical result is persisted or a typed terminal error is returned.

### Preconditions and permissions

- Authentication and ownership follow [actors and permissions](../_shared/actors-and-permissions.md); public access is allowed only where the actor list includes guest.
- Referenced resources must exist, be visible to the actor, belong to the active market, and be in a legal state from [shared state machines](../_shared/state-machines.md).
- Commands require an idempotency key; versioned aggregate commands also require the last observed version.
- The operation must not expose another user's private collection, contact, payment, moderation, or provider data.

## End-to-end sequence

1. The client validates required local input and attaches locale, market, correlation ID, idempotency key, and expected version.
2. The interface invokes `POST /api/v1/user-checklists/:id/import`; middleware authenticates, rate-limits, and authorizes before loading domain data.
3. Collections module validates the business invariant for **commit collection import** and rejects illegal or stale state without side effects.
4. PostgreSQL commits the aggregate change, audit/outbox record, and idempotency result atomically across collection_entries.
5. The outbox publishes CollectionChanged, CollectionVisibilityChanged; noncritical notifications, projections, and analytics run asynchronously.
6. The client renders the canonical result and the next valid action. Valid import rows commit with a summary and audit reference.

## Experience requirements

- Show a stable loading state after 150 ms and preserve navigation context on retry.
- Explain empty, forbidden, missing, conflict, rate-limited, offline, and dependency-unavailable outcomes with one safe next action.
- Never optimistically confirm financial, inventory, identity, moderation, swap-completion, or fulfillment state.
- English and Arabic copy must be natural, RTL-safe, and use market-aware date, number, currency, and phone formatting.
- Meet keyboard, focus, label, error association, status announcement, reduced-motion, contrast, and 44 px touch-target requirements.
- Emit `collections.commit-collection-import.started`, `.succeeded`, and `.failed` analytics without personal or provider secrets.

## Interface contract

### REST

- Operation: `POST /api/v1/user-checklists/:id/import`.
- Input includes the scenario fields, `clientMutationId`, and `expectedVersion` where an aggregate already exists.
- Success returns the canonical resource projection, version, server timestamp, and `requestId`.
- Errors use the shared envelope and include 401, 403, 404, 409, 422, 429, and 503 only when applicable.
- Existing incompatible routes remain available through an announced REST deprecation period.

### GraphQL target

`mutation commitCollectionImport` exposes the same authorization and state rules for shared web/mobile clients. Commands return a typed payload containing the updated resource, `clientMutationId`, and domain errors. Administrative bulk transfers may remain REST-first.

## Backend and data rules

- Owning component: Collections module; other domains interact through application interfaces and outbox events, not direct cross-domain writes.
- Authoritative records: user_checklists(id, user_id, checklist_id, visibility, version, updated_at); collection_entries(id, user_checklist_id, card_id, owned_count, wanted_count, offered_count, condition, notes).
- Required indexes and constraints: unique user_checklists(user_id, checklist_id); unique collection_entries(user_checklist_id, card_id); collection_entries(card_id, offered_count, wanted_count).
- Public summaries may use a 2-minute cache; owner edits invalidate summary, matching, and public-view keys.
- Commands use a database transaction and persist the idempotency response for 24 hours; identical retries return the first outcome and payload mismatches return 409.
- Personal data follows purpose-based retention; financial, dispute, moderation, and audit references are retained or anonymized rather than hard-deleted.

## Failure, security, and operations

- Validation fails before mutation. Authorization is rechecked inside the service before sensitive writes.
- Concurrent changes return 409 with the latest safe version; clients refresh and ask the actor to confirm again.
- Provider or queue failure cannot roll back an already committed core transaction; recovery uses the outbox, retries with jitter, and dead-letter review.
- Logs include operation, safe aggregate ID, actor class, result code, duration, request ID, and correlation ID. Secrets, OTPs, raw contact data, and provider payloads are redacted.
- Alert on sustained failure above 2%, p95 above the applicable SLO for 15 minutes, dead-letter growth, or an impossible state transition.

## Acceptance criteria

- Given valid prerequisites and authorization, the scenario ends with: Valid import rows commit with a summary and audit reference.
- An unauthorized actor receives 401 or 403 without learning whether a private resource exists.
- Invalid input produces field-addressable 422 errors in English and Arabic and no persisted side effects.
- Repeating the same command with the same idempotency key produces one effect; a reused key with different input returns 409.
- Concurrent stale commands cannot overwrite a newer version.
- Audit/outbox data is committed with the domain change and asynchronous retries cannot duplicate user-visible effects.
- Declared web and mobile clients render loading, empty, offline, conflict, failure, and success states accessibly.

## Verification

- Unit: authorization policy, validation boundaries, state transition, amount/count invariants, and event payload.
- Integration: `POST /api/v1/user-checklists/:id/import`, database constraints, idempotency, optimistic concurrency, audit/outbox write, and rollback on failure.
- Contract: REST and GraphQL produce equivalent domain results and typed errors.
- E2E: complete the scenario on its declared platforms in English and Arabic/RTL, including keyboard/screen-reader behavior on web.
- Resilience: retry after timeout, duplicate command/event, stale version, dependency outage, queue replay, and restored connectivity.

## Rollout and exclusions

Roll out behind the domain feature flag when implementation is not already current. Apply expand/migrate/contract database changes, instrument dashboards before exposure, canary transactional changes, and retain a rollback path that does not reverse confirmed financial or audit facts.

This PRD does not broaden the actor's role, guarantee participant-arranged shipping, make TCG Community an escrow custodian, or define unrelated scenarios. Shared NFRs are in [capacity and SLOs](../_shared/capacity-and-slos.md), [security](../_shared/security-and-privacy.md), [observability](../_shared/observability.md), and [deployment](../_shared/deployment-and-recovery.md).
