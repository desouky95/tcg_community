---
name: TCG Nexus
description: An Egypt-first collector desk for organising, discovering, trading, and buying cards with confidence.
colors:
  graphite-950: "#0B0F14"
  graphite-900: "#121820"
  graphite-800: "#1A232D"
  paper: "#F4F0E8"
  slate: "#9BA7B5"
  ember: "#F26B3A"
  ember-deep: "#DB5428"
  cobalt: "#4E7BFF"
  mint: "#63C6A2"
  border: "#2B3744"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  control: "10px"
  panel: "18px"
  card: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ember-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
    padding: "16px 28px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.graphite-900}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "16px 28px"
    height: "48px"
  card:
    backgroundColor: "{colors.graphite-900}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "32px"
  input:
    backgroundColor: "{colors.graphite-800}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: TCG Nexus

## Overview

**Creative North Star: “The Collector’s Index Desk”**

TCG Nexus treats the interface like a considered collector’s workspace: a
graphite desk mat, indexed binder tabs, card sleeves, catalogue labels, and
small moments of discovery. The system is tactile and editorial without
becoming nostalgic or decorative. Surfaces stay dark and calm so card imagery,
metadata, and trade actions remain legible.

The landing page extends this world through an asymmetric hero, card fan,
catalogue-style feature panels, a moving pack shelf, and an expandable
checklist drawer. The wider product should preserve the same hierarchy: paper
white for meaning, slate for supporting information, ember for action and trade
state, cobalt for discovery, and mint for confirmed states.

**Key Characteristics:**

- Dark graphite foundation with warm paper text.
- Tactile catalogue and binder-index references.
- High information clarity with restrained surface decoration.
- One obvious primary action per screen.
- Motion that explains cards entering, opening, or being inspected.

## Colors

The palette is a dark collector desk with warm action ink and a cool discovery
marker. Functional color is always paired with text, iconography, or position.

### Primary

- **Ember** (#F26B3A): Primary action, active tab, trade opportunity, and
  progress emphasis.
- **Ember Deep** (#DB5428): Button resting surface where stronger contrast is
  needed.

### Secondary

- **Cobalt** (#4E7BFF): Discovery links, selected data, and catalogue wayfinding.
- **Mint** (#63C6A2): Confirmed and complete states.

### Neutral

- **Graphite 950** (#0B0F14): Application background and deepest desk surface.
- **Graphite 900** (#121820): Navigation, panels, and cards.
- **Graphite 800** (#1A232D): Elevated surfaces and input backgrounds.
- **Paper** (#F4F0E8): Primary text and high-importance content.
- **Slate** (#9BA7B5): Metadata, helper text, and secondary copy.
- **Border** (#2B3744): Dividers and quiet component boundaries.

### Named Rules

**The Action Ink Rule.** Ember should identify the action or state that matters;
it should not become a general-purpose decoration across every surface.

## Typography

**Display Font:** Space Grotesk (with ui-sans-serif, system-ui)

**Body Font:** DM Sans (with ui-sans-serif, system-ui)

**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace)

**Character:** Space Grotesk gives the product a confident, geometric display
voice. DM Sans keeps longer collector copy approachable and readable. IBM Plex
Mono is reserved for card numbers, counts, prices, IDs, and compact catalogue
labels.

### Hierarchy

- **Display** (700, clamp 3rem–5.5rem, line-height 1): Hero statements and
  major landing-page claims.
- **Headline** (700, clamp 2.25rem–4.5rem, line-height 1.05): Large section
  statements and conversion moments.
- **Title** (700, 1.5rem, line-height 1.2): Feature and panel titles.
- **Body** (500, 1rem, line-height 1.5): Explanatory copy; keep measures
  readable and avoid dense full-width paragraphs.
- **Label** (600, 0.625rem, 0.16em tracking, uppercase): Catalogue labels,
  archive metadata, and small state descriptors.

### Named Rules

**The Data Has a Uniform Rule.** Mono type is for data and measurement, not for
all copy or as a generic “technical” costume.

## Layout

Use a max-width content rail with responsive gutters of 16px on small screens,
24px on medium screens, and 32px on large screens. The landing page uses an
asymmetric two-column hero: copy owns roughly half the desktop width and the
card fan owns the other half. Below the fold, the feature area uses a four-column
grid with one wider featured panel.

The page rhythm follows compact control groups, 24–32px panel padding, and
large section separation around 96px. On small screens, columns stack, the card
fan remains visible near the hero, and content must never require horizontal
scrolling. Deep views should use the same navigation placement and preserve a
clear back path.

## Elevation & Depth

TCG Nexus uses tonal layering first and soft ambient shadows second. Graphite
900 and graphite 800 provide most of the depth; borders are quiet and shadows
appear where a card or primary action needs lift. Avoid hard offset shadows and
avoid blur as decoration. Blur is reserved for the checklist expansion overlay.

### Shadow Vocabulary

- **Primary action lift** (`0 20px 32px rgba(242, 107, 58, 0.20)`): Resting
  depth for the main CTA.
- **Card lift** (`0 24px 60px -20px rgba(242, 107, 58, 0.55)`): Focused featured
  card in the hero fan.
- **Modal separation** (`backdrop-filter: blur(8px)` with a dark scrim):
  Checklist preview overlay only.

### Named Rules

**The Tonal Desk Rule.** Surfaces should read as different materials through
background value and border contrast before adding a shadow.

## Shapes

Controls use a 10px radius, content panels use 16–18px radii, and pills are
reserved for compact status or filter controls. Cards use a single quiet border
and modest rounding rather than nested rounded containers. Card imagery may use
slightly softer corners to suggest sleeves, but the surrounding UI stays
precise and rectangular enough to feel indexed.

## Components

### Buttons

- **Shape:** 10px radius with a minimum 48px height.
- **Primary:** Ember Deep background, white text, 16px 28px padding, and a soft
  ember shadow.
- **Hover / Focus:** Shift to Ember on hover; use a visible 3px focus ring with
  an offset; active state may compress subtly without moving surrounding layout.
- **Secondary:** Graphite 900 or card background with a border and paper text.

### Cards / Containers

- **Corner Style:** 16px standard card; 18px larger panel.
- **Background:** Graphite 900 for cards and Graphite 800 for elevated content.
- **Shadow Strategy:** Tonal separation by default; soft shadow for featured
  cards and action states.
- **Border:** 1px Border token; Ember or Cobalt only for active/focused state.
- **Internal Padding:** 24–32px for content panels; 16–20px for compact cards.

### Inputs / Fields

- **Style:** Graphite 800 background, quiet Border stroke, 10px radius, and
  12px 16px padding.
- **Focus:** Ember border/ring with a visible focus state.
- **Error / Disabled:** Use semantic text and icon cues in addition to color.

### Navigation

The navigation is a transparent or lightly layered top bar on public surfaces.
Use the full TCG Nexus lockup with generous clear space. Public navigation keeps
catalogue exploration, sign in, and sign up visible on large screens and moves
secondary actions into an accessible compact control on small screens.

### Card Fan and Pack Gallery

Card imagery is the visual lead. `CardFan` uses scroll-linked spread motion and
keeps the center card as the featured specimen. `PackGallery` is a continuously
moving shelf that pauses on hover; it should also respect reduced motion. Both
components must keep meaningful alt text and should never obscure the primary
action.

### Checklist Preview

Checklist tiles use Framer Motion shared-layout transitions. Opening a tile
creates a dark scrim and a larger catalogue panel; rows stagger into view. The
panel must have a labelled close control, keyboard activation, and a visible
focus state.

## Do's and Don'ts

### Do:

- **Do** use Graphite 950, Graphite 900, Graphite 800, Paper, Slate, Ember,
  Cobalt, and Mint as the primary visual vocabulary.
- **Do** keep one obvious primary CTA per screen.
- **Do** use Space Grotesk for display, DM Sans for body copy, and IBM Plex
  Mono only for data or compact labels.
- **Do** preserve the card, checklist, and pack motion language across new
  collector surfaces.
- **Do** provide visible keyboard focus, readable contrast, reduced-motion
  behavior, and non-color-only state communication.

### Don't:

- **Don't** introduce generic purple SaaS gradients, neon cyberpunk styling, or
  excessive glassmorphism.
- **Don't** use hard offset block shadows outside a deliberately brutalist
  surface.
- **Don't** use emoji or Unicode glyphs as structural icons.
- **Don't** use color alone to communicate ownership, availability, trust, or
  moderation state.
- **Don't** turn mono type into the default voice for prose.
