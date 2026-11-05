import {
    Module,
  } from "@medusajs/framework/utils"
  
  import CardSaleModuleService from "./service"
  
  export const CARD_SALE_MODULE =
    "card_sale"
  
  export default Module(
    CARD_SALE_MODULE,
    {
      service: CardSaleModuleService,
    }
  )