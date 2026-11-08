# HTTP and type-safe patterns — AdonisJS v7

Consult the matching current docs before applying patterns to unfamiliar projects:
- Routing: https://docs.adonisjs.com/guides/basics/routing
- Controllers: https://docs.adonisjs.com/guides/basics/controllers
- Validation: https://docs.adonisjs.com/guides/basics/validation
- Transformers: https://docs.adonisjs.com/guides/frontend/transformers

## Start with the project's installed patterns

- `start/routes.ts` defines routes. Prefer the generated controller barrel where present; it is created by v7 tooling and not hand-edited.
- Static routes can be shadowed by earlier dynamic routes under registration-order matching. Inspect routing order.
- Controller-backed routes can be auto-named; avoid accidental duplicate generated and explicit names.
- If the project uses a different route import arrangement or explicitly disabled barrel generation, stay consistent with it.

## A small API example (adapt names and fields to the real schema)

`app/validators/post.ts`:

```ts
import vine from '@vinejs/vine'

export const createPostValidator = vine.create({
  title: vine.string().trim().minLength(1),
  body: vine.string().trim(),
})
```

`app/controllers/posts_controller.ts`:

```ts
import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator } from '#validators/post'
import PostTransformer from '#transformers/post_transformer'

export default class PostsController {
  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const post = await Post.create(payload)
    return serialize(PostTransformer.transform(post))
  }
}
```

**Response semantics vary by serializer and app contract.** The example uses the official `return serialize(...)` pattern; inspect the project's `providers/api_provider.ts` and controller tests before changing HTTP status codes or response envelopes.

`start/routes.ts` (if generated barrels are enabled):

```ts
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/posts', [controllers.Posts, 'store'])
```

`app/transformers/post_transformer.ts`:

```ts
import { BaseTransformer } from '@adonisjs/core/transformers'
import type Post from '#models/post'

export default class PostTransformer extends BaseTransformer<Post> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'body', 'createdAt'])
  }
}
```

Do not copy this sample unchanged into a project using different fields or output contracts. Verify the `serialize` helper setup and request/response semantics against the installed framework and tests.

## Other v7-specific reminders

- For query-string input, route parameters and headers, use the applicable `request.validateUsing` input selection mechanism as documented.
- Validators are **input contracts**; transformers are **output contracts**. Do not substitute one for the other.
- For paginated Lucid results, inspect `PostTransformer.paginate(rows, paginationMeta)` and confirm the app's serializer response shape.
- Use the current `urlFor` helper where appropriate, instead of introducing deprecated `router.makeUrl` in new code.
- Type generation and generated controller/schema imports depend on the configured v7 hooks and generator setup. If imports are missing, inspect `adonisrc.ts` and generation output rather than creating hand-written files under `.adonisjs/`.
