# Card-collection products in Medusa Admin

## Current status

**Card-collection products can now be prepared in Medusa Admin, but are not ready for live sale.** The public storefront does not yet provide card selection, a cart, or checkout for this flow.

Use the **Card collections** page to create a draft product linked to a checklist. Each selected card becomes a separate Medusa variant with an EGP price and inventory tracking enabled. Keep the product in draft while the storefront integration is incomplete.

The existing experimental card-sale API uses a shared variant and does not safely manage stock for concurrent purchases. Do not use it for live sales.

## Create a draft product

1. Open **Card collections** in the Medusa Admin navigation.
2. Search for a checklist and select **Choose**. Use the page controls to browse additional results.
3. Enter the product title and, optionally, a description.
4. Enter a default price in EGP, then search for and select the cards to sell. You can choose up to 100 cards per product; selections remain checked when you change pages.
5. Review the selected cards and adjust each price if needed. Select **Create draft product**, then **Open product**.
6. In the product's Medusa details, complete the shipping profile, sales channel, images, and other product information. Use Medusa's inventory controls to add quantities for each card's inventory item at the appropriate stock location. Newly created card variants have no stock.

The default price is applied when a card is selected. Changing it later does not change prices already selected; edit those in the review list. After creation, use Medusa's normal product and inventory controls to manage the variants and their prices or stock. The creation page does not currently add cards to an existing product or synchronize later checklist changes.

## Launch prerequisites

Before launching a card-collection product, an administrator and the technical team will need:

- A prepared checklist in the catalog, with the cards and their details reviewed.
- A Medusa region configured for Egyptian pounds (EGP).
- A stock location connected to the appropriate sales channel.
- A sales channel and publishable API key configured for the storefront.
- A shipping option available to customers in the EGP region.
- Medusa's manual payment provider configured for the region, with an agreed process for collecting payment and fulfilling orders.
- The catalog connection configured by the technical team. Service credentials must remain server-side.

These are launch prerequisites, not confirmation that they are already configured in your installation. Ask the technical team to verify them before publication.

## Pending implementation

The following instructions will be added and verified once the remaining features are available:

1. **Customer purchase:** Shoppers need a card selector, cart, shipping details, and manual-payment checkout.
2. **Order management:** Verify card identity and quantities throughout the order and fulfillment workflow.
3. **Storefront verification:** Verify that card stock and price changes appear correctly and that concurrent checkout cannot oversell.

Do not publish a card-collection product until these workflows and per-card inventory protection have been implemented and tested end to end.
