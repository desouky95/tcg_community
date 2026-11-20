import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { z } from "@medusajs/framework/zod";
import { transferCartCustomerWorkflowId } from "@medusajs/medusa/core-flows";
import { timingSafeEqual } from "node:crypto";

const inputSchema = z
  .object({
    external_id: z.string().trim().min(1).max(255),
    email: z.string().trim().email().max(254).optional(),
    first_name: z.string().trim().max(255).optional(),
    last_name: z.string().trim().max(255).optional(),
    cart_id: z.string().trim().min(1).max(255).optional(),
  })
  .strict();

function hasValidServiceKey(value: string | undefined) {
  const expected = process.env.BACKEND_NEXT_PULL_SERVICE_KEY;
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
  if (
    !hasValidServiceKey(
      req.headers["x-next-pull-service-key"] as string | undefined,
    )
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = inputSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid request" });
  const input = parsed.data;

  const customerService = req.scope.resolve(Modules.CUSTOMER);
  const [existing] = await customerService.listCustomers({
    metadata: {
      next_pull_user_id: input.external_id,
    },
  } as any);

  const metadata = {
    next_pull_user_id: input.external_id,
  };
  const customer = existing
    ? await customerService.updateCustomers(existing.id, {
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        metadata,
      })
    : await customerService.createCustomers({
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        metadata,
        has_account: true,
      });

  if (input.cart_id) {
    const workflowEngine = req.scope.resolve(Modules.WORKFLOW_ENGINE);
    await workflowEngine.run(transferCartCustomerWorkflowId, {
      input: { id: input.cart_id, customer_id: customer.id },
    });
  }

  return res
    .status(existing ? 200 : 201)
    .json({ customer: { id: customer.id } });
}
