import { defineLink } from "@medusajs/framework/utils";

import CustomerModule from "@medusajs/medusa/customer";
import NEXT_PULL_MODULE from "../modules/nextpull-user";

export default defineLink(
  CustomerModule.linkable.customer,
  NEXT_PULL_MODULE.linkable.nextpullUser,
);
