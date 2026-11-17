import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils";
import { createUserAccountWorkflow } from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const email = "admin@nextpull.com";
  const authService = container.resolve(Modules.AUTH);
  const { authIdentity, error } = await authService.register("emailpass", {
    body: { email, password: "1234" },
  });

  if (error || !authIdentity) {
    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, error || "Failed to register admin identity.");
  }

  await createUserAccountWorkflow(container).run({
    input: { authIdentityId: authIdentity.id, userData: { email } },
  });

  container.resolve(ContainerRegistrationKeys.LOGGER).info("Admin user created.");
}
