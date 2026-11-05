import {
    MedusaService,
  } from "@medusajs/framework/utils"
  
  import CardSale from "./models/card-sale"
  import CardSaleItem from "./models/card-sale-item"
  
  class CardSaleModuleService extends MedusaService({
    CardSale,
    CardSaleItem,
  }) {}
  
  export default CardSaleModuleService