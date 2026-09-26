# Technical architecture

## Runtime topology

React/Vite web and future React Native clients consume a shared typed contract. AdonisJS remains a modular monolith behind an L7 load balancer. Existing `/api/v1` REST operations remain compatible while GraphQL is introduced for shared web/mobile reads and commands. PostgreSQL is authoritative, Redis supports bounded cache and ephemeral presence, object storage holds media/exports, and durable queues run imports, notifications, media processing, projections, and reconciliation.

Production uses at least two stateless application instances across availability zones, multi-AZ PostgreSQL with point-in-time recovery, replicated Redis with failover, durable queue storage with dead letters, and region-redundant object storage. Provider calls use timeouts, bounded retries, circuit breakers, signed callbacks, and request correlation.

## Data and scaling

Scale PostgreSQL vertically first. Add read replicas for catalogue and reporting when primary read saturation exceeds 60% over a sustained window. Partition messages, notification deliveries, payment events, audit logs, and request logs by month before individual tables exceed 100 million rows. Shard only after vertical, replica, partition, and cache measures are exhausted; candidate keys are user_id for collector data and market_id for regional catalogue/listing reads.

Transactional inventory, swaps, orders, payments, refunds, settlements, and disputes are read from PostgreSQL and use row locks or optimistic versions. Public catalogue, profiles, listing detail, and search facets use cache-aside Redis with domain TTLs and event-driven invalidation. CDN serves versioned static assets and public media.

## Async rules

Jobs carry event_id, correlation_id, causation_id, schema_version, attempt, and occurred_at. Consumers record deduplication before side effects. Transient failures retry exponentially with jitter; permanent or exhausted failures enter a dead-letter queue and alert operators. Ordering is guaranteed only per aggregate key. Payment webhook acknowledgement is decoupled from noncritical notification and analytics work.

## Deliberate boundaries

The platform is not an escrow or shipping guarantor. Payment settlement is provider-managed direct split. Contact data is released only after confirmed payment and consent. Administration and bulk catalogue work remain web-only.
