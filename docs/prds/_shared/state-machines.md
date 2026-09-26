# Shared state machines

## Listing
`draft -> pending_review -> published <-> paused -> sold_out|archived`; moderation may move `pending_review|published -> rejected|hidden`. Active reservations prevent destructive archive.

## Order
`pending_payment -> paid -> contact_released -> fulfilling -> completed`; alternate terminal paths are `cancelled`, `payment_failed`, and `refunded`. Provider truth controls payment transitions.

## Payment intent
`created -> requires_action -> processing -> authorized|captured|failed|cancelled`; refund states are separate records. Duplicate and out-of-order events cannot regress terminal state.

## Swap deal
`pending -> accepted -> in_progress|shipping -> completed`; `pending|accepted -> cancelled`; expired proposals use `expired`. Completion requires both participant confirmations or an explicit operator resolution.

## Dispute
`open -> awaiting_response -> under_review -> resolved -> closed`; one timely `appealed` transition returns the case to review.

All transitions record actor, timestamp, prior/new version, reason, correlation ID, and event. Illegal transitions return 409 without side effects.
