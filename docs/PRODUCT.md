# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React/Vite client with an AdonisJS backend in a pnpm monorepo.

## Users

Collectors who organise and discover trading-card collections, sellers who
list cards and manage marketplace activity, and administrators who operate
catalogue, user, listing, payment, report, and audit workflows.

## Product Purpose

TCG Nexus helps people organise, find, trade, and eventually buy trading cards
with confidence. Success means a collector can maintain a trusted collection,
find relevant cards or swap partners, complete marketplace actions clearly, and
admins can keep the catalogue and community healthy.

## Positioning

TCG Nexus is an Egypt-first collector community combining trusted cataloguing,
swap workflows, and marketplace workflows in one product.

## Operating Context

Collectors use catalogue, checklist, collection, chat, swapping, profile, and
marketplace surfaces. Sellers use listing, checkout, order, and payment
surfaces. Administrators use catalogue, user, marketplace, moderation, and
audit surfaces. The client can fall back to repository mock data when the
backend is unavailable.

## Capabilities and Constraints

- Public entry, authentication, OTP verification, catalogue exploration, set
  detail, marketplace browse, and listing detail routes.
- Collector workspace routes for dashboard, collection, editing, swaps, chat,
  profiles, marketplace selling, checkout, orders, swap detail, notifications,
  and settings.
- Administration routes for dashboard, users, collections, categories,
  catalogue import, listings, reports, payments, and audit log.
- Shared product states include 404, 403, offline recovery, maintenance,
  loading/skeleton, empty collection, empty search, and API error.
- English is the source language; Arabic translations should remain natural and
  preserve the same calm, confident tone.
- New visual work uses comp-first workflow: generated design images establish
  the visual bar before implementation.

## Brand Commitments

The product name is TCG Nexus. The voice is clear, direct, warm,
informed, community-minded, and never salesy or overly corporate. Existing
brand assets and guidelines are documented in `docs/brand-guidelines.md`.

## Evidence on Hand

- Route and state inventory: `docs/client-pages.md`.
- Brand commitments: `docs/brand-guidelines.md`.
- Existing React client: `apps/web/`.
- Development fallback data: `apps/web/src/lib/mockData.ts`.
- Existing TCG Nexus logo asset: `apps/web/public/logo_tcg-nexus_primary_20260923.svg`.

## Product Principles

- Make collection ownership and card metadata trustworthy.
- Keep one obvious primary action on every screen.
- Make discovery, swaps, and buying feel useful and community-minded.
- Preserve clear recovery paths for unavailable, empty, and failed states.
- Keep collector terminology understandable in both English and Arabic.

## Accessibility & Inclusion

The web client should preserve readable contrast, visible focus, keyboard
navigation, responsive layouts, reduced-motion support, and non-color-only
state communication. Authentication should support paste and password-manager
flows. These requirements are reinforced by the project’s UI/UX guidance.
