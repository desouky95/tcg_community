# Technical architecture

| Component | Responsibility | Repository |
| --- | --- | --- |
| Storefront | Next.js ecommerce and Collector Disk feature pages | `apps/public-web` |
| Collector Disk | Vite collections, matching, deals and chat | `apps/web` |
| AdonisJS | Identity, collector catalogue, collections, chat, swaps and safety records | `apps/api` |
| Medusa | NextPull products, carts, checkout, orders and ecommerce fulfillment | `apps/backend` |
| Strapi | Editorial content and publication | `apps/cms` |

AdonisJS is the identity authority. Storefront customer identity must be linked securely to the corresponding Medusa customer without sharing passwords. The exact token exchange, provisioning, account recovery and session protocol require design and security review; the PRDs do not assert they already exist. Medusa owns ecommerce orders and payments; swap deals and custody remain in AdonisJS. The middleman fee payment integration and reconciliation require an explicit design before implementation, with payment status reflected in the deal only after verified provider confirmation.

Each service owns its data and applies its own supported migration mechanisms. Integrations use authenticated service interfaces; no cross-service direct writes. A failure in CMS or another dependency must produce a safe error or defined fallback, never an invented order, payment or completed swap. Existing code and old route names are evidence to audit, not guarantees of target behavior.
