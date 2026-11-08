# Errors, observability and background integrations

Read for exception handling, logs, email/events, storage, caching, locks and jobs.

**Official Markdown:** [Exception handling](https://docs.adonisjs.com/guides/basics/exception-handling.md) · [Logger](https://docs.adonisjs.com/guides/digging-deeper/logger.md) · [Emitter](https://docs.adonisjs.com/guides/digging-deeper/emitter.md) · [Atomic locks](https://docs.adonisjs.com/guides/digging-deeper/locks.md) · [Drive](https://docs.adonisjs.com/guides/digging-deeper/drive.md) · [Mail](https://docs.adonisjs.com/guides/digging-deeper/mail.md) · [Cache](https://docs.adonisjs.com/guides/digging-deeper/cache.md)

## Exceptions and logs

- Allow expected framework exceptions (validation, not found, auth) to reach the global handler unless the API contract requires custom handling.
- `app/exceptions/handler.ts` is the central location for response conversion and error reporting.
- Do not leak stack traces or detailed SQL errors in production.
- Log enough structured context to debug failures, but redact credentials, authorization headers and personal data.

## Side effects and integrations

- Confirm which first-party/third-party packages are installed; queues and scheduling are not universal features of every starter kit.
- Separate a successful DB commit from eventually consistent side effects where possible; consider an outbox or retry-safe event record for critical notifications.
- Use idempotency keys/stable identifiers for event handlers, scraping tasks, imports, mail retries and webhook processing.
- For shared resources, consider atomic locks and compare-and-set semantics rather than a process-local lock.
- Cache only safe data; define expiry and invalidation strategies, and keep authorization-sensitive results user-scoped.
- Uploads require file validation, storage permissions and cleanup on failure.

## Testing

Test temporary provider outage, duplicate events, retries, partial failures and missing optional dependencies rather than only happy paths.
