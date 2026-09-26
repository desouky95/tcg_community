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
| `/collection/:id` | Public card index | Implemented |
| `/marketplace` | Browse listings | Mock implemented |
| `/marketplace/:id` | Listing detail | Mock implemented |

## Collector workspace

| Route | Page | Implementation | Design-system adaptation |
| --- | --- | --- | --- |
| `/dashboard` | Collector desk and catalogue selection | Implemented | Complete |
| `/collection/:id/edit` | Personal checklist editor | Implemented | Complete |
| `/swapping` | Swap discovery | Implemented | Complete |
| `/chat` | Conversation inbox | Implemented | Complete |
| `/chat/:id` | Conversation detail and deal actions | Implemented | Complete |
| `/profile` | Own collector profile | Implemented | Complete |
| `/profile/edit` | Profile and swap-preference editor | Implemented | Complete |
| `/profile/:id` | Collector profile detail | Implemented | Complete |
| `/marketplace/sell` | Create and edit a listing | Planned | Not started |
| `/checkout/:listingId` | Buyer checkout and payment intent | Planned | Not started |
| `/orders/:id` | Order status and payment events | Planned | Not started |
| `/swaps/:id` | Swap deal detail, QR, and handoff state | Planned | Not started |
| `/notifications` | Account, trade, and moderation notifications | Planned | Not started |
| `/settings` | Language, theme, privacy, and session controls | Planned | Not started |

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

`apps/web/src/lib/mockData.ts` is the development fallback for catalogue,
collection summary, and marketplace listing data. API hooks attempt the existing
AdonisJS endpoints first and fall back to these fixtures when the backend is not
running, so the client can be designed and reviewed independently.
