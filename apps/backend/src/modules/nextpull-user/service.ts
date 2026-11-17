import { MedusaService } from "@medusajs/framework/utils";
import { NextPullUser } from "./models/nextpull-user";

class NextPullUserModuleService extends MedusaService({
  NextPullUser,
}) {}

export default NextPullUserModuleService;
