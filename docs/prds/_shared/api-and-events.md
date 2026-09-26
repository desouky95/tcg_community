# API and event conventions

## REST compatibility

Existing `/api/v1` routes remain supported through a documented deprecation window. New commands use an `Idempotency-Key` header and return the canonical resource plus `requestId`. Query pagination uses opaque `cursor` and bounded `limit`. Mutations of versioned aggregates require `If-Match` or an explicit `expectedVersion`; conflicts return 409.

Errors use `{ code, messageKey, field?, details?, requestId, retryable }`. Required statuses are 400 malformed request, 401 unauthenticated, 403 forbidden, 404 unknown, 409 conflict, 410 known-but-gone, 422 validation, 429 rate limited with `Retry-After`, and 503 unavailable or maintenance.

## GraphQL target

GraphQL exposes typed queries for shared web/mobile reads and mutations for user commands. Mutations accept `clientMutationId` and `expectedVersion` where applicable and return typed domain errors, not unstructured strings. Administrative bulk operations and provider webhooks may remain REST-first.

## Events

Events are immutable past-tense facts with aggregate type/id, version, actor, market, correlation metadata, and a versioned payload. Event publication uses an outbox written in the same database transaction as the aggregate change. Consumers must be idempotent and forward-compatible with additive fields.
