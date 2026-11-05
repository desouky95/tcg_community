import {
    Module,
  } from "@medusajs/framework/utils"
  
  import CardCatalogModuleService from "./service"
  import validateCardCatalogOptions from "./loaders/validate"
  
  export const CARD_CATALOG_MODULE =
    "card_catalog"
  
  export default Module(
    CARD_CATALOG_MODULE,
    {
      service: CardCatalogModuleService,
      loaders: [
        validateCardCatalogOptions,
      ],
    }
  )