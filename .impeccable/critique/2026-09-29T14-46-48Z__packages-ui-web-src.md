---
target: packages/ui-web/src against docs/DESIGN.md
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/imsail.hassan/Documents/work/mine/tcg-community/packages/ui-web/src"
timestamp: 2026-09-29T14-46-48Z
slug: packages-ui-web-src
---
# UI Kit vs DESIGN.md Critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | Loading and empty components exist, but activity lacks offline/loading/recovery states and duplicate checklist search controls can both enter the accessibility tree. |
| 2 | Match system / real world | 4/4 | Catalogue, set, condition, binder, swap, and marketplace language is specific and understandable. |
| 3 | User control and freedom | 3/4 | Radix menu dismissal and focus restoration work; disabled `Button asChild` links are only visually disabled. |
| 4 | Consistency and standards | 2/4 | Tokens, native controls, shared components, and large Wax selector families compete as styling authorities. |
| 5 | Error prevention | 2/4 | `Field` renders help/error IDs but does not connect `aria-describedby` or `aria-invalid` automatically. |
| 6 | Recognition rather than recall | 3/4 | Labels and product context are generally explicit; specimen and activity states omit required context. |
| 7 | Flexibility and efficiency | 2/4 | Search/filter/view tools exist, but implementations diverge between apps and remain partially duplicated. |
| 8 | Aesthetic and minimalist design | 3/4 | The editorial Wax direction is memorable, but duplicate header actions and oversized red fields weaken discipline. |
| 9 | Error recovery | 2/4 | Empty-state copy is useful; component error contracts, activity recovery, and build-boundary handling remain thin. |
| 10 | Help and documentation | 2/4 | Package inventory and CSS ownership are documented, but component contracts and state examples are incomplete. |
| **Total** |  | **25/40** | **Acceptable, with systemic consolidation debt** |

## Design Specificity Verdict

The interface feels authored for TCG Nexus. The paper stock, navy specimen field, condensed display type, printed metadata, card layering, and Egypt-first product language produce a recognizable collecting environment rather than a generic SaaS skin.

The implementation is less coherent than the visual result. `DESIGN.md` describes a restrained printed system, while the code currently permits three competing systems: Tailwind tokens, reusable components, and 4,205 lines of Wax selectors. That makes the identity expensive to maintain and easy to drift.

The deterministic scan found **120 advisories**: 113 undocumented font-size values and seven colors outside the documented palette, concentrated in `wax.css` with one type-size finding in `component-styles.ts`. Some fluid editorial sizes are legitimate exceptions, but the volume confirms that `DESIGN.md` is not functioning as the actual type ramp.

No reliable browser overlay was produced because the available browser evaluation API is read-only. Fallback evidence came from fresh desktop/mobile browser tabs, accessibility trees, computed layout measurements, keyboard interaction, source inspection, and the CLI detector.

## Overall Impression

This is a strong visual concept sitting on an unfinished design-system migration. The highest-value move is not a redesign. It is to make the token and component layers truthful enough that both apps can reproduce this visual language without depending on a monolithic stylesheet.

## DESIGN.md Compliance Matrix

| Contract area | Status | Evidence |
|---|---|---|
| Paper, surface, navy, ink, red, gold, muted palette | Conforming | Core values match in `tokens.css`. |
| Discovery blue, success green, line color | Divergent | Blue is absent; success and line values differ from the document. |
| Display/body/mono families | Conforming | All three families are represented as theme tokens. |
| Documented type ramp | Divergent | Detector reports 113 off-ramp values. |
| Gutter and section spacing | Conforming | Theme values match the documented clamps. |
| 50px control height | Divergent | Default control is 44px; browser measurement confirmed 44px inputs. |
| Printed borders and restrained shadows | Partial | Borders are common, but radii and large diffuse shadows are more generous than specified. |
| Pills only for filters/status | Divergent | Primary header actions and general buttons use rounded rectangles/pill-like treatment. |
| Paper/navy hierarchy | Conforming | Landing, catalogue, auth, and specimen surfaces use these roles well. |
| Red reserved for action/small punches | Divergent | Marketplace uses a full-width red hero field. |
| Card specimen metadata and action | Partial | Hero cards expose name and set, but not condition/state or a per-specimen action. |
| 1440px rail/editorial composition | Conforming | Desktop pages use broad asymmetric bands and strong rules. |
| Mobile stacking/no horizontal scroll | Conforming | At 390px, hero and trust strip stack to one column with no overflow. |
| Reduced motion | Partial | Global and Wax-specific media rules exist; browser emulation was unavailable. |
| `WaxHeader` contract | Divergent | Only three route entries are defined and desktop renders the join action twice. |
| `SearchRail` contract | Partial | Search exists, but there is no shared `SearchRail`, popular-query button contract, or single canonical implementation. |
| `TrustStrip` contract | Conforming visually | Four icon/heading/explanation items render, but the pattern is duplicated page JSX rather than a shared molecule. |
| `ActivityPanel` contract | Divergent | Synthetic rows are labeled “LIVE ACTIVITY”; loading, offline, and recovery states are absent. |
| Focus and keyboard operation | Partial | Menu focus trap/escape/restore passed; coverage for remaining Radix wrappers is missing. |
| Arabic and RTL | Partial | App direction and a few CSS exceptions exist, but 49 physical-direction declarations remain. |
| Synthetic content disclosure | Partial | Authenticated marketplace says “Demo”; landing activity does not. |

## What's Working

- The landing first viewport is genuinely product-specific: discovery copy and tactile specimens communicate the value without a generic marketing card grid.
- Radix ownership is correctly centralized. Neither app imports `@radix-ui/*` directly, and the mobile dialog passed open, Escape, and focus-restoration checks.
- Shared primitives have clean prop forwarding and typed variants, while Tailwind logical utilities such as `start-*`, `ms-*`, and `ps-*` appear in newer components.

## Priority Issues

### [P1] The token layer does not implement the documented system

Every shared component inherits 44px controls, broader radii, oversized shadows, and noncanonical state colors, so drift propagates automatically. Align line/success/discovery tokens, make 50px the default control, define an explicit compact size, reduce default radii/shadows, and add a documented type scale used by both Tailwind classes and Wax exceptions.

Suggested command: `$impeccable document`

### [P1] Generic UI remains trapped in `wax.css`

The 254 Wax selectors, 15 media-query blocks, 49 physical-direction declarations, and 38 `!important` declarations prevent predictable reuse and make RTL/theme maintenance fragile. Keep only specimen, pack, swap-art, editorial hero, and genuinely complex card/table layouts. Move header, form, search, toolbar, empty/loading, navigation, drawer, and status families into typed Tailwind components.

Suggested command: `$impeccable distill`

### [P1] Shared accessibility contracts are incomplete

`Button asChild` does not prevent keyboard activation when disabled/loading; `Field` makes consumers wire error semantics manually; checklist search renders duplicate IDs and duplicate accessible search fields. Block activation for disabled slotted links, make field/control composition own `aria-describedby` and `aria-invalid`, and render one search input whose position changes without duplication. Add axe and keyboard tests.

Suggested command: `$impeccable audit`

### [P2] Named design contracts are still page-local or semantically incomplete

`CardSpecimen`, `SearchRail`, `TrustStrip`, and `ActivityPanel` are not shared APIs, so the two apps can and already do diverge. The header also has three route definitions and two visible join actions. Promote the four contracts into typed patterns with complete state APIs, provide the missing fourth route through app configuration, and render one desktop CTA plus one dialog CTA.

Suggested command: `$impeccable shape`

### [P2] The package is under-tested and its client boundary is wider than necessary

One six-test file covers only Button, Field, Surface, StatusBadge, EmptyState, TextLink, Dialog, Tabs, and Checkbox. Select, menu, popover, tooltip, accordion, switch, slider, toggle group, product patterns, dark mode, RTL, and loading/error states are unverified. `PublicShell` is client-only solely because it imports `PublicHeader`. Colocate tests per component family, add axe/user-event coverage, keep shell/footer server-compatible, and remove or formally export the unused top-level compatibility barrels.

Suggested command: `$impeccable harden`

## CSS Ownership Classification

- **Allowed Wax effects:** `wax-card-*`, `wax-pack-*`, `wax-swap-*`, specimen/gallery imagery, editorial hero compositions, marketplace card/result/detail layouts, collection table layouts, and authored auth-rail artwork.
- **Move to Tailwind/components:** header/nav/menu/footer/brand, trust/activity rows, section headings, breadcrumbs, search/filter/sort/toolbars, checklist shells, empty/loading states, auth form controls, workspace navigation, account drawer, dashboard controls, badges/counts, and generic action states.
- **Dead/duplicate candidates:** 21 selector names were not found as static references, although dynamic card/relevance suffixes account for six. Five JSX modifier names have no matching selector: `wax-auth-form-signup`, `wax-market-auth-results`, `wax-market-hero-auth`, `wax-market-section-auth`, and `wax-public-hero-catalogue`.

## Component Coverage

- **Primitives:** available and generally typed; Field semantics and slotted-button disabling are partial.
- **Radix wrappers:** all planned wrappers exist and app isolation is clean; only Dialog, Tabs, and Checkbox have interaction tests.
- **Patterns:** auth, checklist, marketplace, shell, search, filter, loading, and view patterns exist; the four named `DESIGN.md` contracts remain missing or page-local.
- **React architecture:** render logic is mostly pure and state is local. The main concern is unnecessarily broad client boundaries, duplicated client search markup, and inconsistent use of shared controls in app routes.

## Persona Red Flags

- **First-time collector:** sees two “Join the club” actions in the desktop header and “LIVE ACTIVITY” that is actually synthetic, weakening trust before signup.
- **Marketplace power user:** encounters different search, radio, sort, save, and view-toggle implementations between public and authenticated marketplace surfaces, so learned interaction patterns do not transfer.
- **Arabic mobile collector:** benefits from logical utilities in new primitives, but 49 physical left/right declarations and sparse RTL selectors make complex collection, marketplace, and drawer layouts high-risk.

## Minor Observations

- The desktop/mobile visual hierarchy is strong and no horizontal overflow was observed at 390px.
- The checklist accessibility tree exposed two search fields with the same `id`.
- Public-web typecheck, UI-kit typecheck, and both test suites pass.
- Web typecheck/build remain blocked by existing `updatePoints` and unused-symbol errors.
- Public-web webpack compilation/typecheck pass, then prerender fails because `/checklists` uses `useSearchParams` without a Suspense boundary.
- Turbopack additionally fails while attempting to bind an internal process port in this environment.
- Current tests do not include axe, contrast assertions, RTL, dark mode, or reduced-motion emulation.

## Questions to Consider

- Should `DESIGN.md` stay deliberately narrow, forcing all editorial exceptions into an explicit allowlist, or expand into a complete type/color ramp?
- Is the large red marketplace hero an intentional exception, or should red return to action ink and small editorial punches?
- Should authenticated workspace UI share the Wax public vocabulary, or receive a quieter operational sub-system built from the same tokens?
