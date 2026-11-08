# Lucid queries, relationships and transactions

Read for complex filters, nested lists, pagination, ownership, concurrency or performance.

**Official Markdown:** [Lucid SQL ORM](https://docs.adonisjs.com/guides/database/lucid.md)

## Query planning

- Begin with the actual model relationships, foreign keys and index definitions.
- Filter all multi-tenant/user-owned data by the current authorized scope.
- Avoid N+1 queries: preload required relations deliberately, rather than running queries inside loops.
- Paginate potentially unbounded endpoints and specify stable ordering.
- Use direct joins when relation filters need them, qualifying overlapping column names.
- Before raw SQL, check whether Lucid / Knex expresses the requirement; bind untrusted values, never interpolate them.

```ts
// Illustrative; only valid if the model has an `author` relationship.
const articles = await Article.query()
  .where('is_published', true)
  .preload('author')
  .orderBy('id', 'desc')
  .paginate(page, 20)
```

## Consistency and concurrency

- Transactions should contain all writes that must commit together. Avoid external network side effects inside retried transactions unless safe.
- For race-sensitive operations (inventory, balances, counters, per-user quantities), prefer database constraints and atomic updates; evaluate locking where necessary.
- When synchronizing imported or scraped external records, use stable identity, idempotent upserts and soft-absence handling. Do not erase user-owned progress merely because a source refresh omits a record.
- Query-builder bulk updates do not run model hooks; use model instances when lifecycle behavior is required.
- Decide whether computed properties (e.g., owned/missing/duplicates) should be SQL projections, transformer fields, or persisted materialization based on query load and consistency.

## Verification cases

Empty results, missing relation, hidden/unauthorized parent, duplicate input, concurrent updates, pagination boundaries and high-cardinality lists.
