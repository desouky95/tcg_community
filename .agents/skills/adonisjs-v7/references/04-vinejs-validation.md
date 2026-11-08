# VineJS input validation — AdonisJS v7

Read when introducing user input, API filters, file uploads or database-backed validation.

**Official Markdown:** [Validation](https://docs.adonisjs.com/guides/basics/validation.md) · [Request](https://docs.adonisjs.com/guides/basics/request.md)

## Pattern

Put validators in `app/validators/<resource>.ts`; define schemas around use cases, not database classes. Validate *before* calling services or data models.

```ts
// app/validators/article.ts
import vine from '@vinejs/vine'

export const createArticleValidator = vine.create({
  title: vine.string().trim().minLength(1),
  body: vine.string().trim().minLength(1),
})
```

```ts
// app/controllers/articles_controller.ts
import { createArticleValidator } from '#validators/article'
import type { HttpContext } from '@adonisjs/core/http'

export default class ArticlesController {
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createArticleValidator)
    // Pass validated payload to existing application logic.
    return { title: payload.title }
  }
}
```

## Review points

- Validate create and update separately when optionality differs; never trust raw `request.all()` for persistence.
- Apply `trim`, limits, enum constraints and nested object/array rules according to contract.
- Validate query strings, route params, headers and cookies using documented input-selection hooks/options when required.
- Database `unique` / `exists` rules can help user feedback, but a real UNIQUE/FK constraint remains necessary to prevent races.
- Errors are normally propagated to the global handler and formatted for the client. Do not turn validation failures into HTTP 200.
- Verify uploaded file and image constraints using supported Vine/AdonisJS rules.
- Include tests for invalid shape, empty strings, duplicates, large input and unexpected fields.
