# Transformers and API contracts — AdonisJS v7

Read for DTO-like responses, JSON API shapes, relationship inclusion and pagination.

**Official Markdown:** [Transformers](https://docs.adonisjs.com/guides/frontend/transformers.md) · [Type-safe API Client](https://docs.adonisjs.com/guides/frontend/api-client.md)

## Output contracts

Transformers explicitly shape outbound JSON. They are not request validators. Confirm the app has configured `serialize` (often via an API provider) before using these examples.

```ts
import { BaseTransformer } from '@adonisjs/core/transformers'
import type Article from '#models/article'

export default class ArticleTransformer extends BaseTransformer<Article> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'createdAt'])
  }
}
```

```ts
// Inside an HTTP controller where `serialize` is installed.
return serialize(ArticleTransformer.transform(article))
```

## Query and serialization alignment

- Preload relations explicitly before referencing them from transformer logic; serialization cannot invent missing data.
- For collections use `.transform(rows)`; for pagination use `ArticleTransformer.paginate(paginator.all(), paginator.getMeta())`.
- Check wrapper behavior in `providers/api_provider.ts`: starter-kit serializer may wrap results in `data`; never assume every app has identical envelopes.
- Use variants for intentionally different resource presentations instead of copy-pasting transformations.
- Generated frontend types may appear under `.adonisjs/client`; do not maintain manual duplicates when generation already covers the contract.
- Keep permissions and ownership decisions out of uncontrolled preloads or public JSON fields.

## Regressions to test

Date representation, nullable relations, absent preloads, collection vs item envelopes, pagination metadata, secret exclusion, frontend-generated type compatibility, and backward-compatible field names.
