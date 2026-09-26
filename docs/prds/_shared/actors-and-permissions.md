# Actors and permissions

## Roles

| Actor | Allowed scope | Explicit restrictions |
| --- | --- | --- |
| Guest | Published catalogue, public collections, profiles, reviews, and listings | Cannot mutate private or transactional state. |
| Collector | Own account, collections, swaps, conversations, reviews, notifications | Cannot access another user's private collection, contact data, or moderation state. |
| Buyer | Collector rights plus checkout, orders, payments, fulfillment, and disputes for owned orders | Cannot mutate seller listing or settlement data. |
| Seller | Collector rights plus owned listings, order participation, connected-account settlement visibility | Cannot view buyer contact until confirmed payment and consent. |
| Moderator | Assigned content queues, reports, reviews, listings, and limited user actions | Cannot change infrastructure, payment credentials, or grant equal/higher roles. |
| Administrator | Full operational policy and catalogue access with step-up authentication | Cannot bypass immutable audit logging or provider authorization. |
| Worker | Narrow service identity for named queue consumers and scheduled jobs | No interactive login and no authority outside the job contract. |
| External provider | Signed webhook or adapter capability only | Never receives a general API token or unrelated personal data. |

Authorization is deny-by-default. Every query scopes records before loading them, every command checks role plus resource ownership, and sensitive operator actions require reason codes and audit records. Admin web is the only administrative client; React Native covers collector, buyer, and seller roles.
