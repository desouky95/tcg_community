---
version: 1
slug: "yout-store-components-product-listing-tsx-8e03f381"
primary_target: "apps/public-web/app/(shared-layout)/(store)/_components/product-listing.tsx"
related_targets:
  [
    "apps/public-web/app/(shared-layout)/(store)/collections/[handle]/page.tsx",
    "apps/public-web/src/components/homepage-product-section.tsx",
  ]
---

# Missing-list product cards

Scope: public storefront product-card component and its listings. Visitor mode: Experience.
Audience/job: collectors browse missing-list packs, preview stickers, then view or buy the product.
Action/task: Open pack reveals the supplied sticker images on page; a distinct product link opens normal details. Normal cards retain their current behavior.
Proof/content: Medusa product metadata identifies `type: "missing_list"`; CMS supplies the pack thumbnail and sticker image array. No invented sticker art or product claims.
Constraints: inherit Next Pull's established design system; preserve responsive listing, keyboard access, reduced-motion support, and existing normal-card links.
Unresolved decisions: none for this extension.

## Direction contract

THESIS: Make the missing-list product feel like a collectible pack worth opening, while keeping product details and buying one clear step away.
OWN-WORLD: Reuse the storefront's navy, paper, ink, restrained geometry, and shared controls. Product artwork leads; compact type labels and direct actions carry meaning.
STORY: Collectors recognize a missing-list pack, open it to preview its sticker images, then use the separate product link to view or buy. Normal products remain familiar.
FIRST VIEWPORT: Keep the existing responsive product grid and card scale. On each missing-list card, show pack cover and type label first, with one floating Open pack action over the artwork. Put title and price below; the title links to product details. The action starts the existing pack animation inline with the CMS sticker set.
FORM: Two explicit card types, sharing listing context; missing-list uses an inline pack-opening interaction with one floating action, normal uses the established card. Narrow extension; no concept tournament. Seed key: missing-list-card-extension.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
