import type {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  
  import {
    addCardSaleItemsToCartWorkflow,
  } from "../../../../../workflows/add-card-sale-items-to-cart"
  
  import type {
    PostCardSaleItems,
  } from "./validators"
  
  export async function POST(
    req: MedusaRequest<PostCardSaleItems>,
    res: MedusaResponse
  ) {
    const cartId =
      req.params.id
  
    const body =
      req.validatedBody
  
    const {
      result,
    } =
      await addCardSaleItemsToCartWorkflow(
        req.scope
      ).run({
        input: {
          cart_id:
            cartId,
  
          items:
            body.items,
        },
      })
  
    res.status(200).json(
      result
    )
  }