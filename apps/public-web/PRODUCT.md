# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Collectors looking for cards and collectibles.

## Product Purpose

Next Pull provides an ecommerce storefront for collectors. Collector Disk is a future home for collection tracking, swapping, and marketplace listings.

## Operating Context

Collectors browse products and collections, then follow product details to view or buy. Missing-list products are a distinct storefront product type with a pack cover image and sticker images managed in the CMS.

## Capabilities and Constraints

The store is the current focus. Collector Disk features are on hold and should be presented as coming soon without an announced launch date. Existing public feature routes remain accessible; storefront navigation points to the Collector Disk overview.

- Product cards have two types: normal and missing-list. Medusa `metadata.type === "missing_list"` identifies missing-list products; CMS media does not determine type. Normal cards keep the existing product-card behavior.
- Missing-list cards can open an on-page pack experience to preview their sticker images, with a separate link to product details for viewing or buying.

## Brand Commitments

Use the existing Next Pull identity and shared web design system.
