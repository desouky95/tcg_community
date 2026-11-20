# PLAT-007: Start scrape by URL

## Outcome and scope

Admin can queue a scrape for LastSticker collection URLs without editing saved JSON configuration.

## Requirements

- Accept 1–20 HTTPS URLs for `www.laststicker.com/cards/...` in a scrape job request.
- Reject invalid or unsupported URLs before queueing.
- Preserve saved collection-key requests and existing job status and artifact behavior.
- Apply the configured request timeout and minimum interval to submitted URLs.

## Acceptance and verification

- Build maintenance: Unused scraper page imports and hook context fields are removed without changing request behavior. Verified by the collector production build; scenario tests were not run.

- A valid URL request returns a queued job and produces a scrape artifact after completion.
- Invalid URLs return validation or unsupported-URL errors without queueing.
- Existing collection-key requests retain their current behavior.
- Verify the admin flow through the API and inspect the resulting job status and artifact.

## UI Page Used

- `apps/web/src/pages/admin/AdminScrapper/AdminScrapper.tsx`
- `apps/web/src/components/patterns/ScrapperModal.tsx`

## Backend API Route Used

- `POST /v1/scrapper/jobs`

## Related Files
- apps/web/src/pages/admin/AdminScrapper/AdminScrapper.tsx

- `apps/api/app/controllers/scrappers_controller.ts`
- `apps/api/app/validators/scraper.ts`
- `apps/api/app/services/scrapers/scrape_job_runner.ts`
- `packages/api-contracts/src/client.ts`
- `packages/react-query/src/hooks.ts`

## After Implementation

- Update this PRD’s UI page, API route, and related-files entries to match the implementation.
