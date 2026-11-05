import {
  configureStoreSearch,
  defineMiddlewares,
  validateAndTransformBody,
  authenticate,
} from "@medusajs/framework/http";

import { PostAdminCardSaleSchema } from "./admin/collection-sale/validators";

import { PostCardSaleItemsSchema } from "./store/carts/[id]/card-sale-items/validators";
import { CreateMissingListSchema, UpdateMissingListSchema } from "./admin/missing-lists/validators";
import { CreateCardCollectionSchema } from "./admin/card-collections/validators";
// The product index declares filterable `status` and `sales_channel_ids`, so
// the route narrows it to published products in the key's sales channels.
export default defineMiddlewares({
  routes: [
    { matcher: "/admin/missing-lists", method: "POST", middlewares: [authenticate("user", ["session", "bearer", "api-key"]), validateAndTransformBody(CreateMissingListSchema)] },
    { matcher: "/admin/missing-lists/:id", method: "POST", middlewares: [authenticate("user", ["session", "bearer", "api-key"]), validateAndTransformBody(UpdateMissingListSchema)] },
    {
      matcher: "/admin/card-collections/catalog",
      method: "GET",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
    {
      matcher: "/admin/card-collections",
      method: "POST",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"]), validateAndTransformBody(CreateCardCollectionSchema)],
    },
    {
      method: ["POST"],
      matcher: "/store/search",
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    {
      matcher: "/admin/collection-sale",

      method: "POST",

      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"]),

        validateAndTransformBody(PostAdminCardSaleSchema),
      ],
    },
    {
      matcher: "/store/carts/:id/card-sale-items",

      method: "POST",

      middlewares: [validateAndTransformBody(PostCardSaleItemsSchema)],
    },
  ],
});
