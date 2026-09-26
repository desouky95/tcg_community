# Observability and alerting

Every request, job, event, and provider call carries a request/correlation ID. Structured logs identify operation, actor class, aggregate, result, duration, retry state, and safe error code. OpenTelemetry traces connect client API calls, database transactions, queue publication, workers, and provider adapters.

Core metrics include request rate/error/latency, database saturation and lock waits, cache hit ratio, queue depth and oldest age, websocket connections, import duration, message delivery lag, listing publication failures, reservation expiry, payment intent transitions, webhook verification failures, reconciliation mismatches, notification delivery, and mobile sync lag.

Page immediately for sustained 5xx above 2%, payment webhook rejection above 1%, reconciliation imbalance, primary database unavailability, queue oldest age above 15 minutes for payment or 60 minutes for general jobs, and security-signature failures above baseline. Ticket degraded cache hit rate, slow queries, dead-letter growth, push failures, and storage forecasts. Dashboards separate customer impact from dependency health.
