import { z } from "@medusajs/framework/zod";

const httpsUrl = z.union([
  z.string().trim().max(2048).refine((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid HTTPS URL."),
  z.literal(""),
]);

const whatsappNumber = z.union([
  z.string().regex(/^\+[1-9]\d{7,14}$/, "Enter a phone number in international format."),
  z.literal(""),
]);

export const UpdatePaymentSettingsSchema = z
  .strictObject({
    region_id: z.string().trim().min(1).max(255),
    instapay_url: httpsUrl,
    whatsapp_number: whatsappNumber,
  })
  .superRefine(({ instapay_url, whatsapp_number }, context) => {
    if (Boolean(instapay_url) !== Boolean(whatsapp_number)) {
      context.addIssue({
        code: "custom",
        message: "Set both payment fields, or leave both empty.",
      });
    }
  });

export type UpdatePaymentSettings = z.infer<typeof UpdatePaymentSettingsSchema>;

export const GetPaymentInstructionsSchema = z.strictObject({
  region_id: z.string().trim().min(1).max(255),
});
