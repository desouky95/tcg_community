import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  isEgyptEgpRegion,
  isValidPaymentSettings,
  readPaymentSettings,
  type PaymentRegion,
} from "../../../lib/offline-payment-settings";

export async function GET(
  req: MedusaRequest<{ region_id: string }>,
  res: MedusaResponse,
) {
  const regionId = (req.validatedQuery as { region_id: string }).region_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2", "metadata"],
    filters: { id: regionId },
  });
  const region = data[0] as PaymentRegion | undefined;

  if (!region || !isEgyptEgpRegion(region))
    return res.status(404).json({ message: "Payment settings not found." });

  const settings = readPaymentSettings(region);
  return res.json({
    instapay: isValidPaymentSettings(region)
      ? {
          instapay_url: settings.instapay_url,
          whatsapp_number: settings.whatsapp_number,
        }
      : null,
  });
}
