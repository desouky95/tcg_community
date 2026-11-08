---
name: ui-web-design
description: Use when designing or implementing this repository's web interfaces with Impeccable or otherwise working with the shared @tcg/ui-web design system.
---

# UI Web Design

Use this skill alongside Impeccable when working on this repository's web UI. Impeccable owns the design process and surface direction; this skill supplies the shared implementation conventions. Honor the user's brief and the existing surface identity while composing with the design system.

## Find the right building blocks

- Read `packages/ui-web/README.md`, the relevant exports in `packages/ui-web/package.json`, and the source of candidate components before choosing props or behavior. The package source is authoritative when documentation or examples drift. Search existing consumers in the target app for integration patterns.
- Prefer `@tcg/ui-web` shared primitives, Radix wrappers, and product patterns when they fit. Compose or extend them when appropriate; create app-local UI for genuinely one-off needs. Put reusable cross-app behavior in the shared package when within the requested scope. Do not force a component that cannot meet the design or interaction requirements.
- Apps consume the package's Radix wrappers, not `@radix-ui/*` directly. Use `@tcg/ui-web/next` for its Next-specific adapters; keep routing and application data at the app boundary. `Button` and `TextLink` support `asChild` for links.
- Use `DataTable` for semantic tables. Give scrollable tables a `scrollLabel`; interactive rows still need a real link or button. Sorting and routing belong to the app.

## Style and integration

- Import `@tcg/ui-web/styles.css` once in an app's global stylesheet if not already present. It includes tokens, foundations, Wax styles, and Tailwind source declarations. Avoid duplicate imports.
- Use shared semantic tokens and Tailwind utilities for composition. Add shared tokens to `packages/ui-web/src/tokens.css`, not duplicate app `@theme` values. Keep page-specific exceptions local; reserve `wax.css` for the brand-art-directed effects and compositions described in the package README.
- Preserve accessible component behavior, dark theme, RTL using logical directions, and reduced-motion support as applicable. Check component APIs rather than assuming their variants or markup.
- Run the relevant app checks and, when changing the package, `pnpm --filter @tcg/ui-web typecheck` and its relevant tests. Follow Impeccable's bounded visual verification when applicable.
