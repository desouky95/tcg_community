# Lucid models and migrations — AdonisJS v7

Read for creating or altering tables, schema generation, models and hooks.

**Official Markdown:** [Lucid SQL ORM](https://docs.adonisjs.com/guides/database/lucid.md) · [Folder structure](https://docs.adonisjs.com/folder-structure.md)

## v7 migration-first flow

1. Inspect existing migrations and schema conventions; don't rewrite previously applied migrations.
2. Create a new migration (`node ace make:migration articles`) and define columns, constraints, indexes and rollback behavior.
3. Apply migrations **only to an explicitly safe environment** using documented `node ace migration:run` workflow.
4. Let Lucid regenerate the schema types (usually `database/schema.ts` with `#database/schema` imports); do not hand-edit generated types.
5. Add model behavior and relationships on top of the generated schema class.

```ts
// Example after your migration and schema generation produced ArticleSchema.
import { ArticleSchema } from '#database/schema'

export default class Article extends ArticleSchema {
  // Add domain behavior/relations here; columns come from schema generation.
}
```

Some upgraded projects still declare models with `BaseModel` and `@column`. Follow the existing project unless performing an intentional migration.

## Database correctness

- Enforce unique keys and foreign keys in the DB, not just validators.
- Add indexes matching query filters, joins and orderings; profile before adding excessive indexes.
- Plan staged rollout for backfills, NOT NULL additions and destructive column changes.
- Use transactions for related writes, and handle concurrent modifications intentionally.
- Avoid dialect-specific SQL unless the project database supports it.
- Distinguish model instance updates (`save()`) from bulk query updates: bulk query-builder updates skip model hooks and automatic timestamp handling.

## Safe delivery

Provide the new migration, changed model, data access change and tests. State whether migration is backward compatible and whether it was actually run.
