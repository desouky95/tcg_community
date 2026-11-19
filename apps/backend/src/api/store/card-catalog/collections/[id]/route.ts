import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { CARD_CATALOG_MODULE } from "../../../../../modules/card-catalog";
import CardCatalogService from "../../../../../modules/card-catalog/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const collectionId = req.params.id;
  if (!collectionId || !/^[1-9]\d*$/.test(collectionId)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid catalog query",
    );
  }
  const catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE);
  res.json(await catalog.getCollectionCards(collectionId, req.query));
}
