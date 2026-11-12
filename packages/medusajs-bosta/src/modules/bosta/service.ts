import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import {
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentItemDTO,
  FulfillmentOrderDTO,
  Logger,
} from "@medusajs/framework/types";
import {
  CalculateShippingOptionPriceDTO,
  FulfillmentDTO,
} from "@medusajs/framework/types";
import BostaClient from "../../bosta/client";
import { FullfillmentType } from "../../bosta/client.types";

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  apiKey: string;
};

class BostaProviderService extends AbstractFulfillmentProviderService {
  static identifier = "bosta-fulfillment";
  protected baseURL = "http://app.bosta.co/api/v2/";
  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected client;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();

    this.logger_ = logger;
    this.options_ = options;

    this.client = new BostaClient(this.options_.apiKey);
  }

  t: FulfillmentDTO["data"] = {};

  async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<
      Omit<FulfillmentDTO, "provider_id" | "data" | "items">
    >,
    additionalData?: Record<string, unknown>,
  ): Promise<CreateFulfillmentResult> {
    // assuming the client creates a fulfillment
    // in the third-party service
    const externalData = await this.client.createFullfillment({
      cod: 0,
      type: FullfillmentType.DELIVERY,
      receiver: data.receiver,
      dropOffAddress: data.dropOffAddress,
      pickupAddress: data.pickupAddress,
      returnAddress: data.returnAddress,
      specs: data.specs,
    } as any);

    return {
      labels: [
        {
          tracking_number: externalData.trackingNumber,
          tracking_url: `https://bosta.co/track/${externalData.trackingNumber}`,
          label_url: `https://bosta.co/track/${externalData.trackingNumber}`,
        },
      ],
      data: externalData,
    } as any;
  }
}

export default BostaProviderService;
