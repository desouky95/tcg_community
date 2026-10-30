---
name: Next Pull
description: A confident, collector-first identity for trading-card discovery and exchange.
colors:
  primary-navy: "#101B2D"
  secondary-blue: "#2979FF"
  signature-lime: "#C7F33B"
  divider: "#B0ADB2"
  paper: "#FCFBF9"
  ink: "#111111"
  deep-ink: "#080808"
typography:
  display:
    fontFamily: "Sora, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 7vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Sora, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.05
  body:
    fontFamily: "Manrope, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Sora, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  control-sm: "44px"
  control: "50px"
  control-lg: "56px"
  gutter: "clamp(20px, 4vw, 64px)"
  section: "clamp(64px, 8vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.primary-navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.control}"
  button-secondary:
    backgroundColor: "{colors.secondary-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.control}"
  input-default:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "{spacing.control}"
---

# Design System: Next Pull

## Overview

**Creative North Star: "The Collector's Signal"**

Next Pull is precise, recognisable, and alive with the anticipation of finding the next card. The system leads with deep navy and quiet paper surfaces, using a bright blue for small moments of direction and a sharp lime for rare, deliberate emphasis. It should feel more like a clear trading signal than a decorative game interface.

The visual voice is bold but not loud: large Sora statements establish confidence, while Manrope keeps product information calm and highly legible. The supplied card-and-spark signature is the brand's most distinctive asset; UI should create the quiet, solid fields that allow it to read cleanly.

**Key Characteristics:**

- Navy-led, paper-grounded, and high-contrast.
- Direct, compact, and collector-first rather than ornamental.
- Bright blue for wayfinding; lime for sparing signature emphasis.
- Crisp geometry, solid surfaces, and controlled state motion.

## Colors

The palette has a clear hierarchy: navy owns the identity, paper and ink carry reading, blue points the way, and lime earns attention.

### Primary

- **Signal Navy:** the identity field for primary navigation, high-confidence actions, and reversed brand panels.

### Secondary

- **Electric Blue:** a compact highlight for links, discovery, active controls, and separators; it should support navy, never replace it as the dominant field.

### Tertiary

- **Signature Lime:** a bright, limited-use accent for keylines, selection emphasis, and a single memorable moment in a view.

### Neutral

- **Quiet Divider:** rules, quiet separators, and low-emphasis boundaries.
- **Collector Paper:** the default light background and reversed-logo field.
- **Reading Ink:** logo use on light backgrounds and primary reading text.
- **Deep Ink:** the terminal stop for deep navy surfaces and controlled gradients.

**The Navy Leads Rule.** Start with navy, paper, and ink. Add blue for direction and lime only for emphasis; the logo itself is always one solid color.

## Typography

**Display Font:** Sora (with Noto Sans Arabic and system sans fallbacks)
**Body Font:** Manrope (with Noto Sans Arabic and system sans fallbacks)
**Arabic Companion:** Noto Sans Arabic Regular/Bold.

**Character:** Sora is the decisive display voice for brand statements, short headings, and labels. Manrope is the even, readable voice for supporting copy, details, and dense product information.

### Hierarchy

- **Display** (Sora Bold, `clamp(3.5rem, 7vw, 6rem)`, 1): major brand statements and page-level moments; preserve natural letter proportions.
- **Headline** (Sora Semibold/Bold, implementation scale, 1.05): short headings and section titles.
- **Body** (Manrope Regular, implementation scale, 1.5): supporting copy and interface descriptions; keep long-form measures near 65-75ch.
- **Label** (Sora Semibold, implementation scale, tracked `0.08em`, uppercase only when it clarifies a compact utility): set labels, counts, and metadata headings.

**The Two Families Rule.** Do not recreate the supplied Next Pull wordmark with Sora or Manrope. Use the supplied outlined logo paths; these families support the signature, not substitute for it.

## Layout

Use generous responsive gutters and broad sectional rhythm. Existing UI tokens establish `clamp(20px, 4vw, 64px)` for page gutters and `clamp(64px, 8vw, 128px)` for major vertical sections. On wide screens, pairs of content regions may share a grid; collapse to one column by 900px so hierarchy stays intact. Controls use a 44px/50px/56px compact/default/large height scale.

Keep brand panels quiet and solid. Use the full logo where the name must read; reserve the symbol for compact spaces, avatars, and mobile. Maintain clear space of at least one eighth of the logo width on every side, use a full logo no smaller than 144px, and use the symbol no smaller than 32px.

## Elevation & Depth

Depth is structural and restrained. Flat paper surfaces, hairline dividers, and tonal contrast do most of the work; shadows appear only where interaction or overlay placement needs a lift. The implementation uses low, lifted, and pop shadows with increasing offset and blur, plus a standard `cubic-bezier(0.2, 0, 0, 1)` transition curve.

**The Quiet Surface Rule.** Do not add gradients, shadows, or busy texture to a logo field. Surface gradients are allowed only as documented brand fields: deep navy to deep ink, navy to electric blue, or electric blue back to navy.

## Shapes

The brand signature is a set of crisp, proportioned card forms and a four-point spark. UI geometry is gently curved at control scale (6px, 8px, 12px, and 16px), with square-to-slightly-rounded panels rather than pill-heavy decoration. Preserve supplied logo paths exactly: no stretching, rotation, shadow, gradient, or retyped wordmark.

## Components

### Buttons

Direct and compact, with a strong semantic color assignment.

- **Shape:** gently rounded (8px) with a 1px border and a 50px default height.
- **Primary:** Signal Navy on Collector Paper for the highest-confidence action.
- **Secondary / Discovery:** Electric Blue with white text for wayfinding and discovery actions.
- **Hover / Focus:** use a modest brightness change on hover; expose a 3px focus outline with 3px offset. Disabled controls lower opacity without losing their shape.

### Cards / Containers

- **Corner Style:** restrained rounded corners (8px to 12px) where a container needs distinction.
- **Background:** Paper or white surfaces against the page field; navy for deliberate brand panels.
- **Border:** Quiet Divider at rest; a state may shift toward Electric Blue.
- **Shadow Strategy:** flat by default; lift only on interactive hover or overlay state.

### Inputs / Fields

- **Style:** white surface, 1px Quiet Divider, and an 8px radius at a 50px default height.
- **Focus:** a visible Electric Blue focus outline; never communicate validity or selection by color alone.
- **Error / Disabled:** retain readable text and a named error treatment; disabled controls reduce opacity and do not invite interaction.

### Navigation

- **Style:** Signal Navy carries identity-heavy navigation and reversed branding. Use the full lockup where the product name must be explicit; use the symbol only in compact contexts.
- **States:** Electric Blue marks discovery, links, and active utility direction; lime is reserved for a single high-value accent rather than persistent navigation chrome.

### Brand Signature

- **Assets:** use the supplied SVG logo variants and symbol variants, not a font reconstruction.
- **On light:** use the navy/ink signature on a quiet paper field.
- **On dark:** use the white reversed signature on Signal Navy or Deep Ink.
- **Small formats:** use the symbol in a square or circular crop only when the full lockup cannot remain legible.

## Do's and Don'ts

### Do:

- **Do** lead a screen with Signal Navy, Collector Paper, and Reading Ink before introducing accents.
- **Do** use Sora Bold/Semibold for statements and headings, and Manrope Regular for supporting UI copy.
- **Do** keep the supplied signature's clear space, proportions, and single-solid-color treatment intact.
- **Do** export supplied artwork as SVG for scalable uses and transparent PNG for quick placement.
- **Do** respect reduced-motion preferences and pair status colors with text, icons, or other non-color cues.

### Don't:

- **Don't** retype, stretch, rotate, shadow, gradient-fill, or otherwise alter the Next Pull wordmark.
- **Don't** let blue or lime dominate a page that should be navy-led.
- **Don't** use a busy, textured, or gradient field behind the signature.
- **Don't** turn every compact control into a pill or use visual decoration in place of product hierarchy.
