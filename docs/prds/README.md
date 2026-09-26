# TCG Community atomic PRD library

This library contains **189 complete atomic scenario PRDs** plus shared architecture and product contracts. It covers the current product, marketplace V1, and the full future roadmap across web, React Native, backend, database, provider, worker, and administrative behavior.

An atomic scenario is one actor goal, query, command, automated trigger, or state transition with a terminal outcome. Error and display branches remain in the owning PRD unless they invoke a separately authorized command. “Complete” describes documentation status, not implementation status.

## Shared contracts

- [Actors and permissions](./_shared/actors-and-permissions.md)
- [Terminology](./_shared/terminology.md)
- [Technical architecture](./_shared/technical-architecture.md)
- [API and event conventions](./_shared/api-and-events.md)
- [Capacity and SLOs](./_shared/capacity-and-slos.md)
- [Security and privacy](./_shared/security-and-privacy.md)
- [Observability](./_shared/observability.md)
- [Deployment and recovery](./_shared/deployment-and-recovery.md)
- [UX, localization, and accessibility](./_shared/ux-localization-accessibility.md)
- [State machines](./_shared/state-machines.md)
- [Document standard](./_shared/document-standard.md)
- [System-design assessment](./_shared/system-design-assessment.md)
- [Coverage matrix](./coverage-matrix.md)

## Coverage totals

| Domain | PRDs |
| --- | ---: |
| Identity and accounts | 17 |
| Catalogue | 16 |
| Collections | 13 |
| Swaps | 18 |
| Chat | 11 |
| Reviews and trust | 8 |
| Marketplace listings | 18 |
| Checkout and orders | 8 |
| Payments | 14 |
| Contact-led fulfillment | 7 |
| Disputes and refunds | 8 |
| Notifications | 8 |
| Administration and operations | 13 |
| International and tax | 8 |
| React Native | 8 |
| Shared system behavior | 14 |
| **Total** | **189** |

## Status legend

- Horizon: **current** is part of the existing product domain, **v1** is the listing-to-payment milestone, and **future** is the complete roadmap beyond V1.
- PRD status: every document in this generated baseline is **Complete**.
- Implementation: **implemented**, **partial**, **mocked**, **planned**, or **absent** is based on current repository evidence. No documentation entry implies delivered code.

## Master inventory

| ID | Scenario | Domain | Actors | Platforms | Horizon | PRD | Implementation | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUTH-001 | [Register an account](./identity/auth-001-register-account.md) | Identity and accounts | guest | public web, mobile | current | Complete | implemented | - |
| AUTH-002 | [Request signup OTP](./identity/auth-002-request-signup-otp.md) | Identity and accounts | guest | public web, mobile | current | Complete | implemented | AUTH-001 |
| AUTH-003 | [Verify mobile OTP](./identity/auth-003-verify-mobile-otp.md) | Identity and accounts | guest | public web, mobile | current | Complete | implemented | AUTH-001 |
| AUTH-004 | [Resend mobile OTP](./identity/auth-004-resend-mobile-otp.md) | Identity and accounts | guest | public web, mobile | current | Complete | implemented | AUTH-002 |
| AUTH-005 | [Sign in with password](./identity/auth-005-sign-in-password.md) | Identity and accounts | guest | public web, mobile | current | Complete | implemented | AUTH-003 |
| AUTH-006 | [Sign in with OTP](./identity/auth-006-sign-in-otp.md) | Identity and accounts | guest | public web, mobile | future | Complete | absent | AUTH-002 |
| AUTH-007 | [Recover forgotten password](./identity/auth-007-recover-password.md) | Identity and accounts | guest | public web, mobile | v1 | Complete | planned | AUTH-002 |
| AUTH-008 | [Log out current session](./identity/auth-008-logout-session.md) | Identity and accounts | collector | collector web, mobile | current | Complete | implemented | AUTH-005 |
| AUTH-009 | [Handle expired or revoked session](./identity/auth-009-handle-session-expiry.md) | Identity and accounts | collector | collector web, mobile | current | Complete | partial | AUTH-005 |
| AUTH-010 | [View own profile](./identity/auth-010-view-own-profile.md) | Identity and accounts | collector | collector web, mobile | current | Complete | implemented | AUTH-005 |
| AUTH-011 | [Edit profile](./identity/auth-011-edit-profile.md) | Identity and accounts | collector | collector web, mobile | current | Complete | implemented | AUTH-010 |
| AUTH-012 | [Change mobile and reverify](./identity/auth-012-change-mobile-reverify.md) | Identity and accounts | collector | collector web, mobile | current | Complete | implemented | AUTH-011, AUTH-003 |
| AUTH-013 | [View public collector profile](./identity/auth-013-view-public-profile.md) | Identity and accounts | collector | collector web, mobile | current | Complete | implemented | AUTH-010 |
| AUTH-014 | [Manage account preferences](./identity/auth-014-manage-account-preferences.md) | Identity and accounts | collector | collector web, mobile | v1 | Complete | planned | AUTH-010 |
| AUTH-015 | [Deactivate account](./identity/auth-015-deactivate-account.md) | Identity and accounts | collector | collector web, mobile | future | Complete | absent | AUTH-010 |
| AUTH-016 | [Export personal data](./identity/auth-016-export-personal-data.md) | Identity and accounts | collector | collector web, mobile | future | Complete | absent | AUTH-010 |
| AUTH-017 | [Delete or anonymize personal data](./identity/auth-017-delete-personal-data.md) | Identity and accounts | collector | collector web, mobile | future | Complete | absent | AUTH-015 |
| CAT-001 | [Browse catalogue categories](./catalogue/cat-001-browse-categories.md) | Catalogue | guest, collector | public web, collector web, mobile | current | Complete | implemented | - |
| CAT-002 | [View category detail](./catalogue/cat-002-view-category-detail.md) | Catalogue | guest, collector | public web, collector web, mobile | current | Complete | implemented | CAT-001 |
| CAT-003 | [Browse checklists](./catalogue/cat-003-browse-checklists.md) | Catalogue | guest, collector | public web, collector web, mobile | current | Complete | implemented | CAT-001 |
| CAT-004 | [View checklist detail](./catalogue/cat-004-view-checklist-detail.md) | Catalogue | guest, collector | public web, collector web, mobile | current | Complete | implemented | CAT-003 |
| CAT-005 | [Search and filter cards](./catalogue/cat-005-search-filter-cards.md) | Catalogue | guest, collector | public web, collector web, mobile | v1 | Complete | partial | CAT-003 |
| CAT-006 | [View card detail](./catalogue/cat-006-view-card-detail.md) | Catalogue | guest, collector | public web, collector web, mobile | v1 | Complete | partial | CAT-004 |
| CAT-007 | [Create category](./catalogue/cat-007-create-category.md) | Catalogue | administrator | admin web | current | Complete | implemented | ADM-002 |
| CAT-008 | [Edit category](./catalogue/cat-008-edit-category.md) | Catalogue | administrator | admin web | v1 | Complete | partial | CAT-007 |
| CAT-009 | [Archive category](./catalogue/cat-009-archive-category.md) | Catalogue | administrator | admin web | current | Complete | partial | CAT-007 |
| CAT-010 | [Manage subcategories](./catalogue/cat-010-manage-subcategories.md) | Catalogue | administrator | admin web | current | Complete | implemented | CAT-007 |
| CAT-011 | [Create checklist](./catalogue/cat-011-create-checklist.md) | Catalogue | administrator | admin web | current | Complete | implemented | CAT-007 |
| CAT-012 | [Edit checklist](./catalogue/cat-012-edit-checklist.md) | Catalogue | administrator | admin web | current | Complete | implemented | CAT-011 |
| CAT-013 | [Archive checklist](./catalogue/cat-013-archive-checklist.md) | Catalogue | administrator | admin web | current | Complete | implemented | CAT-011 |
| CAT-014 | [Validate catalogue import](./catalogue/cat-014-validate-catalogue-import.md) | Catalogue | administrator | admin web | v1 | Complete | planned | CAT-011 |
| CAT-015 | [Commit catalogue import](./catalogue/cat-015-commit-catalogue-import.md) | Catalogue | administrator | admin web | v1 | Complete | planned | CAT-014 |
| CAT-016 | [Roll back catalogue import](./catalogue/cat-016-rollback-catalogue-import.md) | Catalogue | administrator | admin web | v1 | Complete | planned | CAT-015 |
| COL-001 | [Start collection from checklist](./collections/col-001-start-collection.md) | Collections | collector | collector web, mobile | current | Complete | implemented | CAT-004 |
| COL-002 | [View collection dashboard](./collections/col-002-view-collection-dashboard.md) | Collections | collector | collector web, mobile | current | Complete | implemented | AUTH-010 |
| COL-003 | [View own collection](./collections/col-003-view-own-collection.md) | Collections | collector | collector web, mobile | current | Complete | implemented | COL-001 |
| COL-004 | [View public collection](./collections/col-004-view-public-collection.md) | Collections | guest, collector | public web, collector web, mobile | current | Complete | implemented | COL-001 |
| COL-005 | [Update card ownership](./collections/col-005-update-card-ownership.md) | Collections | collector | collector web, mobile | current | Complete | implemented | COL-003 |
| COL-006 | [Track duplicate or offered cards](./collections/col-006-track-duplicates-offers.md) | Collections | collector | collector web, mobile | current | Complete | implemented | COL-005 |
| COL-007 | [Track wanted or missing cards](./collections/col-007-track-wanted-missing.md) | Collections | collector | collector web, mobile | current | Complete | implemented | COL-005 |
| COL-008 | [Bulk edit collection](./collections/col-008-bulk-edit-collection.md) | Collections | collector | collector web, mobile | v1 | Complete | partial | COL-003 |
| COL-009 | [Preview collection import](./collections/col-009-preview-collection-import.md) | Collections | collector | collector web, mobile | v1 | Complete | partial | COL-003 |
| COL-010 | [Commit collection import](./collections/col-010-commit-collection-import.md) | Collections | collector | collector web, mobile | current | Complete | implemented | COL-009 |
| COL-011 | [Export collection](./collections/col-011-export-collection.md) | Collections | collector | collector web, mobile | v1 | Complete | planned | COL-003 |
| COL-012 | [Manage collection visibility](./collections/col-012-manage-collection-visibility.md) | Collections | collector | collector web, mobile | v1 | Complete | partial | COL-003 |
| COL-013 | [Reset or remove collection](./collections/col-013-reset-remove-collection.md) | Collections | collector | collector web, mobile | future | Complete | absent | COL-003 |
| SWAP-001 | [Search swap partners](./swaps/swap-001-search-swap-partners.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | COL-006, COL-007 |
| SWAP-002 | [Calculate bilateral match](./swaps/swap-002-calculate-bilateral-match.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-001 |
| SWAP-003 | [Inspect match details](./swaps/swap-003-inspect-match-details.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-002 |
| SWAP-004 | [Start conversation from match](./swaps/swap-004-start-conversation-from-match.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-003 |
| SWAP-005 | [Propose swap deal](./swaps/swap-005-propose-swap-deal.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-004 |
| SWAP-006 | [Counter swap proposal](./swaps/swap-006-counter-swap-proposal.md) | Swaps | collector | collector web, mobile | v1 | Complete | planned | SWAP-005 |
| SWAP-007 | [Accept swap deal](./swaps/swap-007-accept-swap-deal.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-005 |
| SWAP-008 | [Reject swap deal](./swaps/swap-008-reject-swap-deal.md) | Swaps | collector | collector web, mobile | v1 | Complete | planned | SWAP-005 |
| SWAP-009 | [Cancel swap deal](./swaps/swap-009-cancel-swap-deal.md) | Swaps | collector | collector web, mobile | v1 | Complete | planned | SWAP-005 |
| SWAP-010 | [Expire stale swap proposal](./swaps/swap-010-expire-swap-proposal.md) | Swaps | collector | collector web, mobile | v1 | Complete | planned | SWAP-005 |
| SWAP-011 | [Choose meetup handoff](./swaps/swap-011-choose-meetup-handoff.md) | Swaps | collector | collector web, mobile | v1 | Complete | partial | SWAP-007 |
| SWAP-012 | [Choose postal exchange](./swaps/swap-012-choose-postal-exchange.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-007 |
| SWAP-013 | [Record postal tracking](./swaps/swap-013-record-swap-tracking.md) | Swaps | collector | collector web, mobile | current | Complete | partial | SWAP-012 |
| SWAP-014 | [Scan handoff QR](./swaps/swap-014-scan-handoff-qr.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-011 |
| SWAP-015 | [Mark swapped cards received](./swaps/swap-015-mark-swap-received.md) | Swaps | collector | collector web, mobile | current | Complete | implemented | SWAP-012 |
| SWAP-016 | [Complete swap deal](./swaps/swap-016-complete-swap-deal.md) | Swaps | collector | collector web, mobile | v1 | Complete | partial | SWAP-014, SWAP-015 |
| SWAP-017 | [Report swap issue](./swaps/swap-017-report-swap-issue.md) | Swaps | collector | collector web, mobile | future | Complete | absent | SWAP-005 |
| SWAP-018 | [Edit pending swap proposal](./swaps/swap-018-edit-swap-proposal.md) | Swaps | collector | collector web, mobile | v1 | Complete | planned | SWAP-005 |
| CHAT-001 | [List conversations](./chat/chat-001-list-conversations.md) | Chat | collector | collector web, mobile | current | Complete | implemented | AUTH-005 |
| CHAT-002 | [Find or create direct conversation](./chat/chat-002-find-create-conversation.md) | Chat | collector | collector web, mobile | current | Complete | implemented | AUTH-013 |
| CHAT-003 | [Open conversation history](./chat/chat-003-open-conversation.md) | Chat | collector | collector web, mobile | current | Complete | implemented | CHAT-001 |
| CHAT-004 | [Send text message](./chat/chat-004-send-text-message.md) | Chat | collector | collector web, mobile | current | Complete | implemented | CHAT-003 |
| CHAT-005 | [Receive realtime message](./chat/chat-005-receive-realtime-message.md) | Chat | collector | collector web, mobile | v1 | Complete | partial | CHAT-004 |
| CHAT-006 | [Mark messages read](./chat/chat-006-mark-messages-read.md) | Chat | collector | collector web, mobile | v1 | Complete | planned | CHAT-003 |
| CHAT-007 | [Send message attachment](./chat/chat-007-send-message-attachment.md) | Chat | collector | collector web, mobile | future | Complete | absent | CHAT-004 |
| CHAT-008 | [Retry failed message](./chat/chat-008-retry-failed-message.md) | Chat | collector | collector web, mobile | v1 | Complete | planned | CHAT-004 |
| CHAT-009 | [Synchronize offline messages](./chat/chat-009-sync-offline-messages.md) | Chat | collector | collector web, mobile | future | Complete | absent | CHAT-003 |
| CHAT-010 | [Report conversation](./chat/chat-010-report-conversation.md) | Chat | collector | collector web, mobile | future | Complete | absent | CHAT-003 |
| CHAT-011 | [Block conversation participant](./chat/chat-011-block-conversation-participant.md) | Chat | collector | collector web, mobile | future | Complete | absent | CHAT-003 |
| REV-001 | [View collector reviews](./reviews/rev-001-view-collector-reviews.md) | Reviews and trust | guest, collector | public web, collector web, mobile | current | Complete | implemented | AUTH-013 |
| REV-002 | [Check review eligibility](./reviews/rev-002-check-review-eligibility.md) | Reviews and trust | collector | collector web, mobile | v1 | Complete | partial | REV-001 |
| REV-003 | [Submit review](./reviews/rev-003-submit-review.md) | Reviews and trust | collector | collector web, mobile | current | Complete | implemented | REV-002 |
| REV-004 | [Edit review](./reviews/rev-004-edit-review.md) | Reviews and trust | collector | collector web, mobile | future | Complete | absent | REV-003 |
| REV-005 | [Report abusive review](./reviews/rev-005-report-abusive-review.md) | Reviews and trust | collector | collector web, mobile | future | Complete | absent | REV-001 |
| REV-006 | [Moderate review](./reviews/rev-006-moderate-review.md) | Reviews and trust | moderator | admin web | future | Complete | absent | REV-005 |
| REV-007 | [Recalculate reputation](./reviews/rev-007-recalculate-reputation.md) | Reviews and trust | worker | backend-only | v1 | Complete | planned | REV-003, REV-006 |
| REV-008 | [Remove review](./reviews/rev-008-remove-review.md) | Reviews and trust | collector | collector web, mobile | future | Complete | absent | REV-003 |
| LIST-001 | [Browse published listings](./marketplace/list-001-browse-listings.md) | Marketplace listings | guest, buyer | public web, collector web, mobile | v1 | Complete | mocked | - |
| LIST-002 | [Search filter and sort listings](./marketplace/list-002-search-filter-sort-listings.md) | Marketplace listings | guest, buyer | public web, collector web, mobile | v1 | Complete | mocked | LIST-001 |
| LIST-003 | [View listing detail](./marketplace/list-003-view-listing-detail.md) | Marketplace listings | guest, buyer | public web, collector web, mobile | v1 | Complete | mocked | LIST-001 |
| LIST-004 | [Save listing](./marketplace/list-004-save-listing.md) | Marketplace listings | buyer | collector web, mobile | v1 | Complete | planned | LIST-003 |
| LIST-005 | [Remove saved listing](./marketplace/list-005-remove-saved-listing.md) | Marketplace listings | buyer | collector web, mobile | v1 | Complete | planned | LIST-004 |
| LIST-006 | [Contact listing seller](./marketplace/list-006-contact-listing-seller.md) | Marketplace listings | buyer | collector web, mobile | v1 | Complete | mocked | LIST-003, CHAT-002 |
| LIST-007 | [Create listing draft](./marketplace/list-007-create-listing-draft.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | COL-003 |
| LIST-008 | [Upload listing media](./marketplace/list-008-upload-listing-media.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-007 |
| LIST-009 | [Set listing price and quantity](./marketplace/list-009-set-listing-price-quantity.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-007 |
| LIST-010 | [Publish listing](./marketplace/list-010-publish-listing.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-007, LIST-008, LIST-009 |
| LIST-011 | [Edit published listing](./marketplace/list-011-edit-published-listing.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-010 |
| LIST-012 | [Pause listing](./marketplace/list-012-pause-listing.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-010 |
| LIST-013 | [Archive listing](./marketplace/list-013-archive-listing.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-007 |
| LIST-014 | [Mark listing sold out](./marketplace/list-014-mark-listing-sold-out.md) | Marketplace listings | worker | backend-only | v1 | Complete | planned | CHK-004 |
| LIST-015 | [Report listing](./marketplace/list-015-report-listing.md) | Marketplace listings | buyer | collector web, mobile | v1 | Complete | planned | LIST-003 |
| LIST-016 | [Moderate listing](./marketplace/list-016-moderate-listing.md) | Marketplace listings | moderator | admin web | v1 | Complete | planned | LIST-010, LIST-015 |
| LIST-017 | [Resume listing](./marketplace/list-017-resume-listing.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-012 |
| LIST-018 | [Delete unreferenced listing draft](./marketplace/list-018-delete-listing-draft.md) | Marketplace listings | seller | collector web, mobile | v1 | Complete | planned | LIST-007 |
| CHK-001 | [Check listing availability](./checkout/chk-001-check-listing-availability.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | LIST-003 |
| CHK-002 | [Reserve listing quantity](./checkout/chk-002-reserve-listing-quantity.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-001 |
| CHK-003 | [Expire checkout reservation](./checkout/chk-003-expire-checkout-reservation.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-002 |
| CHK-004 | [Submit checkout details](./checkout/chk-004-submit-checkout-details.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-002 |
| CHK-005 | [Choose contact-led fulfillment](./checkout/chk-005-choose-fulfillment-method.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-004 |
| CHK-006 | [View buyer orders](./checkout/chk-006-view-buyer-orders.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-004 |
| CHK-007 | [View order detail](./checkout/chk-007-view-order-detail.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-004 |
| CHK-008 | [Cancel unpaid order](./checkout/chk-008-cancel-unpaid-order.md) | Checkout and orders | buyer | collector web, mobile | v1 | Complete | planned | CHK-004 |
| PAY-001 | [Create payment intent](./payments/pay-001-create-payment-intent.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | CHK-004 |
| PAY-002 | [Redirect to payment provider](./payments/pay-002-redirect-payment-provider.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | PAY-001 |
| PAY-003 | [Handle payment return success](./payments/pay-003-payment-return-success.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | PAY-002 |
| PAY-004 | [Handle payment return failure](./payments/pay-004-payment-return-failure.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | PAY-002 |
| PAY-005 | [Cancel payment attempt](./payments/pay-005-cancel-payment-attempt.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | PAY-001 |
| PAY-006 | [Process payment webhook](./payments/pay-006-process-payment-webhook.md) | Payments | worker, external provider | backend-only | v1 | Complete | planned | PAY-001 |
| PAY-007 | [Ignore duplicate payment event](./payments/pay-007-deduplicate-payment-event.md) | Payments | worker, external provider | backend-only | v1 | Complete | planned | PAY-006 |
| PAY-008 | [Recover out-of-order payment event](./payments/pay-008-recover-out-of-order-event.md) | Payments | worker, external provider | backend-only | v1 | Complete | planned | PAY-006 |
| PAY-009 | [Retry failed payment](./payments/pay-009-retry-failed-payment.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | PAY-004 |
| PAY-010 | [Issue provider refund](./payments/pay-010-issue-provider-refund.md) | Payments | administrator | admin web | future | Complete | absent | PAY-006 |
| PAY-011 | [Track refund result](./payments/pay-011-track-refund-result.md) | Payments | worker, external provider | backend-only | future | Complete | absent | PAY-010 |
| PAY-012 | [Create direct split settlement](./payments/pay-012-create-direct-split-settlement.md) | Payments | worker, external provider | backend-only | future | Complete | absent | PAY-006 |
| PAY-013 | [Reconcile provider transactions](./payments/pay-013-reconcile-provider-transactions.md) | Payments | worker, external provider | backend-only | v1 | Complete | planned | PAY-006 |
| PAY-014 | [Generate payment receipt](./payments/pay-014-generate-payment-receipt.md) | Payments | buyer | collector web, mobile | v1 | Complete | planned | PAY-006 |
| FUL-001 | [Release protected contact details](./fulfillment/ful-001-release-contact-details.md) | Contact-led fulfillment | worker | backend-only | v1 | Complete | planned | PAY-006 |
| FUL-002 | [Schedule meetup](./fulfillment/ful-002-schedule-meetup.md) | Contact-led fulfillment | buyer, seller | collector web, mobile | future | Complete | absent | FUL-001 |
| FUL-003 | [Record optional shipment tracking](./fulfillment/ful-003-record-order-tracking.md) | Contact-led fulfillment | buyer, seller | collector web, mobile | future | Complete | absent | FUL-001 |
| FUL-004 | [Update fulfillment status](./fulfillment/ful-004-update-fulfillment-status.md) | Contact-led fulfillment | buyer, seller | collector web, mobile | future | Complete | absent | FUL-001 |
| FUL-005 | [Buyer confirms handoff](./fulfillment/ful-005-buyer-confirm-handoff.md) | Contact-led fulfillment | buyer, seller | collector web, mobile | future | Complete | absent | FUL-004 |
| FUL-006 | [Seller confirms handoff](./fulfillment/ful-006-seller-confirm-handoff.md) | Contact-led fulfillment | buyer, seller | collector web, mobile | future | Complete | absent | FUL-004 |
| FUL-007 | [Mark fulfillment failed](./fulfillment/ful-007-mark-fulfillment-failed.md) | Contact-led fulfillment | buyer, seller | collector web, mobile | future | Complete | absent | FUL-004 |
| DSP-001 | [Open payment dispute](./disputes/dsp-001-open-payment-dispute.md) | Disputes and refunds | buyer, seller | collector web, mobile | future | Complete | absent | PAY-006 |
| DSP-002 | [Submit dispute evidence](./disputes/dsp-002-submit-dispute-evidence.md) | Disputes and refunds | buyer, seller | collector web, mobile | future | Complete | absent | DSP-001 |
| DSP-003 | [Seller responds to dispute](./disputes/dsp-003-seller-respond-dispute.md) | Disputes and refunds | buyer, seller | collector web, mobile | future | Complete | absent | DSP-001 |
| DSP-004 | [Triage dispute](./disputes/dsp-004-triage-dispute.md) | Disputes and refunds | administrator | admin web | future | Complete | absent | DSP-001 |
| DSP-005 | [Resolve with refund](./disputes/dsp-005-resolve-dispute-refund.md) | Disputes and refunds | administrator | admin web | future | Complete | absent | DSP-004, PAY-010 |
| DSP-006 | [Resolve without refund](./disputes/dsp-006-resolve-dispute-no-refund.md) | Disputes and refunds | administrator | admin web | future | Complete | absent | DSP-004 |
| DSP-007 | [Close dispute after provider result](./disputes/dsp-007-close-dispute.md) | Disputes and refunds | worker | backend-only | future | Complete | absent | DSP-005 |
| DSP-008 | [Appeal dispute decision](./disputes/dsp-008-appeal-dispute.md) | Disputes and refunds | buyer, seller | collector web, mobile | future | Complete | absent | DSP-005, DSP-006 |
| NTF-001 | [List notifications](./notifications/ntf-001-list-notifications.md) | Notifications | collector | collector web, mobile | v1 | Complete | planned | AUTH-005 |
| NTF-002 | [Mark notification read](./notifications/ntf-002-mark-notification-read.md) | Notifications | collector | collector web, mobile | v1 | Complete | planned | NTF-001 |
| NTF-003 | [Mark all notifications read](./notifications/ntf-003-mark-all-notifications-read.md) | Notifications | collector | collector web, mobile | v1 | Complete | planned | NTF-001 |
| NTF-004 | [Deliver realtime notification](./notifications/ntf-004-deliver-realtime-notification.md) | Notifications | worker | backend-only | v1 | Complete | planned | NTF-001 |
| NTF-005 | [Register mobile push device](./notifications/ntf-005-register-push-device.md) | Notifications | collector | collector web, mobile | future | Complete | absent | MOB-003 |
| NTF-006 | [Manage notification preferences](./notifications/ntf-006-manage-notification-preferences.md) | Notifications | collector | collector web, mobile | v1 | Complete | planned | AUTH-014 |
| NTF-007 | [Retry failed notification](./notifications/ntf-007-retry-failed-notification.md) | Notifications | worker | backend-only | v1 | Complete | planned | NTF-004 |
| NTF-008 | [Dead-letter notification](./notifications/ntf-008-dead-letter-notification.md) | Notifications | worker | backend-only | v1 | Complete | planned | NTF-007 |
| ADM-001 | [View operations dashboard](./administration/adm-001-view-operations-dashboard.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | current | Complete | implemented | AUTH-005 |
| ADM-002 | [List and search users](./administration/adm-002-list-search-users.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | current | Complete | implemented | ADM-001 |
| ADM-003 | [Block user](./administration/adm-003-block-user.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | current | Complete | implemented | ADM-002 |
| ADM-004 | [Assign user role](./administration/adm-004-assign-user-role.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | future | Complete | absent | ADM-002 |
| ADM-005 | [Review listing moderation queue](./administration/adm-005-review-listing-queue.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | v1 | Complete | planned | LIST-016 |
| ADM-006 | [Review user and content reports](./administration/adm-006-review-content-reports.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | v1 | Complete | planned | ADM-002 |
| ADM-007 | [Monitor payments](./administration/adm-007-monitor-payments.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | v1 | Complete | planned | PAY-013 |
| ADM-008 | [Oversee refunds](./administration/adm-008-oversee-refunds.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | future | Complete | absent | PAY-010 |
| ADM-009 | [Inspect audit log](./administration/adm-009-inspect-audit-log.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | v1 | Complete | planned | ADM-002 |
| ADM-010 | [Request administrative export](./administration/adm-010-request-admin-export.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | future | Complete | absent | ADM-009 |
| ADM-011 | [Replay failed background job](./administration/adm-011-replay-failed-job.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | v1 | Complete | planned | ADM-009 |
| ADM-012 | [Activate maintenance mode](./administration/adm-012-activate-maintenance-mode.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | future | Complete | absent | ADM-009 |
| ADM-013 | [Unblock user](./administration/adm-013-unblock-user.md) | Administration and operations | administrator, moderator, worker | admin web, backend-only | v1 | Complete | planned | ADM-003 |
| INTL-001 | [Create market configuration](./international/intl-001-create-market-configuration.md) | International and tax | administrator | admin web | future | Complete | absent | ADM-004 |
| INTL-002 | [Activate market](./international/intl-002-activate-market.md) | International and tax | administrator | admin web | future | Complete | absent | INTL-001 |
| INTL-003 | [Configure currency and minor units](./international/intl-003-configure-market-currency.md) | International and tax | administrator | admin web | future | Complete | absent | INTL-001 |
| INTL-004 | [Configure regional providers](./international/intl-004-configure-market-providers.md) | International and tax | administrator | admin web | future | Complete | absent | INTL-001 |
| INTL-005 | [Calculate applicable tax](./international/intl-005-calculate-applicable-tax.md) | International and tax | buyer | collector web, mobile, backend-only | future | Complete | absent | INTL-002 |
| INTL-006 | [Refresh exchange rates](./international/intl-006-refresh-exchange-rates.md) | International and tax | worker | backend-only | future | Complete | absent | INTL-003 |
| INTL-007 | [Publish regional legal copy](./international/intl-007-publish-regional-legal-copy.md) | International and tax | administrator | admin web | future | Complete | absent | INTL-001 |
| INTL-008 | [Migrate Egypt-only data to market scope](./international/intl-008-migrate-egypt-market-scope.md) | International and tax | worker | backend-only | future | Complete | absent | INTL-001 |
| MOB-001 | [Authenticate mobile collector](./mobile/mob-001-authenticate-mobile-collector.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | AUTH-003 |
| MOB-002 | [Open authenticated deep link](./mobile/mob-002-open-authenticated-deep-link.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | MOB-001 |
| MOB-003 | [Request push permission](./mobile/mob-003-request-push-permission.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | MOB-001 |
| MOB-004 | [Scan swap QR with camera](./mobile/mob-004-scan-swap-qr-camera.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | SWAP-014 |
| MOB-005 | [Upload mobile listing media](./mobile/mob-005-upload-mobile-listing-media.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | LIST-008 |
| MOB-006 | [Read cached data offline](./mobile/mob-006-read-cached-data-offline.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | MOB-001 |
| MOB-007 | [Reconnect and synchronize](./mobile/mob-007-reconnect-and-sync.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | MOB-006 |
| MOB-008 | [Enforce minimum app version](./mobile/mob-008-enforce-minimum-app-version.md) | React Native | collector, buyer, seller | mobile | future | Complete | absent | MOB-001 |
| SYS-001 | [Handle unauthenticated request](./system/sys-001-handle-401.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | partial | - |
| SYS-002 | [Handle forbidden action](./system/sys-002-handle-403.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | partial | - |
| SYS-003 | [Handle missing resource](./system/sys-003-handle-404.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | absent | - |
| SYS-004 | [Handle deleted or archived resource](./system/sys-004-handle-gone-resource.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | v1 | Complete | planned | SYS-003 |
| SYS-005 | [Render loading state](./system/sys-005-render-loading-state.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | partial | - |
| SYS-006 | [Render empty result](./system/sys-006-render-empty-state.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | partial | - |
| SYS-007 | [Handle validation failure](./system/sys-007-handle-validation-failure.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | partial | - |
| SYS-008 | [Recover from API failure](./system/sys-008-recover-api-failure.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | current | Complete | partial | - |
| SYS-009 | [Operate offline](./system/sys-009-operate-offline.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | v1 | Complete | planned | MOB-006 |
| SYS-010 | [Display maintenance state](./system/sys-010-display-maintenance.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | v1 | Complete | planned | ADM-012 |
| SYS-011 | [Degrade external dependency safely](./system/sys-011-degrade-external-dependency.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | v1 | Complete | planned | - |
| SYS-012 | [Enforce rate limit](./system/sys-012-enforce-rate-limit.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | v1 | Complete | planned | - |
| SYS-013 | [Resolve concurrency or stale client conflict](./system/sys-013-resolve-concurrency-conflict.md) | Shared system behavior | guest, collector, administrator, worker | public web, collector web, admin web, mobile, backend-only | v1 | Complete | planned | - |
| SYS-014 | [View product landing page](./system/sys-014-view-product-landing.md) | Shared system behavior | guest | public web | current | Complete | implemented | - |
