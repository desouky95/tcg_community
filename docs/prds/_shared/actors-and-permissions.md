# Actors and permissions

- **Guest:** browse published storefront and public content.
- **Collector:** authenticated AdonisJS user; manage their own collection, messages and swaps. A verified account is required to propose or accept swaps.
- **Customer:** buy NextPull products and access only their own Medusa orders; identity is linked to the AdonisJS account through a verified integration.
- **Operator:** manage assigned middleman custody, inspections and forwarding; access only information needed for the task.
- **Moderator:** handle reports, blocks and disputes with restricted evidence access.
- **Store operator and CMS editor:** administer Medusa commerce and Strapi editorial content according to their respective roles.

Enforce authorization in the owning backend, not only in the interface. Participants see only their own private data and information explicitly shared for an active deal. Operator actions require an auditable identity and reason. Blocking prevents new contact, matches and proposals but must not erase or strand an active deal or its evidence.
