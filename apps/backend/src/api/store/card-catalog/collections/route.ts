import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { CARD_CATALOG_MODULE } from "../../../../modules/card-catalog";
import CardCatalogService from "../../../../modules/card-catalog/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const page = Number(req.query.page ?? 1);
  const search = String(req.query.search ?? "").trim();
  if (!Number.isSafeInteger(page) || page < 1 || search.length > 100) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid catalog query",
    );
  }
  const catalog = req.scope.resolve<CardCatalogService>(CARD_CATALOG_MODULE);
  res.json(await catalog.listCollections(search, page));
}
