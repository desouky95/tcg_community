# API and event conventions

Each owning service validates input and authorizes every request. Read responses expose only data permitted for the caller; writes return a canonical result or a clear error. Use concurrency protection for proposals and deals, and deduplicate retries for payment and other side-effectful operations. Confirm payment through a verified provider event or authoritative reconciliation, never a browser redirect alone.

Events crossing service boundaries should have stable identifiers and be safe to process more than once. Define concrete endpoints, payloads, authentication, delivery and compatibility in technical design after auditing current APIs; no GraphQL or specific outbox implementation is assumed by this library.
