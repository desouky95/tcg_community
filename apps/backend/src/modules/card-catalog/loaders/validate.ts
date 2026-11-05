import type {
    LoaderOptions,
  } from "@medusajs/framework/types"
  
  import {
    MedusaError,
  } from "@medusajs/framework/utils"
  
  import type {
    CardCatalogModuleOptions,
  } from "../types"
  
  export default async function validateCardCatalogOptions({
    options,
  }: LoaderOptions<CardCatalogModuleOptions>) {
    if (!options?.baseUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "CARD_CATALOG_URL is required."
      )
    }
    if (!options?.apiKey) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "CARD_CATALOG_API_KEY is required.")
    }
  }
