import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows";
import {
  isEgyptEgpRegion,
  readPaymentSettings,
  type PaymentRegion,
} from "../../../lib/offline-payment-settings";
import type { UpdatePaymentSettings } from "./validators";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2", "metadata"],
    pagination: { take: 100, skip: 0 },
  });

  return res.json({
    regions: (data as PaymentRegion[])
      .filter(isEgyptEgpRegion)
      .map(readPaymentSettings),
  });
}

export async function POST(
  req: MedusaRequest<UpdatePaymentSettings>,
  res: MedusaResponse,
) {
  const { region_id, instapay_url, whatsapp_number } = req.validatedBody;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2", "metadata"],
    filters: { id: region_id },
  });
  const region = data[0] as PaymentRegion | undefined;

  if (!region || !isEgyptEgpRegion(region)) {
    return res.status(404).json({ message: "Egypt / EGP region not found." });
  }

  const { result } = await updateRegionsWorkflow(req.scope).run({
    input: {
      selector: { id: region.id },
      update: {
        metadata: {
          ...(region.metadata ?? {}),
          instapay_url,
          instapay_whatsapp_number: whatsapp_number,
        },
      },
    },
  });

  return res.json({ region: readPaymentSettings(result[0] as PaymentRegion) });
}
