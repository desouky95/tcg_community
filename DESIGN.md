---
name: TCG Nexus — Wax Pack Club
description: A collectible-card community presented like a well-made wax pack: clear set information, tactile specimens, and a direct path from discovery to exchange.
reference: rolls/pop-culture-shelf-wax-pack-card-hero.webp
colors:
  paper: "#F6F0E6"
  surface: "#FFFAF1"
  navy: "#17385E"
  ink: "#102D4D"
  action-red: "#C83430"
  action-red-dark: "#A92A27"
  highlight-gold: "#EFBD35"
  discovery-blue: "#3C8BBD"
  success-green: "#278B55"
  line: "#B9B7B0"
  muted: "#5C6872"
typography:
  display:
    fontFamily: "Roboto Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 7vw, 7.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.055em"
  title:
    fontFamily: "Roboto Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.055em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
  utility:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.68rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.18em"
spacing:
  content-gutter: "clamp(20px, 4vw, 64px)"
  section: "clamp(64px, 8vw, 128px)"
  control-height: "50px"
---

# Design System: Wax Pack Club

## Direction

The supplied `rolls/pop-culture-shelf-wax-pack-card-hero.webp` is the visual
reference for this system. It is a reference for hierarchy and material, not a
literal page to copy. TCG Nexus translates its sports-card language into an
Egypt-first trading-card community: sets, checklists, card specimens, swaps,
and marketplace discovery.

The creative north star is **“the good pull becomes a shared story.”** The
interface should feel like opening a well-designed pack or browsing a trusted
card shop: immediate, legible, a little ceremonial, and always useful.

## Visual grammar

- **Paper ground:** warm cream is the default public surface. It gives the
  product the printed-card character without becoming nostalgic wallpaper.
- **Navy structure:** deep navy carries navigation, specimen fields, strong
  contrast, and sections that need visual weight.
- **Red action ink:** action red is reserved for the primary CTA, availability,
  active trade moments, and small editorial punches.
- **Gold pull:** gold marks a featured pull, reward, highlight, or selected
  discovery moment. It is never the only state signal.
- **Card specimens:** cards are content, not decorative tiles. Every specimen
  needs a name, set/number context, condition or state, and a next action.
- **Printed rules:** use 1–2px borders, dividers, compact labels, restrained
  offset shadows, and rectangular controls. Rounded pills are reserved for
  filters and compact status.

## Typography

Roboto Condensed is the display voice: tall, emphatic, and editorial for hero
claims, set titles, and major section headings. DM Sans is the reading voice
for descriptions and controls. IBM Plex Mono is reserved for card numbers,
conditions, timestamps, filters, and compact catalogue metadata.

Do not use the display face for long paragraphs. Do not use mono as a generic
technical costume. Headlines use uppercase when they behave like printed card
headlines; user-generated names and natural-language copy retain normal casing.

## Layout and interaction

The landing page opens with a two-part first viewport: a search-led product
claim and a physical-feeling card specimen field. The first action is discovery;
joining is the conversion path; marketplace and swaps are visible proof that the
community is alive.

Public surfaces use a max-width 1440px rail, a 12–16 column editorial grid,
strong horizontal rules, and asymmetric content blocks. The mobile layout stacks
the copy before the specimen field, turns the trust strip into a vertical list,
and keeps card imagery visible without horizontal scrolling.

Motion is limited to meaningful material cues: cards lift slightly on hover,
activity can update without layout jumps, and menu/search transitions remain
short. `prefers-reduced-motion` removes lift and transform effects.

## Component contracts

### WaxHeader

Brand lockup, four public routes, sign-in, and one red join action. On small
screens, navigation collapses to a bordered menu. Focus rings remain visible.

### CardSpecimen

An image with meaningful alt text, a printed label, and supporting metadata. A
specimen is never the only way to communicate card identity; text remains in the
DOM.

### SearchRail

One prominent search field accepts cards, sets, or characters. Popular queries
are buttons, not decorative tags. Submit routes to the checklist surface with a
query parameter.

### TrustStrip

Four short proof points for catalogue, collection, trade, and community. Each
uses icon, heading, and explanatory text so meaning never depends on color alone.

### ActivityPanel

Synthetic activity is explicitly framed as live community activity. Names,
action, location context, and time are separate fields. Empty, offline, and
loading states must preserve the same panel shape and provide recovery guidance.

## Accessibility and content rules

- Maintain readable contrast between paper, navy, red, and muted text.
- Keep visible `:focus-visible` treatment on every link, button, and field.
- Pair red, gold, and green with text or iconography; never use color alone.
- Preserve keyboard operation for search, menu, filters, and specimen links.
- Provide meaningful alt text for card imagery and empty-state explanations.
- Keep copy natural when translated to Arabic and allow headline wrapping.
- Treat synthetic marketplace/activity data as demonstration content, not claims.

## Do / do not

Do use real product terms such as catalogue, set, checklist, collection, swap,
listing, and condition. Do let card content carry the visual interest. Do keep
the first viewport useful even if imagery fails.

Do not copy the reference's baseball content, logo, claims, or subscription
model. Do not recreate the page as a screenshot. Do not turn every section into
a rounded card, use generic gradients, or bury marketplace actions beneath a
purely editorial hero.
