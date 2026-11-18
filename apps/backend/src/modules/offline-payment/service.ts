import type { MedusaContainer } from "@medusajs/framework";
import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils";
import { randomUUID } from "node:crypto";

abstract class OfflinePaymentProvider extends AbstractPaymentProvider {
  constructor(container: MedusaContainer, options: Record<string, unknown>) {
    super(container, options);
  }

  async initiatePayment(
    input: Parameters<AbstractPaymentProvider["initiatePayment"]>[0],
  ) {
    if (input.currency_code !== "egp")
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Offline payments are only available in EGP.",
      );
    return { id: randomUUID(), data: { currency_code: input.currency_code } };
  }

  async authorizePayment(
    input: Parameters<AbstractPaymentProvider["authorizePayment"]>[0],
  ) {
    return {
      data: { ...(input.data ?? {}), status: "authorized" },
      status: "authorized" as const,
    };
  }

  async capturePayment(
    input: Parameters<AbstractPaymentProvider["capturePayment"]>[0],
  ) {
    return { data: { ...(input.data ?? {}), status: "captured" } };
  }

  async cancelPayment(
    input: Parameters<AbstractPaymentProvider["cancelPayment"]>[0],
  ) {
    return { data: input.data ?? {} };
  }

  async deletePayment(
    input: Parameters<AbstractPaymentProvider["deletePayment"]>[0],
  ) {
    return { data: input.data ?? {} };
  }

  async getPaymentStatus(
    input: Parameters<AbstractPaymentProvider["getPaymentStatus"]>[0],
  ) {
    return {
      status: input.data?.status === "captured" ? "captured" as const : "authorized" as const,
    };
  }

  async refundPayment(
    input: Parameters<AbstractPaymentProvider["refundPayment"]>[0],
  ) {
    return { data: input.data ?? {} };
  }

  async retrievePayment(
    input: Parameters<AbstractPaymentProvider["retrievePayment"]>[0],
  ) {
    return { data: input.data ?? {} };
  }

  async updatePayment(
    input: Parameters<AbstractPaymentProvider["updatePayment"]>[0],
  ) {
    if (input.currency_code !== "egp")
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Offline payments are only available in EGP.",
      );
    return { data: input.data ?? {} };
  }

  async getWebhookActionAndData(
    _data: Parameters<AbstractPaymentProvider["getWebhookActionAndData"]>[0],
  ) {
    return { action: "not_supported" as const };
  }
}

export class InstapayPaymentProvider extends OfflinePaymentProvider {
  static identifier = "instapay";
}

export class CashOnDeliveryPaymentProvider extends OfflinePaymentProvider {
  static identifier = "cod";
}
