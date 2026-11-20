# Technical architecture

## Collector production build

`pnpm --filter=@tcg/web build` runs TypeScript before Vite bundling. Keep strict unused-code checks enabled. Collector forms omit development-only debug panels that resolve incompatible React Hook Form peer types. Existing authentication destination coverage imports the current storefront module and declares the Node types required by that module. Tests remain included in typechecking, but are not executed by this build.

Shared UI maintenance removes unused imports and animation declarations, forwards checklist row class names to links, and exports the existing previous-value hook through its barrel. The seller dashboard reads category counts from the API response data envelope. The animation playground removes unused state and variants.

Verification: collector production build and `pnpm --filter @tcg/ui-web typecheck` passed. Vite reports a non-blocking bundle size warning. No application tests or browser checks were run.

## UI Page Used
- N/A — shared guidance

## Backend API Route Used
- N/A — shared guidance

## Related Files
- apps/web/src/lib/auth-destination.test.ts
- apps/web/src/pages/seller/SellerDashboard.tsx
- apps/web/src/pages/Test.tsx
- packages/api-contracts/src/client.ts
- packages/react-query/src/hooks.ts
- packages/ui-web/src/components/patterns/checklist-card/index.tsx
- packages/ui-web/src/components/patterns/checklist-list-item/index.tsx
- packages/ui-web/src/components/patterns/native-link/index.tsx
- packages/ui-web/src/components/primitives/brand-logo/index.tsx
- packages/ui-web/src/components/primitives/page-heading/index.tsx
- packages/ui-web/src/hooks/usePreviousValue.ts
- packages/ui-web/src/hooks/useSearchParam.ts
- docs/prds/README.md
- AGENTS.md

## After Implementation
- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
