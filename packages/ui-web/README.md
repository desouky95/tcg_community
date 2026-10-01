# @tcg/ui-web

Shared web UI primitives, Radix wrappers, Wax product patterns, and global CSS
layers for the TCG apps.

## Exports

- `@tcg/ui-web`: primary barrel for app usage.
- `@tcg/ui-web/components/primitives`: atoms such as `Button`,
  `IconButton`, `TextLink`, `Input`, `Textarea`, `Label`, `Field`,
  `Surface`, `Badge`, `StatusBadge`, `Skeleton`, `Avatar`, and `Divider`.
- `@tcg/ui-web/components/radix`: the only Radix-facing app API:
  `Dialog`, `AlertDialog`, `DropdownMenu`, `Popover`, `Select`, `Tabs`,
  `Tooltip`, `Accordion`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, and
  `ToggleGroup`.
- `@tcg/ui-web/components/patterns`: shared product molecules including public
  shells, auth fields, search/filter controls, checklist cards, marketplace
  cards, empty states, loading grids, and view toggles.
- `@tcg/ui-web/lib`: shared utilities such as `cn`.

## Reusable Inventory

Atoms centralized here:

- Controls: `Button`, `IconButton`, `TextLink`, `Input`, `Textarea`,
  `Checkbox`, `Switch`, `Slider`, `ToggleGroup`.
- Form structure: `Label`, `Field`, `Select`, `RadioGroup`.
- Feedback and display: `Badge`, `StatusBadge`, `Skeleton`, `Surface`,
  `Divider`, `Avatar`, `CountPill`, `Kicker`.
- Overlays and disclosure: `Dialog`, `AlertDialog`, `DropdownMenu`, `Popover`,
  `Tooltip`, `Tabs`, `Accordion`.

Molecules centralized here:

- App shells: `PublicHeader`, `PublicShell`, `AuthShell`.
- Auth forms: `AuthField`, `AuthInput`, `AuthSelect`, `OtpField`.
- Catalogue: `ChecklistCard`, `ChecklistListItem`, `ViewToggle`.
- Marketplace: `SearchBox`, `FilterSelect`, `MarketplaceToolbar`,
  `MarketplaceCard`, `MarketplaceHeroAction`, `EmptyStatePanel`.
- Public discovery: `SearchRail`, `CategoryIndexItem`, `CategoryRow`,
  `SectionHeading`, `ListingPreview`, `CardSpecimen`, `TrustStrip`,
  `ActivityPanel`, `PublicFooter`.

## CSS Ownership

- Import `@tcg/ui-web/styles.css` once from each app global stylesheet.
- Use Tailwind utilities for route-level layout and one-off composition.
- Use exported components for reusable controls, surfaces, overlays, menus,
  selects, tabs, status, skeletons, empty states, view toggles, and focus
  behavior.
- Add shared behavior through `components/primitives` or `components/radix`
  before adding any new selector to CSS.
- Keep `wax-*` CSS allowlisted for Wax-specific visuals: card specimens,
  pack/gallery effects, swap artwork, editorial hero treatments, complex
  marketplace/card layouts, and page compositions that are intentionally
  brand-art-directed.
- Keep app CSS local only for page-specific exceptions that have one consumer.
- Add new design tokens in `tokens.css`; do not redeclare shared `@theme`
  values in app stylesheets.
- Use semantic Wax utilities such as `min-h-control`, `bg-card`,
  `text-wax-ink`, `border-wax-line`, `shadow-soft`, and `px-gutter`.
  `tokens.css` defines the 50px standard control, 44px compact control,
  paper/navy/red/gold/success roles, dark aliases, radii, and type scale.
- Prefer `ps`/`pe`, `ms`/`me`, `start`/`end`, and `rtl:` variants for
  directional layout. Respect `motion-safe:` for decorative motion.
- As of this migration, `wax.css` is 1,680 lines against the 4,205-line
  baseline. Its remaining rules cover specimen/pack effects and detailed
  collection/marketplace page composition; new ordinary UI belongs in
  components and Tailwind.

## Radix

Radix UI is used as headless behavior inside this package only. Apps should
import Radix-backed wrappers from `@tcg/ui-web` or
`@tcg/ui-web/components/radix` instead of depending on `@radix-ui/*` directly.

Use `asChild` on `Button` and `TextLink` when adapting React Router, Next, or
plain anchors so routing stays at the app boundary while styles stay shared.
