import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import {
  CashOnDeliveryPaymentProvider,
  InstapayPaymentProvider,
} from "./service";

export default ModuleProvider(Modules.PAYMENT, {
  services: [InstapayPaymentProvider, CashOnDeliveryPaymentProvider],
});
