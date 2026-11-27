# Backend requirements before legal acceptance rollout

The policy files are unapproved drafts. No public contract acceptance may be requested against version 0.1.

## Required acceptance contract

When counsel approves a specific terms version, the account registration API and every checkout completion path must accept a document identifier and version, compare both with the server's active approved version, and reject missing or stale acceptance. The server must record the document identifier, accepted version, UTC timestamp, and account identifier or guest cart/order identifier. Store no checkbox state in browser storage as evidence. Preserve accepted versions and records when policy text changes. For checkout, verify acceptance before calling Medusa cart completion and commit the record consistently with the order outcome. If this cannot be atomic across services, use an idempotent pending/completed record and recovery process.

The current Adonis signup route and Medusa order completion path have no demonstrated version-aware acceptance contract. This requirement is intentionally separate from the storefront page work; adding a checkbox without this API would falsely imply enforceable acceptance.

## Publication dependency

Provide an approved-version registry controlled by an authorized business/legal reviewer, with matching English and Arabic files, version, effective date, last-updated date, canonical origin, and an immutable archived copy. Reject publication when either locale contains `TODO(confirm)` or a draft banner. Deploy only after legal approval and an end-to-end acceptance check.
