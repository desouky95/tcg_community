# Lucid and data integrity — AdonisJS v7

Official references:
- https://docs.adonisjs.com/guides/database/lucid
- https://docs.adonisjs.com/v6-to-v7

## Read the data model before editing it

1. Identify tables, indexes, foreign keys, migrations and model conventions in the repository.
2. Determine whether models extend `BaseModel` with column decorators or **generated schema classes** (`#database/schema`). Both may appear; match the actual project's setup. v7 supports migration-first schema class generation; do not hand-edit generated classes.
3. Establish whether records are user-owned, tenant-owned, shared, soft-deleted, or externally synchronized.
4. For queries, verify aliases, column qualification, relation names, custom primary keys and DB engine capabilities.

## Database change checklist

- Create a new migration for new columns/tables/indexes. Do not edit migrations already executed in shared environments.
- Plan both forward and rollback behavior. Destructive or backfill operations deserve a staged migration and a verified backup.
- Specify uniqueness and FK constraints for invariants that need database enforcement; application validation is not enough under concurrency.
- Use transactions when multiple changes must succeed or fail together. Consider isolation/race conditions for counters, inventory, monetary state and user progress.
- Test on the project's actual database dialect when query semantics differ (Postgres `jsonb`, SQLite, MySQL).
- Preload required relations to prevent N+1 queries. Use pagination for unbounded lists and indexes for frequent filters/joins.
- Avoid raw SQL when idiomatic Lucid can express the query clearly; parameterize values when raw SQL is justified. Never interpolate untrusted values into SQL.

## User checklist/progress example: avoid destructive synchronization

For a collectible cards checklist where card definitions are updated by scrapers and individual users track quantities:

- Keep the canonical set of cards separate from per-user ownership/progress records.
- Consider a join table with a unique `(user_id, checklist_id, card_id)` key and `quantity >= 0` enforcement, rather than 3 comma-separated strings or unindexed JSON arrays, **when querying by card/user is a frequent requirement**.
- If missing/duplicate flags are derived from quantity and collection rules, compute them consistently; do not store conflicting duplicate sources of truth without a synchronization strategy.
- When a scraper refreshes a checklist, preserve user progress, identifiers and referential integrity. Make imports idempotent by stable external identifiers when available.
- Handle bulk upserts and deletion carefully: missing cards in one scrape do not automatically imply that user-held records should be deleted.

This is a decision framework, not a mandatory schema. Preserve project-specific semantics and existing migrations.

## Query review checklist

- Does the query filter by authorized user/tenant?
- Are joins fully qualified and paginated where needed?
- Are relationship cardinalities and required ordering explicit?
- Is the query valid for this DB and Lucid version?
- Does a transaction need row locking or an atomic update?
- Are indexes sufficient for the expected query volume?
- Are tests covering empty, duplicate, orphaned, concurrent and large-result cases?
