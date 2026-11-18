import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  toast,
} from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { sdk } from "../../lib/client";

type RegionSettings = {
  region_id: string;
  region_name: string;
  instapay_url: string;
  whatsapp_number: string;
};

const PaymentSettingsPage = () => {
  const client = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, RegionSettings>>({});
  const { data, isLoading, error } = useQuery({
    queryKey: ["offline-payment-settings"],
    queryFn: () => sdk.client.fetch<{ regions: RegionSettings[] }>("/admin/payment-settings"),
  });
  useEffect(() => {
    if (data) setDrafts(Object.fromEntries(data.regions.map((region) => [region.region_id, region])));
  }, [data]);
  const save = useMutation({
    mutationFn: (settings: RegionSettings) =>
      sdk.client.fetch("/admin/payment-settings", {
        method: "POST",
        body: {
          region_id: settings.region_id,
          instapay_url: settings.instapay_url,
          whatsapp_number: settings.whatsapp_number,
        },
      }),
    onSuccess: async () => {
      toast.success("Payment settings saved");
      await client.invalidateQueries({ queryKey: ["offline-payment-settings"] });
    },
    onError: (cause) => toast.error(cause.message),
  });

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">Payment settings</Heading>
        <Text className="mt-2 text-ui-fg-subtle">
          Configure InstaPay details for Egypt / EGP checkout. InstaPay stays hidden until both fields are valid. Enable pp_instapay_offline and pp_cod_offline only in the Egypt / EGP region’s payment providers.
        </Text>
      </div>
      {isLoading ? (
        <Text className="px-6 py-4">Loading payment settings…</Text>
      ) : error ? (
        <Text role="alert" className="px-6 py-4 text-ui-fg-error">{error.message}</Text>
      ) : data?.regions.length ? (
        data.regions.map((region) => {
          const draft = drafts[region.region_id] ?? region;
          return (
            <section key={region.region_id} className="grid gap-4 px-6 py-5">
              <Heading level="h2">{region.region_name}</Heading>
              <label className="grid gap-1" htmlFor={`instapay-url-${region.region_id}`}>
                <Text>InstaPay payment link</Text>
                <Input
                  id={`instapay-url-${region.region_id}`}
                  type="url"
                  placeholder="https://…"
                  value={draft.instapay_url}
                  onChange={(event) => setDrafts((current) => ({ ...current, [region.region_id]: { ...draft, instapay_url: event.target.value } }))}
                />
              </label>
              <label className="grid gap-1" htmlFor={`whatsapp-${region.region_id}`}>
                <Text>WhatsApp number (international format)</Text>
                <Input
                  id={`whatsapp-${region.region_id}`}
                  type="tel"
                  placeholder="+201234567890"
                  value={draft.whatsapp_number}
                  onChange={(event) => setDrafts((current) => ({ ...current, [region.region_id]: { ...draft, whatsapp_number: event.target.value } }))}
                />
              </label>
              <div>
                <Button
                  disabled={save.isPending || Boolean(draft.instapay_url) !== Boolean(draft.whatsapp_number)}
                  onClick={() => save.mutate(draft)}
                >
                  Save settings
                </Button>
              </div>
            </section>
          );
        })
      ) : (
        <Text className="px-6 py-4">No region configured for Egypt / EGP.</Text>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({ label: "Payment settings" });
export const handle = { seo: () => ({ title: "Payment settings" }) };
export default PaymentSettingsPage;
