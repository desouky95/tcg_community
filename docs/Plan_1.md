# TCG Community Web and Mobile System Design

## Summary

Design an incremental, Egypt-first TCG marketplace platform serving:

- A separate web client with the rendering framework decided later between React SPA and Next.js.
- React Native mobile apps for iOS and Android.
- The existing AdonisJS backend evolved as a modular monolith.
- Admin-managed TCG catalogues, collections, trading, chat, reviews, and marketplace listings.

The first marketplace scope covers listing through payment. Shipping, seller payout, and dispute operations remain future phases.

## Architecture

- Keep the existing AdonisJS backend, Postgres support, token authentication, collections, checklists, swaps, conversations, reviews, and admin capabilities.
- Introduce a client-facing GraphQL API while retaining `/api/v1` REST compatibility during migration.
- Organize backend modules around:
  - Identity and profiles
  - Catalog and categories
  - Collections and card ownership states
  - Swap matching and deal workflows
  - Marketplace listings and moderation
  - Checkout and payment intents
  - Conversations and messaging
  - Reviews, notifications, and administration
- Use Postgres as the production database, object storage for card/listing media, and background jobs for imports, notifications, payment reconciliation, and statistics.
- Add an event abstraction for chat, order, payment, and moderation events. Use an active-session event channel plus mobile push notifications for background updates.

## Client Architecture

- Create shared TypeScript packages for:
  - GraphQL schema and generated client types
  - Domain models and validation
  - Authentication/session handling
  - Localization and EN/AR RTL rules
  - Marketplace and collection state logic
- Build the web client independently from the final framework decision. Preserve current collection, checklist, profile, chat, swap, and admin flows during migration.
- Build React Native mobile apps from the same contracts and domain packages, with native navigation, camera/QR support, push notifications, and offline-friendly cached reads.
- Maintain the existing TCG Nexus visual direction: responsive layouts, dark/light themes, gamification, card-focused UI, and mobile-first interaction states.

## Core Interfaces

GraphQL domains should provide operations for:

- Authentication, profile, and account verification
- Categories, sets, cards, search, and admin catalogue management
- User collections with owned, wanted, and offered states
- Swap matching, conversations, and deal status
- Marketplace listings, moderation status, checkout, and payment state
- Reviews, notifications, and user reports

Payment integrations should use a provider adapter so the first Egypt-focused provider can be selected without changing marketplace domain logic.

Marketplace entities should distinguish:

- Catalogue cards and sets
- User-owned collection entries
- Marketplace listings
- Buyer checkout/order records
- Payment intents and payment events
- Moderation decisions
- Conversation and review records

## Delivery Sequence

1. Stabilize shared catalog, identity, collections, search, chat, swaps, and admin contracts.
2. Add shared GraphQL types and generated clients while preserving existing REST consumers.
3. Add marketplace listings, seller moderation, buyer checkout, payment authorization/capture, and payment webhooks.
4. Deliver the web marketplace experience.
5. Deliver React Native collection, trading, chat, notifications, and marketplace flows.
6. Add shipping, seller payouts, disputes, and broader regional support in a later phase.

## Test Plan

- Unit-test marketplace state transitions, payment reconciliation, permissions, collection ownership, and moderation rules.
- Add GraphQL contract tests shared by web and mobile clients.
- Add API integration tests for authentication, listings, checkout, payment webhooks, swaps, chat, and reviews.
- Add end-to-end tests for:
  - Signup and OTP verification
  - Adding cards to a collection
  - Finding and negotiating a swap
  - Creating and moderating a listing
  - Completing checkout and receiving payment confirmation
  - Receiving realtime and push notifications
- Validate EN/AR translations, RTL layouts, responsive breakpoints, accessibility, loading states, offline recovery, and mobile deep links.

## Assumptions

- The current repository is the implementation baseline, not a disposable prototype.
- The backend remains a modular monolith for the initial release.
- The web framework remains intentionally undecided; the client contract must not depend on SSR.
- Egypt-first means mobile/OTP identity, EGP-oriented payment integration, and local operational assumptions, while avoiding hard-coding one provider.
- Admins remain the authoritative source for catalogues, cards, images, and metadata.
- Shipping, payout, tax, dispute, and internationalization complexity are explicitly deferred beyond the listing-to-payment milestone.
