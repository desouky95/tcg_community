# PRD coverage matrix

This is the canonical forward trace from product scenario to client surface, interface, backend owner, data, and asynchronous effects. Reverse coverage is obtained by searching the route, operation, entity, event, or job name in this table. Existing evidence and implementation gaps are recorded in each linked PRD and in the master inventory.

## Repository baseline

- Current public routes: `/`, `/login`, `/signup`, `/verify-otp`, `/checklists/*`, `/s/:categoryId`, `/collection/:id`, `/marketplace`, and `/marketplace/:id`.
- Current protected routes: `/dashboard`, `/collection/:id/edit`, profile, swapping, chat, and current admin routes.
- Planned web routes: seller listing, checkout, order, swap detail, notifications, settings, catalogue import, listing moderation, reports, payments, and audit log.
- Current REST domains: auth, categories, checklists, users/reviews, admin user blocking, user-checklists, account/profile, swaps, conversations, and swap-deals.
- Current database domains: users/tokens, categories, checklists/cards, reviews, user checklists, queue tables, conversations/messages, and swap deals. Marketplace transaction tables are target schema, not current implementation.
- The client-only `/test` route and backend root `GET /` hello-world handler are development diagnostics, not product scenarios; they are intentionally excluded from the PRD inventory and must not ship as public production capabilities.

## Route-to-PRD coverage

| Route or route family | Owning PRDs |
| --- | --- |
| `/` | SYS-014 |
| `/login` | AUTH-005–AUTH-007 |
| `/signup` | AUTH-001–AUTH-002 |
| `/verify-otp` | AUTH-003–AUTH-004, AUTH-012 |
| `/checklists/*` | CAT-001, CAT-003–CAT-006 |
| `/s/:categoryId` | CAT-002 |
| `/collection/:id` | COL-004 |
| `/marketplace` | LIST-001–LIST-002 |
| `/marketplace/:id` | LIST-003–LIST-006, LIST-015 |
| `/dashboard` | COL-001–COL-002 |
| `/collection/:id/edit` | COL-003, COL-005–COL-010, COL-012 |
| `/profile`, `/profile/edit`, `/profile/:id` | AUTH-010–AUTH-013, REV-001–REV-005 |
| `/swapping`, `/swaps/:id` | SWAP-001–SWAP-018 |
| `/chat`, `/chat/:id` | CHAT-001–CHAT-011 |
| `/marketplace/sell` and seller inventory | LIST-007–LIST-013, LIST-017–LIST-018 |
| `/checkout/:listingId` | CHK-001–CHK-005, PAY-001–PAY-005 |
| `/orders`, `/orders/:id` | CHK-006–CHK-008, PAY-009–PAY-014, FUL-001–FUL-007, DSP-001–DSP-008 |
| `/notifications` | NTF-001–NTF-005 |
| `/settings` | AUTH-008, AUTH-014–AUTH-017, NTF-006 |
| `/admin` | ADM-001 |
| `/admin/users` | ADM-002–ADM-004, ADM-013 |
| `/admin/collections`, `/admin/categories` | CAT-007–CAT-013 |
| `/admin/catalogue/import` | CAT-014–CAT-016 |
| `/admin/listings` | LIST-016, ADM-005 |
| `/admin/reports` | REV-006, ADM-006, DSP-004–DSP-006 |
| `/admin/payments` | PAY-010–PAY-013, ADM-007–ADM-008 |
| `/admin/audit-log` and operations | ADM-009–ADM-012 |
| React Native navigation | MOB-001–MOB-008 plus the collector/buyer/seller domain PRDs marked mobile |

## Existing REST-to-PRD coverage

| Existing operation family | Owning PRDs |
| --- | --- |
| `/api/v1/auth/*` | AUTH-001–AUTH-009 |
| `/api/v1/categories/*` | CAT-001–CAT-002, CAT-007–CAT-010 |
| `/api/v1/checklists/*` | CAT-003–CAT-004, CAT-011–CAT-013 |
| `/api/v1/users`, `/users/:id`, `/users/:id/reviews` | ADM-002, AUTH-013, REV-001–REV-003 |
| `/api/v1/admin/users/:id/block` | ADM-003 |
| `/api/v1/user-checklists/*` | COL-001, COL-003, COL-005–COL-010 |
| `/api/v1/account/profile` | AUTH-010–AUTH-012 |
| `/api/v1/swaps/*` | SWAP-001–SWAP-003 |
| `/api/v1/conversations/*` | CHAT-001–CHAT-004, SWAP-004 |
| `/api/v1/swap-deals/*` | SWAP-005, SWAP-007, SWAP-012–SWAP-016 |

## Traceability

| PRD | Client route or trigger | REST, GraphQL, or system interface | Backend owner | Primary entities | Events/jobs |
| --- | --- | --- | --- | --- | --- |
| [AUTH-001](./identity/auth-001-register-account.md) | /signup | POST /api/v1/auth/signup | Identity module | users, otp_challenges | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-002](./identity/auth-002-request-signup-otp.md) | /signup | POST /api/v1/auth/request-otp | Identity module | otp_challenges, users | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-003](./identity/auth-003-verify-mobile-otp.md) | /verify-otp | POST /api/v1/auth/verify-otp | Identity module | otp_challenges, users, access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-004](./identity/auth-004-resend-mobile-otp.md) | /verify-otp | POST /api/v1/auth/request-otp | Identity module | otp_challenges | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-005](./identity/auth-005-sign-in-password.md) | /login | POST /api/v1/auth/login | Identity module | users, access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-006](./identity/auth-006-sign-in-otp.md) | /login | POST /api/v1/auth/otp-login | Identity module | otp_challenges, access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-007](./identity/auth-007-recover-password.md) | /login | POST /api/v1/auth/password-recovery | Identity module | users, otp_challenges | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-008](./identity/auth-008-logout-session.md) | /settings | POST /api/v1/auth/logout | Identity module | access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-009](./identity/auth-009-handle-session-expiry.md) | all protected routes | 401 response contract | Identity module | access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-010](./identity/auth-010-view-own-profile.md) | /profile | GET /api/v1/account/profile | Identity module | users | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-011](./identity/auth-011-edit-profile.md) | /profile/edit | PUT /api/v1/account/profile | Identity module | users | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-012](./identity/auth-012-change-mobile-reverify.md) | /profile/edit | PUT /api/v1/account/profile | Identity module | users, otp_challenges, access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-013](./identity/auth-013-view-public-profile.md) | /profile/:id | GET /api/v1/users/:id | Identity module | users, reputation_snapshots | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-014](./identity/auth-014-manage-account-preferences.md) | /settings | PUT /api/v1/account/preferences | Identity module | users, notification_preferences | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-015](./identity/auth-015-deactivate-account.md) | /settings | POST /api/v1/account/deactivate | Identity module | users, access_tokens | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-016](./identity/auth-016-export-personal-data.md) | /settings | POST /api/v1/account/privacy-exports | Identity module | users, admin_exports | IdentityVerified, SessionRevoked, ProfileUpdated |
| [AUTH-017](./identity/auth-017-delete-personal-data.md) | /settings | POST /api/v1/account/privacy-deletions | Identity module | users, audit_logs | IdentityVerified, SessionRevoked, ProfileUpdated |
| [CAT-001](./catalogue/cat-001-browse-categories.md) | /checklists | GET /api/v1/categories | Catalogue module | categories | CatalogueChanged, CatalogueImportCompleted |
| [CAT-002](./catalogue/cat-002-view-category-detail.md) | /s/:categoryId | GET /api/v1/categories/:id | Catalogue module | categories, checklists | CatalogueChanged, CatalogueImportCompleted |
| [CAT-003](./catalogue/cat-003-browse-checklists.md) | /checklists | GET /api/v1/checklists | Catalogue module | checklists, categories | CatalogueChanged, CatalogueImportCompleted |
| [CAT-004](./catalogue/cat-004-view-checklist-detail.md) | /checklists/:id | GET /api/v1/checklists/:id | Catalogue module | checklists, cards | CatalogueChanged, CatalogueImportCompleted |
| [CAT-005](./catalogue/cat-005-search-filter-cards.md) | catalogue search | GET /api/v1/catalogue/cards | Catalogue module | cards, checklists | CatalogueChanged, CatalogueImportCompleted |
| [CAT-006](./catalogue/cat-006-view-card-detail.md) | card detail surface | GET /api/v1/catalogue/cards/:id | Catalogue module | cards, checklists | CatalogueChanged, CatalogueImportCompleted |
| [CAT-007](./catalogue/cat-007-create-category.md) | /admin/categories | POST /api/v1/categories | Catalogue module | categories | CatalogueChanged, CatalogueImportCompleted |
| [CAT-008](./catalogue/cat-008-edit-category.md) | /admin/categories | PUT /api/v1/categories/:id | Catalogue module | categories | CatalogueChanged, CatalogueImportCompleted |
| [CAT-009](./catalogue/cat-009-archive-category.md) | /admin/categories | DELETE /api/v1/categories/:id | Catalogue module | categories | CatalogueChanged, CatalogueImportCompleted |
| [CAT-010](./catalogue/cat-010-manage-subcategories.md) | /admin/categories | POST /api/v1/categories/:id/subcategories | Catalogue module | categories | CatalogueChanged, CatalogueImportCompleted |
| [CAT-011](./catalogue/cat-011-create-checklist.md) | /admin/collections | POST /api/v1/checklists | Catalogue module | checklists | CatalogueChanged, CatalogueImportCompleted |
| [CAT-012](./catalogue/cat-012-edit-checklist.md) | /admin/collections | PUT /api/v1/checklists/:id | Catalogue module | checklists | CatalogueChanged, CatalogueImportCompleted |
| [CAT-013](./catalogue/cat-013-archive-checklist.md) | /admin/collections | DELETE /api/v1/checklists/:id | Catalogue module | checklists | CatalogueChanged, CatalogueImportCompleted |
| [CAT-014](./catalogue/cat-014-validate-catalogue-import.md) | /admin/catalogue/import | POST /api/v1/admin/catalogue-imports/validate | Catalogue module | catalogue_imports | CatalogueChanged, CatalogueImportCompleted |
| [CAT-015](./catalogue/cat-015-commit-catalogue-import.md) | /admin/catalogue/import | POST /api/v1/admin/catalogue-imports/:id/commit | Catalogue module | catalogue_imports, categories, checklists, cards | CatalogueChanged, CatalogueImportCompleted |
| [CAT-016](./catalogue/cat-016-rollback-catalogue-import.md) | /admin/catalogue/import | POST /api/v1/admin/catalogue-imports/:id/rollback | Catalogue module | catalogue_imports, categories, checklists, cards | CatalogueChanged, CatalogueImportCompleted |
| [COL-001](./collections/col-001-start-collection.md) | /dashboard | POST /api/v1/user-checklists/:checklistId | Collections module | user_checklists, collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-002](./collections/col-002-view-collection-dashboard.md) | /dashboard | GET /api/v1/account/collections | Collections module | user_checklists | CollectionChanged, CollectionVisibilityChanged |
| [COL-003](./collections/col-003-view-own-collection.md) | /collection/:id/edit | GET /api/v1/user-checklists/:id | Collections module | user_checklists, collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-004](./collections/col-004-view-public-collection.md) | /collection/:id | GET /api/v1/collections/:id/public | Collections module | user_checklists, collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-005](./collections/col-005-update-card-ownership.md) | /collection/:id/edit | POST /api/v1/user-checklists/:id | Collections module | collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-006](./collections/col-006-track-duplicates-offers.md) | /collection/:id/edit | POST /api/v1/user-checklists/:id | Collections module | collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-007](./collections/col-007-track-wanted-missing.md) | /collection/:id/edit | POST /api/v1/user-checklists/:id | Collections module | collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-008](./collections/col-008-bulk-edit-collection.md) | /collection/:id/edit | PATCH /api/v1/user-checklists/:id/entries | Collections module | collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-009](./collections/col-009-preview-collection-import.md) | /collection/:id/edit | POST /api/v1/user-checklists/:id/import?dryRun=true | Collections module | collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-010](./collections/col-010-commit-collection-import.md) | /collection/:id/edit | POST /api/v1/user-checklists/:id/import | Collections module | collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-011](./collections/col-011-export-collection.md) | collection actions | GET /api/v1/user-checklists/:id/export | Collections module | user_checklists, collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [COL-012](./collections/col-012-manage-collection-visibility.md) | collection settings | PUT /api/v1/user-checklists/:id/visibility | Collections module | user_checklists | CollectionChanged, CollectionVisibilityChanged |
| [COL-013](./collections/col-013-reset-remove-collection.md) | collection settings | DELETE /api/v1/user-checklists/:id | Collections module | user_checklists, collection_entries | CollectionChanged, CollectionVisibilityChanged |
| [SWAP-001](./swaps/swap-001-search-swap-partners.md) | /swapping | POST /api/v1/swaps/search | Swap module | users, collection_entries | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-002](./swaps/swap-002-calculate-bilateral-match.md) | /swapping | GET /api/v1/swaps/:userId | Swap module | collection_entries, users | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-003](./swaps/swap-003-inspect-match-details.md) | /swapping | GET /api/v1/swaps/:userId | Swap module | collection_entries, users | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-004](./swaps/swap-004-start-conversation-from-match.md) | /swapping | POST /api/v1/conversations/find-or-create | Swap module | conversations, conversation_participants | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-005](./swaps/swap-005-propose-swap-deal.md) | /chat/:id | POST /api/v1/swap-deals | Swap module | swap_deals, swap_deal_items | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-006](./swaps/swap-006-counter-swap-proposal.md) | /swaps/:id | POST /api/v1/swap-deals/:id/counter | Swap module | swap_deals, swap_deal_items | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-007](./swaps/swap-007-accept-swap-deal.md) | /chat/:id | POST /api/v1/swap-deals/:id/accept | Swap module | swap_deals | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-008](./swaps/swap-008-reject-swap-deal.md) | /swaps/:id | POST /api/v1/swap-deals/:id/reject | Swap module | swap_deals | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-009](./swaps/swap-009-cancel-swap-deal.md) | /swaps/:id | POST /api/v1/swap-deals/:id/cancel | Swap module | swap_deals | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-010](./swaps/swap-010-expire-swap-proposal.md) | background worker | SwapExpiryJob | Swap module | swap_deals | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-011](./swaps/swap-011-choose-meetup-handoff.md) | /swaps/:id | POST /api/v1/swap-deals/:id/handoff | Swap module | swap_deals, swap_handoffs | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-012](./swaps/swap-012-choose-postal-exchange.md) | /chat/:id | POST /api/v1/swap-deals/:id/postal | Swap module | swap_deals, swap_handoffs | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-013](./swaps/swap-013-record-swap-tracking.md) | /chat/:id | POST /api/v1/swap-deals/:id/postal | Swap module | swap_handoffs | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-014](./swaps/swap-014-scan-handoff-qr.md) | /chat/:id | POST /api/v1/swap-deals/:id/scan-qr | Swap module | swap_handoffs | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-015](./swaps/swap-015-mark-swap-received.md) | /chat/:id | POST /api/v1/swap-deals/:id/received | Swap module | swap_handoffs | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-016](./swaps/swap-016-complete-swap-deal.md) | /swaps/:id | SwapCompletionPolicy | Swap module | swap_deals, swap_handoffs, collection_entries | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-017](./swaps/swap-017-report-swap-issue.md) | /swaps/:id | POST /api/v1/swap-deals/:id/report | Swap module | swap_deals, disputes | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [SWAP-018](./swaps/swap-018-edit-swap-proposal.md) | /swaps/:id | PATCH /api/v1/swap-deals/:id | Swap module | swap_deals, swap_deal_items | SwapProposed, SwapAccepted, SwapCancelled, SwapCompleted |
| [CHAT-001](./chat/chat-001-list-conversations.md) | /chat | GET /api/v1/conversations | Conversation module | conversations, conversation_participants | MessageCreated, MessageRead, ConversationReported |
| [CHAT-002](./chat/chat-002-find-create-conversation.md) | /profile/:id | POST /api/v1/conversations/find-or-create | Conversation module | conversations, conversation_participants | MessageCreated, MessageRead, ConversationReported |
| [CHAT-003](./chat/chat-003-open-conversation.md) | /chat/:id | GET /api/v1/conversations/:id | Conversation module | conversations, messages | MessageCreated, MessageRead, ConversationReported |
| [CHAT-004](./chat/chat-004-send-text-message.md) | /chat/:id | POST /api/v1/conversations/:id/messages | Conversation module | messages | MessageCreated, MessageRead, ConversationReported |
| [CHAT-005](./chat/chat-005-receive-realtime-message.md) | /chat/:id | conversation event channel | Conversation module | messages | MessageCreated, MessageRead, ConversationReported |
| [CHAT-006](./chat/chat-006-mark-messages-read.md) | /chat/:id | POST /api/v1/conversations/:id/read | Conversation module | conversation_participants | MessageCreated, MessageRead, ConversationReported |
| [CHAT-007](./chat/chat-007-send-message-attachment.md) | /chat/:id | POST /api/v1/conversations/:id/attachments | Conversation module | messages, object storage | MessageCreated, MessageRead, ConversationReported |
| [CHAT-008](./chat/chat-008-retry-failed-message.md) | /chat/:id | POST /api/v1/conversations/:id/messages | Conversation module | messages | MessageCreated, MessageRead, ConversationReported |
| [CHAT-009](./chat/chat-009-sync-offline-messages.md) | mobile chat | GraphQL conversationUpdates | Conversation module | messages, mobile_sync_cursors | MessageCreated, MessageRead, ConversationReported |
| [CHAT-010](./chat/chat-010-report-conversation.md) | /chat/:id | POST /api/v1/conversations/:id/report | Conversation module | conversation_participants, audit_logs | MessageCreated, MessageRead, ConversationReported |
| [CHAT-011](./chat/chat-011-block-conversation-participant.md) | /chat/:id | POST /api/v1/conversations/:id/block | Conversation module | conversation_participants, audit_logs | MessageCreated, MessageRead, ConversationReported |
| [REV-001](./reviews/rev-001-view-collector-reviews.md) | /profile/:id | GET /api/v1/users/:id/reviews | Trust module | reviews | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-002](./reviews/rev-002-check-review-eligibility.md) | /profile/:id | GET /api/v1/reviews/eligibility | Trust module | reviews, swap_deals, orders | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-003](./reviews/rev-003-submit-review.md) | /profile/:id | POST /api/v1/users/:targetUserId/reviews | Trust module | reviews | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-004](./reviews/rev-004-edit-review.md) | review actions | PATCH /api/v1/reviews/:id | Trust module | reviews | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-005](./reviews/rev-005-report-abusive-review.md) | review actions | POST /api/v1/reviews/:id/report | Trust module | review_reports | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-006](./reviews/rev-006-moderate-review.md) | /admin/reports | POST /api/v1/admin/reviews/:id/decision | Trust module | reviews, review_reports, audit_logs | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-007](./reviews/rev-007-recalculate-reputation.md) | background worker | ReputationProjectionJob | Trust module | reputation_snapshots, reviews | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [REV-008](./reviews/rev-008-remove-review.md) | review actions | DELETE /api/v1/reviews/:id | Trust module | reviews, audit_logs | ReviewSubmitted, ReviewModerated, ReputationChanged |
| [LIST-001](./marketplace/list-001-browse-listings.md) | /marketplace | GET /api/v1/listings | Marketplace module | listings, listing_media | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-002](./marketplace/list-002-search-filter-sort-listings.md) | /marketplace | GET /api/v1/listings | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-003](./marketplace/list-003-view-listing-detail.md) | /marketplace/:id | GET /api/v1/listings/:id | Marketplace module | listings, listing_media, users | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-004](./marketplace/list-004-save-listing.md) | /marketplace/:id | POST /api/v1/listings/:id/save | Marketplace module | saved_listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-005](./marketplace/list-005-remove-saved-listing.md) | saved listings | DELETE /api/v1/listings/:id/save | Marketplace module | saved_listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-006](./marketplace/list-006-contact-listing-seller.md) | /marketplace/:id | POST /api/v1/listings/:id/contact | Marketplace module | conversations, conversation_participants | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-007](./marketplace/list-007-create-listing-draft.md) | /marketplace/sell | POST /api/v1/listings | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-008](./marketplace/list-008-upload-listing-media.md) | /marketplace/sell | POST /api/v1/listings/:id/media | Marketplace module | listing_media, object storage | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-009](./marketplace/list-009-set-listing-price-quantity.md) | /marketplace/sell | PATCH /api/v1/listings/:id/pricing | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-010](./marketplace/list-010-publish-listing.md) | /marketplace/sell | POST /api/v1/listings/:id/publish | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-011](./marketplace/list-011-edit-published-listing.md) | /marketplace/sell | PATCH /api/v1/listings/:id | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-012](./marketplace/list-012-pause-listing.md) | seller inventory | POST /api/v1/listings/:id/pause | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-013](./marketplace/list-013-archive-listing.md) | seller inventory | POST /api/v1/listings/:id/archive | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-014](./marketplace/list-014-mark-listing-sold-out.md) | order completion | ListingInventoryPolicy | Marketplace module | listings, orders | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-015](./marketplace/list-015-report-listing.md) | /marketplace/:id | POST /api/v1/listings/:id/report | Marketplace module | listing_reports | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-016](./marketplace/list-016-moderate-listing.md) | /admin/listings | POST /api/v1/admin/listings/:id/decision | Marketplace module | listings, listing_reports, audit_logs | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-017](./marketplace/list-017-resume-listing.md) | seller inventory | POST /api/v1/listings/:id/resume | Marketplace module | listings | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [LIST-018](./marketplace/list-018-delete-listing-draft.md) | seller inventory | DELETE /api/v1/listings/:id | Marketplace module | listings, listing_media | ListingPublished, ListingChanged, ListingReported, ListingModerated |
| [CHK-001](./checkout/chk-001-check-listing-availability.md) | /checkout/:listingId | GET /api/v1/checkout/listings/:id/availability | Checkout module | listings, listing_reservations | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-002](./checkout/chk-002-reserve-listing-quantity.md) | /checkout/:listingId | POST /api/v1/checkout/reservations | Checkout module | listing_reservations, listings | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-003](./checkout/chk-003-expire-checkout-reservation.md) | background worker | ReservationExpiryJob | Checkout module | listing_reservations, listings | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-004](./checkout/chk-004-submit-checkout-details.md) | /checkout/:listingId | POST /api/v1/checkout/orders | Checkout module | orders, order_items, listing_reservations | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-005](./checkout/chk-005-choose-fulfillment-method.md) | /checkout/:listingId | PUT /api/v1/checkout/orders/:id/fulfillment | Checkout module | orders, fulfillments | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-006](./checkout/chk-006-view-buyer-orders.md) | orders list | GET /api/v1/orders | Checkout module | orders, order_items | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-007](./checkout/chk-007-view-order-detail.md) | /orders/:id | GET /api/v1/orders/:id | Checkout module | orders, order_items, payments, fulfillments | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [CHK-008](./checkout/chk-008-cancel-unpaid-order.md) | /orders/:id | POST /api/v1/orders/:id/cancel | Checkout module | orders, listing_reservations | ListingReserved, OrderCreated, OrderCancelled, ContactReleased |
| [PAY-001](./payments/pay-001-create-payment-intent.md) | /checkout/:listingId | POST /api/v1/payments/intents | Payment module | payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-002](./payments/pay-002-redirect-payment-provider.md) | /checkout/:listingId | provider redirect or SDK | Payment module | payment_intents | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-003](./payments/pay-003-payment-return-success.md) | payment return route | GET /api/v1/payments/return | Payment module | payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-004](./payments/pay-004-payment-return-failure.md) | payment return route | GET /api/v1/payments/return | Payment module | payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-005](./payments/pay-005-cancel-payment-attempt.md) | /checkout/:listingId | POST /api/v1/payments/intents/:id/cancel | Payment module | payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-006](./payments/pay-006-process-payment-webhook.md) | provider webhook | POST /api/v1/payments/webhooks/:provider | Payment module | payment_events, payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-007](./payments/pay-007-deduplicate-payment-event.md) | provider webhook | WebhookDeduplicationPolicy | Payment module | payment_events | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-008](./payments/pay-008-recover-out-of-order-event.md) | payment worker | PaymentStateProjectionJob | Payment module | payment_events, payment_intents | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-009](./payments/pay-009-retry-failed-payment.md) | /orders/:id | POST /api/v1/orders/:id/payment-retry | Payment module | payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-010](./payments/pay-010-issue-provider-refund.md) | /admin/payments | POST /api/v1/payments/:id/refunds | Payment module | refunds, payment_intents, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-011](./payments/pay-011-track-refund-result.md) | provider webhook | RefundProjectionJob | Payment module | refunds, payment_events | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-012](./payments/pay-012-create-direct-split-settlement.md) | payment capture | SettlementCreationPolicy | Payment module | settlements, orders | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-013](./payments/pay-013-reconcile-provider-transactions.md) | background worker | PaymentReconciliationJob | Payment module | payment_intents, payment_events, settlements, refunds | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [PAY-014](./payments/pay-014-generate-payment-receipt.md) | /orders/:id | GET /api/v1/orders/:id/receipt | Payment module | orders, payment_intents, settlements | PaymentAuthorized, PaymentFailed, PaymentCaptured, RefundCompleted, SettlementUpdated |
| [FUL-001](./fulfillment/ful-001-release-contact-details.md) | /orders/:id | ContactReleasePolicy | Fulfillment module | order_contacts, orders | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [FUL-002](./fulfillment/ful-002-schedule-meetup.md) | /orders/:id | POST /api/v1/fulfillments/:id/meetup | Fulfillment module | fulfillments | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [FUL-003](./fulfillment/ful-003-record-order-tracking.md) | /orders/:id | POST /api/v1/fulfillments/:id/tracking | Fulfillment module | fulfillments | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [FUL-004](./fulfillment/ful-004-update-fulfillment-status.md) | /orders/:id | POST /api/v1/fulfillments/:id/status | Fulfillment module | fulfillments | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [FUL-005](./fulfillment/ful-005-buyer-confirm-handoff.md) | /orders/:id | POST /api/v1/fulfillments/:id/confirm | Fulfillment module | fulfillment_confirmations | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [FUL-006](./fulfillment/ful-006-seller-confirm-handoff.md) | /orders/:id | POST /api/v1/fulfillments/:id/confirm | Fulfillment module | fulfillment_confirmations | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [FUL-007](./fulfillment/ful-007-mark-fulfillment-failed.md) | /orders/:id | POST /api/v1/fulfillments/:id/fail | Fulfillment module | fulfillments, disputes | FulfillmentScheduled, FulfillmentUpdated, HandoffConfirmed, FulfillmentFailed |
| [DSP-001](./disputes/dsp-001-open-payment-dispute.md) | /orders/:id | POST /api/v1/disputes | Dispute module | disputes | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-002](./disputes/dsp-002-submit-dispute-evidence.md) | dispute detail | POST /api/v1/disputes/:id/evidence | Dispute module | dispute_evidence, object storage | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-003](./disputes/dsp-003-seller-respond-dispute.md) | dispute detail | POST /api/v1/disputes/:id/responses | Dispute module | dispute_events | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-004](./disputes/dsp-004-triage-dispute.md) | admin disputes | POST /api/v1/admin/disputes/:id/triage | Dispute module | disputes, dispute_events | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-005](./disputes/dsp-005-resolve-dispute-refund.md) | admin disputes | POST /api/v1/admin/disputes/:id/resolve | Dispute module | disputes, refunds | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-006](./disputes/dsp-006-resolve-dispute-no-refund.md) | admin disputes | POST /api/v1/admin/disputes/:id/resolve | Dispute module | disputes, dispute_events | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-007](./disputes/dsp-007-close-dispute.md) | dispute worker | DisputeClosurePolicy | Dispute module | disputes, refunds | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [DSP-008](./disputes/dsp-008-appeal-dispute.md) | dispute detail | POST /api/v1/disputes/:id/appeal | Dispute module | disputes, dispute_events | DisputeOpened, EvidenceSubmitted, DisputeResolved, DisputeAppealed |
| [NTF-001](./notifications/ntf-001-list-notifications.md) | /notifications | GET /api/v1/notifications | Notification module | notifications | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-002](./notifications/ntf-002-mark-notification-read.md) | /notifications | POST /api/v1/notifications/:id/read | Notification module | notifications | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-003](./notifications/ntf-003-mark-all-notifications-read.md) | /notifications | POST /api/v1/notifications/read-all | Notification module | notifications | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-004](./notifications/ntf-004-deliver-realtime-notification.md) | active event channel | NotificationRealtimeConsumer | Notification module | notification_deliveries | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-005](./notifications/ntf-005-register-push-device.md) | mobile settings | GraphQL registerDevice | Notification module | device_installations | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-006](./notifications/ntf-006-manage-notification-preferences.md) | /settings | PUT /api/v1/notifications/preferences | Notification module | notification_preferences | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-007](./notifications/ntf-007-retry-failed-notification.md) | notification worker | NotificationDeliveryJob | Notification module | notification_deliveries | NotificationRequested, NotificationDelivered, NotificationFailed |
| [NTF-008](./notifications/ntf-008-dead-letter-notification.md) | notification worker | NotificationDeadLetterPolicy | Notification module | notification_deliveries | NotificationRequested, NotificationDelivered, NotificationFailed |
| [ADM-001](./administration/adm-001-view-operations-dashboard.md) | /admin | GET /api/v1/admin/dashboard | Administration module | domain aggregate projections | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-002](./administration/adm-002-list-search-users.md) | /admin/users | GET /api/v1/users | Administration module | users | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-003](./administration/adm-003-block-user.md) | /admin/users | POST /api/v1/admin/users/:id/block | Administration module | users, access_tokens, audit_logs | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-004](./administration/adm-004-assign-user-role.md) | /admin/users | PUT /api/v1/admin/users/:id/role | Administration module | users, audit_logs | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-005](./administration/adm-005-review-listing-queue.md) | /admin/listings | GET /api/v1/admin/listings | Administration module | listings, listing_reports | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-006](./administration/adm-006-review-content-reports.md) | /admin/reports | GET /api/v1/admin/reports | Administration module | listing_reports, review_reports, disputes | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-007](./administration/adm-007-monitor-payments.md) | /admin/payments | GET /api/v1/admin/payments | Administration module | payment_intents, payment_events, settlements | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-008](./administration/adm-008-oversee-refunds.md) | /admin/payments | GET /api/v1/admin/refunds | Administration module | refunds | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-009](./administration/adm-009-inspect-audit-log.md) | /admin/audit-log | GET /api/v1/admin/audit-logs | Administration module | audit_logs | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-010](./administration/adm-010-request-admin-export.md) | admin export action | POST /api/v1/admin/exports | Administration module | admin_exports | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-011](./administration/adm-011-replay-failed-job.md) | operations console | POST /api/v1/admin/jobs/:id/replay | Administration module | queue failure store, audit_logs | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-012](./administration/adm-012-activate-maintenance-mode.md) | operations console | POST /api/v1/admin/maintenance | Administration module | maintenance_windows, audit_logs | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [ADM-013](./administration/adm-013-unblock-user.md) | /admin/users | POST /api/v1/admin/users/:id/unblock | Administration module | users, audit_logs | ModerationActionApplied, AuditRecorded, AdminExportReady |
| [INTL-001](./international/intl-001-create-market-configuration.md) | market admin | POST /api/v1/markets | Market configuration module | markets | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-002](./international/intl-002-activate-market.md) | market admin | POST /api/v1/markets/:id/activate | Market configuration module | markets, market_providers, legal_documents | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-003](./international/intl-003-configure-market-currency.md) | market admin | PUT /api/v1/markets/:id/currency | Market configuration module | markets | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-004](./international/intl-004-configure-market-providers.md) | market admin | PUT /api/v1/markets/:id/providers | Market configuration module | market_providers | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-005](./international/intl-005-calculate-applicable-tax.md) | checkout | POST /api/v1/markets/:id/tax-quotes | Market configuration module | tax_rules, orders | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-006](./international/intl-006-refresh-exchange-rates.md) | background worker | ExchangeRateRefreshJob | Market configuration module | exchange_rates | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-007](./international/intl-007-publish-regional-legal-copy.md) | market admin | POST /api/v1/markets/:id/legal-documents | Market configuration module | legal_documents | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [INTL-008](./international/intl-008-migrate-egypt-market-scope.md) | deployment migration | MarketBackfillMigration | Market configuration module | markets and market-owned domain rows | MarketActivated, MarketConfigurationChanged, LegalDocumentPublished |
| [MOB-001](./mobile/mob-001-authenticate-mobile-collector.md) | native authentication | GraphQL authenticate | Mobile client and shared-contract layer | users, access_tokens | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-002](./mobile/mob-002-open-authenticated-deep-link.md) | native navigation | universal/app link resolver | Mobile client and shared-contract layer | access_tokens | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-003](./mobile/mob-003-request-push-permission.md) | native onboarding/settings | native OS permission and GraphQL registerDevice | Mobile client and shared-contract layer | device_installations | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-004](./mobile/mob-004-scan-swap-qr-camera.md) | native swap detail | GraphQL scanSwapQr | Mobile client and shared-contract layer | swap_handoffs | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-005](./mobile/mob-005-upload-mobile-listing-media.md) | native listing editor | GraphQL createListingMediaUpload | Mobile client and shared-contract layer | listing_media, object storage | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-006](./mobile/mob-006-read-cached-data-offline.md) | native catalogue and workspace | local encrypted cache | Mobile client and shared-contract layer | mobile_sync_cursors | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-007](./mobile/mob-007-reconnect-and-sync.md) | native application lifecycle | GraphQL syncChanges | Mobile client and shared-contract layer | mobile_sync_cursors and domain tables | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [MOB-008](./mobile/mob-008-enforce-minimum-app-version.md) | native app launch | GraphQL clientConfiguration | Mobile client and shared-contract layer | device_installations | DeviceRegistered, MobileSyncRequested, MinimumVersionChanged |
| [SYS-001](./system/sys-001-handle-401.md) | all protected surfaces | HTTP 401 contract | Platform edge and client state layer | access_tokens | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-002](./system/sys-002-handle-403.md) | all surfaces | HTTP 403 contract | Platform edge and client state layer | audit_logs | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-003](./system/sys-003-handle-404.md) | all routes | HTTP 404 contract | Platform edge and client state layer | domain tables | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-004](./system/sys-004-handle-gone-resource.md) | resource detail surfaces | HTTP 410 contract | Platform edge and client state layer | domain tables | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-005](./system/sys-005-render-loading-state.md) | all clients | client state contract | Platform edge and client state layer | none | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-006](./system/sys-006-render-empty-state.md) | collection and search surfaces | successful empty response | Platform edge and client state layer | none | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-007](./system/sys-007-handle-validation-failure.md) | all forms | HTTP 422 contract | Platform edge and client state layer | none | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-008](./system/sys-008-recover-api-failure.md) | all clients | HTTP 5xx and timeout contract | Platform edge and client state layer | request_logs | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-009](./system/sys-009-operate-offline.md) | web and mobile | network state contract | Platform edge and client state layer | mobile_sync_cursors | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-010](./system/sys-010-display-maintenance.md) | all clients | HTTP 503 maintenance contract | Platform edge and client state layer | maintenance_windows | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-011](./system/sys-011-degrade-external-dependency.md) | backend adapters | circuit-breaker contract | Platform edge and client state layer | request_logs | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-012](./system/sys-012-enforce-rate-limit.md) | API edge | HTTP 429 contract | Platform edge and client state layer | request_logs | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-013](./system/sys-013-resolve-concurrency-conflict.md) | all mutating clients | HTTP 409 version contract | Platform edge and client state layer | versioned domain tables | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |
| [SYS-014](./system/sys-014-view-product-landing.md) | / | client-side route | Platform edge and client state layer | none | DependencyDegraded, RateLimitExceeded, MaintenanceChanged |

## Completeness rules

1. Every current or planned route must map to at least one PRD.
2. Every REST route/controller and target GraphQL operation must have one owning PRD.
3. Every aggregate transition in shared state machines must have one command or system-trigger PRD.
4. Every table is owned by one domain; cross-domain behavior uses interfaces and events.
5. Every external callback, scheduled job, retry, dead letter, and operator recovery action must have a scenario owner.
6. Shared failures 401, 403, 404, 410, 409, 422, 429, 503, offline, and stale data are explicitly covered by SYS PRDs and referenced by all domain PRDs.
