# Shared state machines

## Swap proposal and agreement

`proposed -> accepted | rejected | expired | cancelled`; a counter creates a new proposal version requiring the other participant's consent. A stale response cannot accept a changed proposal. The accepted version snapshots items, quantities, mode and, for middleman, each participant's displayed fee. Cancellation after acceptance depends on custody, payment and resolution rules; never erase a custody obligation.

## Fulfillment

- **Direct postage:** accepted → each participant records shipment → each confirms receipt → completed. A reported issue may pause completion and enter review.
- **On-ground:** accepted → participants arrange handoff → each confirms → completed. An issue may enter review.
- **Middleman:** accepted → all required fees confirmed → each sends items → NextPull records receipt and inspection of both sides → NextPull forwards both sides → both recipients confirm → completed. A discrepancy pauses forwarding and enters review. Record each incoming and outgoing leg separately.

## Issue and dispute

`reported -> under review -> resolved`, with participant evidence and an auditable operator decision. The resolution records any required return, refund or other action and tracks it to an outcome. Details of eligibility windows, returns, liability and refunds require business approval before launch.

## Commerce order and fee payment

Medusa and the relevant payment provider own their respective payment and order state. A customer-facing success page is not proof of payment. Deal progression requires verified confirmation of every required fee payment; failure and reconciliation must remain visible and recoverable.
