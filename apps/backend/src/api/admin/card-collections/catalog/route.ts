import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { CARD_CATALOG_MODULE } from "../../../../modules/card-catalog";
import CardCatalogService from "../../../../modules/card-catalog/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const page = Number(req.query.page ?? 1);
  const search = String(req.query.search ?? "").trim();
  const collectionId = req.query.collection_id;
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    search.length > 100 ||
    (collectionId !== undefined && !/^[1-9]\d*$/.test(String(collectionId)))
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid catalog query"
    );
  }
  const catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE);
  const result = await catalog.listCollections(search, page);
  res.json(result);
}
