import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { timingSafeEqual } from "node:crypto";
import { NEXT_PULL_MODULE } from "../../../../modules/nextpull-user";
import { CustomerDTO } from "@medusajs/framework/types";
import NextPullUserModuleService from "../../../../modules/nextpull-user/service";

type CustomerInput = {
  external_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

function hasValidServiceKey(value: string | undefined) {
  const expected = process.env.NEXT_PULL_SERVICE_KEY;
  if (!expected || !value) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(value);
  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

/** Private, idempotent bridge used only by the Adonis identity service. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  console.log("CUSTOMER LINK API ROUTE");
  if (
    !hasValidServiceKey(
      req.headers["x-next-pull-service-key"] as string | undefined,
    )
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const input = req.body as CustomerInput;

  if (!input.external_id)
    return res.status(400).json({ message: "external_id is required" });

  const customerService = req.scope.resolve(Modules.CUSTOMER);
  // const nextpullService: NextPullUserModuleService =
  //   req.scope.resolve(NEXT_PULL_MODULE);

  // const [externalUser] = await nextpullService.listNextPullUsers({
  //   next_pull_user_id: input.external_id,
  // });
  const [existing] = await customerService.listCustomers({
    metadata: {
      next_pull_user_id: input.external_id,
    },
  } as any);

  const metadata = {
    next_pull_user_id: input.external_id,
  };
  const getCustomer = async (customer?: CustomerDTO) => {
    if (!customer) {
      // await nextpullService.createNextPullUsers({
      //   next_pull_user_id: input.external_id,
      // });

      return await customerService.createCustomers({
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        metadata,
        has_account: true,
      });
    }
    // await nextpullService.updateNextPullUsers({
    //   next_pull_user_id: input.external_id,
    // });
    return await customerService.updateCustomers(existing.id, {
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      metadata,
    });
  };

  try {
    const customer = await getCustomer(existing);
    console.warn("DEBUG", "CUSTOMER", customer);
    return res
      .status(existing ? 200 : 201)
      .json({ customer: { id: customer.id } });
  } catch (err) {
    throw err;
  }
}
