import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import CardCatalogService from "../../../../../modules/card-catalog/service";
import { CARD_CATALOG_MODULE } from "../../../../../modules/card-catalog";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const collectionId = req.params.id;
  if (!collectionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid catalog query"
    );
  }
  const catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE);
  const query = req.query
  const result = await catalog.getCollectionCards(String(collectionId),query);

  res.json(result);
}

