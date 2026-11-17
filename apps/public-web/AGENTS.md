# Public storefront UI guidance

Before changing UI code in this directory, read and follow `.agents/skills/ui-web-design/SKILL.md`.

Use Tailwind CSS utilities for styling. Do not create new CSS files or custom CSS rules; existing styles do not need a separate migration.

Keep components focused. Split large components into smaller components with clear responsibilities, using judgment rather than a fixed line limit.

Use components from `@tcg/ui-web`. When a needed component does not exist, create it in `packages/ui-web` and use it from the storefront.

Update the matching PRD under `docs/prds/` when a UI page, API route dependency, or directly related file changes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
