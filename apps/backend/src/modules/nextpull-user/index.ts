import NextPullUserModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const NEXT_PULL_MODULE = "nextpull";

export default Module(NEXT_PULL_MODULE, {
  service: NextPullUserModuleService,
});
