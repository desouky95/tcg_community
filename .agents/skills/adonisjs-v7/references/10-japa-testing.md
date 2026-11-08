# Japa tests — AdonisJS v7

Read when writing unit/functional tests, testing APIs or avoiding unsafe test databases.

**Official Markdown:** [Testing introduction](https://docs.adonisjs.com/guides/testing/introduction.md) · [API tests](https://docs.adonisjs.com/guides/testing/api-tests.md)

## Test strategy

- AdonisJS uses Japa; inspect `tests/bootstrap.ts`, registered suites and enabled plugins first.
- Prefer functional tests that exercise the real HTTP stack for endpoints: routing, validation, middleware, auth, database and transformers.
- Use unit tests for isolated domain logic; don't over-mock framework behavior that functional tests can cover.
- Use project-specific route names or URLs and a declared JSON content type as appropriate.

```ts
import { test } from '@japa/runner'

test.group('Articles API', () => {
  test('rejects invalid input', async ({ client }) => {
    const response = await client.post('/articles').json({ title: '' })
    response.assertStatus(422)
  })
})
```

This snippet assumes an API endpoint exists and Japa's API client plugin is configured. Adapt expected status or envelope only to documented contracts.

## Database tests

- Verify `NODE_ENV=test` / `.env.test` and database connection before running.
- Use the project's supported DB lifecycle helpers (migration, truncate or transaction) and controlled fixtures; never test against unknown production credentials.
- Plan isolation across parallel workers and external services.
- For token/session auth, check whether test bootstrap includes the corresponding auth API client plugins before calling test helpers.

## Minimum cases for a mutation

Success, missing/invalid input, unauthenticated, forbidden resource, not found, uniqueness conflict and a transaction failure/concurrency case where relevant.

Run the narrowest suite first; report actual commands and result, not an assumed pass.
