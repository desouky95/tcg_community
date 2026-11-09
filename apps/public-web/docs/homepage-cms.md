# Managing the homepage

In Strapi, create the Homepage entry and add sections in the desired order. Add a HeroSlider and select active, published banners with a title, subtitle, destination URL, and desktop and mobile images. Add a Product section with a heading, optional description and shop link, and select product records in display order. Products must have a Medusa ID and be available through the configured Medusa sales channel. Publish the Homepage after editing; unpublished changes do not appear in the storefront.

The storefront reads Strapi's published homepage and retrieves selected products from Medusa. Set `NEXT_PUBLIC_DEFAULT_REGION` to a Medusa region ID (`reg_...`) or an ISO 2 country code such as `eg` to display calculated prices. If no region ID is configured, products appear without prices. `NEXT_PUBLIC_STRAPI_API_URL` should point to the Strapi origin; `STRAPI_API_TOKEN` must have read access to Homepage, banners, and products. Keep the token server-side.

To add a section type, define a Strapi component, add it to the Homepage dynamic zone, restart Strapi, and regenerate the shared client with `pnpm --filter @tcg/strapi-client strapi:generate`. Extend the explicit populate query and section renderer in the storefront, then publish the new content. Strapi must be running and the generation command must be able to access its schema endpoint.


## Latest products by collection

In the Homepage dynamic zone add **Latest products**, enter a heading, search for and select a Medusa collection, and set the limit (1–48; default 8). Add an optional description and shop link, then publish. The storefront displays the newest products available to its Medusa sales channel. A deleted collection or an empty collection shows the empty state; a Medusa outage shows an unavailable state. The manual Product section remains available.

Configure `MEDUSA_BACKEND_URL` and `MEDUSA_PUBLISHABLE_KEY` in the Strapi server environment. The key must be associated with the storefront sales channel. The collection lookup is a Strapi admin-authenticated endpoint; the key is not sent to the browser. Restart Strapi and rebuild its admin after changing the plugin or custom field.

Manual product sections require existing Strapi product records containing Medusa product IDs. This integration does not synchronize product records from Medusa.
