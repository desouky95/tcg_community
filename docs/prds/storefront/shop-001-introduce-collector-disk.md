# SHOP-001: Introduce Collector Disk


## Outcome and scope

A visitor can discover the upcoming Collector Disk features and continue to the Next Pull store.

## Requirements

- Present swapping, collection tracking, and marketplace listing as coming soon, without a launch date.
- Provide a clear path to the Next Pull store and link to this page from storefront navigation.
- Present each feature in one pinned scroll-driven illustration using Motion: a missing card joins a collection and updates it; a collector searches for and swaps cards; and a buyer purchases a listing followed by an illustrative wallet payment. A recognizable featured card carries the story. These previews do not create or change collector data.
- Respect reduced-motion preferences and keep all feature descriptions available without interaction.
- Keep the featured card continuous at pinned-section boundaries, preserving its border and rotation while aligned with its scene when scrolling in either direction or resizing. Each pinned scene animates its own card; a separate card bridges only the transitions.

## Acceptance and verification

- Visitors can find all three features and navigate to the shop on desktop and mobile.
- Links are keyboard accessible and do not imply the future features are available today.
- Verify forward and reverse scrolling, pinned timeline cleanup, direct section navigation, reduced motion and no-JavaScript fallbacks, and readable layouts at mobile and desktop sizes.

## UI Page Used
- /collector-disk

## Backend API Route Used
- N/A — no HTTP route

## Related Files
- apps/public-web/app/(shared-layout)/collector-disk/page.tsx
- apps/public-web/app/(shared-layout)/collector-disk/collector-scenes.tsx
- apps/public-web/app/(shared-layout)/collector-disk/collector-disk.module.css
- packages/ui-web/src/collector-scenes.test.jsx
- apps/public-web/app/(shared-layout)/page.tsx
- apps/public-web/app/(shared-layout)/layout.tsx
- packages/ui-web/src/components/next/public-header/index.tsx
- packages/ui-web/src/components/next/public-shell/index.tsx

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
