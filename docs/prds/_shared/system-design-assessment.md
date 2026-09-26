# System-design assessment

## Baseline score: 3/10

The repository had product and functional direction plus partial queue intent, but it did not satisfy six of the eight diagnostic rows: quantified capacity, component redundancy, database scaling, cache policy, monitoring/alerting, and deployment/recovery. Queue usage was named but not operationally complete.

## Fixes supplied by this library

| Diagnostic | Baseline | Required design now documented |
| --- | --- | --- |
| Functional and nonfunctional requirements | Partial | Every atomic PRD defines actors, behavior, failures, interfaces, data, security, SLO references, and acceptance tests. |
| QPS and storage estimates | Fail | Staged MAU/DAU, RPS, storage, latency, availability, RPO, and RTO assumptions are in capacity-and-slos.md. |
| Redundancy | Fail | Multi-instance application, multi-AZ PostgreSQL, replicated Redis, durable queues, and redundant object storage are required. |
| Database scaling | Fail | Vertical-first scaling, read-replica triggers, partition candidates, and last-resort shard keys are defined. |
| Caching | Fail | Domain TTLs, cache-aside ownership, invalidation events, and uncached transactional domains are explicit. |
| Queues | Partial | Envelope, ordering, retry, deduplication, dead-letter, and alert rules are defined. |
| Monitoring and alerts | Fail | Metrics, tracing, safe logs, thresholds, dashboards, and paging rules are defined. |
| Deployment | Fail | Rolling/canary releases, expand-migrate-contract, feature flags, rollback, backups, and restore exercises are defined. |

## Target score: 10/10

The documentation now addresses all eight rows. This is a design-completeness score, not evidence that the corresponding infrastructure or product capabilities have been implemented or load-tested.
