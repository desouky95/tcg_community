# Testing, debugging and v6→v7 upgrades

Official references:
- https://docs.adonisjs.com/guides/testing/introduction
- https://docs.adonisjs.com/v6-to-v7
- https://docs.adonisjs.com/releases

## Testing workflow

1. Read `package.json` scripts and existing `tests/bootstrap.ts`, suite config in `adonisrc.ts`, Japa plugins and setup hooks before choosing commands.
2. Extend or create the narrowest useful Japa test. Cover successful request, invalid input, missing/not-owned resources, and changed relationships or serialization.
3. Verify test isolation: dedicated test DB, transactions or reset strategies consistent with the project's harness. Do not point tests to production.
4. Run targeted tests first. Typical entry point is `node ace test`; consult the installed command's help and project scripts for filtering or suite selection.
5. Run the repo's typecheck/lint/format/build scripts when present. Report which checks actually ran, their exit codes, and any unresolved failures.

### Regression matrix

| Change | Minimum checks |
| --- | --- |
| Route/controller | expected status + body + not-found behavior |
| Validation | invalid fields, coercions, forbidden extra input |
| Auth/policy | anonymous, wrong owner, allowed owner, privilege boundary |
| ORM query | empty, duplicate, relation-loaded, pagination, tenant scope |
| Schema/migration | up/down strategy, constraints, backfill, test dialect |
| Import/background job | idempotency, partial failure, retry, user data preservation |
| Transformer | permitted fields, hidden fields, loaded vs unloaded relations |

## Debugging order

1. Reproduce with the smallest request/test, record exact stack trace and installed package versions.
2. Inspect route registration and middleware: `node ace list:routes` is useful for matching issues.
3. Check validator errors, auth guard selection, schema/column names, generated types and DB queries before changing application design.
4. Consult official docs and installed TypeScript declarations for v7 behavior; avoid speculative API changes.
5. Fix the underlying bug; add a regression test.

## Upgrade from v6 to v7: separate project

Do not silently mix upgrades into feature work. Plan and execute the migration explicitly using the official guide. Key preflights:

- Node.js 24+ for developer machines, CI and production.
- Package compatibility and TypeScript/tooling upgrades, including v7 generation hooks in `adonisrc.ts`.
- Generated barrels/routes and URL builder differences; avoid creating imports the generator has not produced.
- Renamed HTTP request/response APIs, changes to encryption configuration and legacy ciphertext compatibility.
- Updated VineJS, Auth, Inertia, Lucid and test-suite integration where relevant.
- Migration and encryption rollback/backfill strategy; CI checks and deployment plan.

Avoid a blind search-and-replace across v6 code: verify each change by installed types and tests.
