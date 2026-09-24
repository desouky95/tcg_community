---
target: landing page
total_score: 16
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 4
target_identity: "file:/Users/imsail.hassan/Documents/work/mine/tcg-community/client/src/pages/Landing.tsx"
target_fingerprint: "sha256:9fbc7bcb80f7d6ef61ed44040835d79b6f3402542c4560492630df7432d65141"
target_path: /Users/imsail.hassan/Documents/work/mine/tcg-community/client/src/pages/Landing.tsx
timestamp: 2026-09-24T09-29-45Z
slug: client-src-pages-landing-tsx
---
## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | Checklist open state and progress semantics are incomplete. |
| 2 | Match System / Real World | 1/4 | Copy still describes stickers, albums, and a “transfer market.” |
| 3 | User Control and Freedom | 1/4 | Checklist preview has no Escape handling or focus management. |
| 4 | Consistency and Standards | 2/4 | Visual system is cohesive, but terminology and public navigation are inconsistent with the product. |
| 5 | Error Prevention | 3/4 | Landing actions are simple, but the interactive preview has weak modal safeguards. |
| 6 | Recognition Rather Than Recall | 2/4 | Mobile public navigation is icon-only and unlabeled. |
| 7 | Flexibility and Efficiency | n/a | Not materially applicable to a persuade-mode landing page. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Strong authored visual direction, with some generic card-grid and accent repetition. |
| 9 | Error Recovery | 2/4 | The preview can close by click, but not reliably by keyboard. |
| 10 | Help and Documentation | n/a | Not materially applicable to this landing surface. |
| **Total** |  | **16/32** | **Acceptable; significant improvements needed** |

## Design Specificity Verdict

The landing page feels more authored than a generic SaaS template: the asymmetric hero, card fan, catalogue labels, graphite surfaces, and checklist expansion create a recognizable collector-desk language.

The main loss of specificity is product truth. The visuals say TCG Nexus, but the copy still says “sticker,” “album,” and “transfer market.” The feature section also falls back to a familiar three-card SaaS pattern.

The deterministic detector found one warning: Space Grotesk is widely used. This is a false positive because Space Grotesk is an explicit TCG Nexus brand commitment.

## Overall Impression

The page has a strong visual foundation and a good card-led focal point. The biggest opportunity is to make the product unmistakably about TCG card collecting and bring the interactive motion up to the same accessibility standard as the visual design.

## What’s Working

- The asymmetric hero gives the product a clear focal point and supports the Collector’s Index Desk direction.
- Card imagery has meaningful alt text and the center card is clearly treated as the featured specimen.
- The Framer Motion language is purposeful: hero entrance, staggered feature reveal, card spread, moving pack shelf, and checklist inspection support the collector metaphor.
- The graphite / paper / ember palette is coherent and distinctive.

## Priority Issues

### [P0] Product language still describes the wrong product

`en.json` still includes “Professional Sticker Nexus,” “Join the Transfer market,” “Sticker History,” “Find your lucky pack,” and “COMPLETE EVERY ALBUM.” Rewrite the landing translations around cards, collections, catalogues, missing cards, trusted trades, and marketplace discovery. Update Arabic copy at the same time.

### [P1] The primary CTA and public discovery path are misaligned

The primary CTA says “Join the Transfer market” but routes to `/signup`. Public navigation exposes “Checklists” but not marketplace browsing or catalogue exploration. Choose one clear conversion promise—such as “Start your collection”—and make the secondary action “Explore the catalogue.”

### [P1] Motion does not honor reduced-motion preferences

Framer Motion entrances, scroll-linked `CardFan` movement, and the infinite `PackGallery` animation continue despite the current reduced-motion CSS. Use `useReducedMotion()`, disable the infinite animation when requested, and provide a non-hover pause path.

### [P1] Checklist preview is not an accessible modal/dialog

The expanded checklist has no dialog semantics, `aria-modal`, labelled heading, Escape handling, focus movement, or focus containment. Implement a real dialog pattern, restore focus on close, expose `aria-expanded`, and make the close button at least 44×44px.

### [P1] Checklist progress widths are broken in production CSS

Tailwind classes are constructed dynamically as `w-${card * 25}` and `w-${expandedCard * 25}`. Use an explicit width map or inline percentage styles.

## Persona Red Flags

**Jordan — First-Timer:** “Transfer market” is ambiguous; the CTA destination is unclear; mobile account navigation is unlabeled.

**Sam — Accessibility-Dependent User:** The preview is not semantically modal, focus can move behind the overlay, reduced motion is incomplete, and duplicate gallery items are exposed to assistive technology.

**Riley — Stress Tester:** Progress bars can silently render at the wrong width; the fixed card fan may clip on narrow phones; the full TypeScript build is blocked by unrelated repository errors.

## Minor Observations

- The three feature panels repeat a generic icon + label + title + description structure.
- Ember is used across many unrelated elements, reducing CTA priority.
- The infinite gallery exposes triplicated pack content to assistive technology.
- Light mode may split the visual language because the page becomes cream/white while `CardFan` remains dark.
- Public navigation has no direct marketplace entry point.

## Questions to Consider

- Should the primary promise be “Start your collection,” “Explore the catalogue,” or “Find cards to trade”?
- Should the next fix prioritize product copy/navigation or accessibility/motion behavior?
- Should the landing page remain dark-only, or should it receive a designed light-mode treatment?
