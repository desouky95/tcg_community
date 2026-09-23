# TCG Nexus client page inventory

This is the route inventory for the first web client. The current React/Vite
implementation covers the existing collection, checklist, account, swap, chat,
and admin flows plus the first marketplace browse surface. The remaining routes
are named now so web and mobile contracts can grow from the same vocabulary.

## Public

| Route | Page | State |
| --- | --- | --- |
| `/` | Landing / product entry | Implemented |
| `/login` | Sign in | Implemented |
| `/signup` | Create account | Implemented |
| `/verify-otp` | Verify mobile OTP | Implemented |
| `/checklists` | Explore catalogues | Implemented |
| `/s/:categoryId` | Category / set detail | Implemented |
| `/marketplace` | Browse listings | Mock implemented |
| `/marketplace/:id` | Listing detail | Mock route placeholder |

## Collector workspace

`/dashboard`, `/collection/:id`, `/collection/:id/edit`, `/swapping`,
`/chat`, `/chat/:id`, `/profile`, `/profile/edit`, and `/profile/:id` are
implemented in the current baseline. The planned additions are:

- `/marketplace/sell` — create and edit a listing
- `/checkout/:listingId` — buyer checkout and payment intent
- `/orders/:id` — order status and payment events
- `/swaps/:id` — swap deal detail, QR, and handoff state
- `/notifications` — account, trade, and moderation notifications
- `/settings` — language, theme, privacy, and session controls

## Administration

`/admin`, `/admin/users`, `/admin/collections`, and `/admin/categories` are
implemented. Planned catalogue and marketplace operations are:

`/admin/catalogue/import`, `/admin/listings`, `/admin/reports`,
`/admin/payments`, and `/admin/audit-log`.

## System and shared states

The client must provide reusable 404, 403, offline recovery, maintenance,
loading/skeleton, empty collection, empty search, and API error states. These
are product surfaces, not afterthoughts: each should explain the cause and the
next action in the TCG Nexus voice.

## Mock-data boundary

`client/src/lib/mockData.ts` is the development fallback for catalogue,
collection summary, and marketplace listing data. API hooks attempt the existing
AdonisJS endpoints first and fall back to these fixtures when the backend is not
running, so the client can be designed and reviewed independently.
