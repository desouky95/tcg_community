export type PaymentRegion = {
  id: string;
  name: string;
  currency_code: string;
  countries?: { iso_2?: string | null }[] | null;
  metadata?: Record<string, unknown> | null;
};

export function isEgyptEgpRegion(region: PaymentRegion) {
  return (
    region.currency_code.toLowerCase() === "egp" &&
    region.countries?.length === 1 &&
    region.countries[0].iso_2?.toLowerCase() === "eg"
  );
}

export function readPaymentSettings(region: PaymentRegion) {
  return {
    region_id: region.id,
    region_name: region.name,
    instapay_url:
      typeof region.metadata?.instapay_url === "string"
        ? region.metadata.instapay_url
        : "",
    whatsapp_number:
      typeof region.metadata?.instapay_whatsapp_number === "string"
        ? region.metadata.instapay_whatsapp_number
        : "",
  };
}

export function isValidPaymentSettings(region: PaymentRegion) {
  const { instapay_url, whatsapp_number } = readPaymentSettings(region);
  try {
    return (
      new URL(instapay_url).protocol === "https:" &&
      /^\+[1-9]\d{7,14}$/.test(whatsapp_number)
    );
  } catch {
    return false;
  }
}
