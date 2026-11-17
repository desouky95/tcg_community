import { fields, money, type useCheckout } from "./use-checkout";

export function checkoutBindings(state: ReturnType<typeof useCheckout>) {
  const {
    register,
    errors,
    busy,
    shipping,
    providers,
    setShipping,
    setValue,
    setProviders,
    confirmedShipping,
    clearErrors,
    savedAddresses,
    cart,
  } = state;
  const invalidateDelivery = () => {
    setShipping([]);
    setValue("shippingId", "");
    setValue("providerId", "");
    setProviders([]);
    confirmedShipping.current = "";
    clearErrors(["shippingId", "providerId"]);
  };
  const addressFields = fields.map(
    ({ key, label, required, autoComplete }) => ({
      name: key,
      label: `${label}${!required ? " (optional)" : ""}`,
      wide: key === "address_1" || key === "address_2",
      error: errors.address?.[key]?.message,
      input: {
        autoComplete,
        disabled: busy,
        ...register(`address.${key}`, {
          validate: (value: string) =>
            required && !value.trim()
              ? `Enter ${label.toLowerCase()}.`
              : key === "country_code" && !/^[a-z]{2}$/i.test(value.trim())
                ? "Enter a two-letter country code."
                : true,
          onChange: invalidateDelivery,
        }),
      },
    }),
  );
  const shippingOptions = shipping.map((option) => ({
    id: option.id,
    label: option.name,
    detail: money(option.amount, cart?.currency_code ?? "egp"),
    input: {
      value: option.id,
      disabled: busy,
      ...register("shippingId", { required: "Choose a delivery method." }),
    },
  }));
  const paymentOptions = providers.map((provider) => ({
    id: provider.id,
    label: "Manual payment",
    detail: "No online payment is collected at checkout.",
    input: {
      value: provider.id,
      disabled: busy,
      ...register("providerId", { required: "Choose a payment method." }),
    },
  }));
  const selectAddress = (id: string) => {
    const found = savedAddresses.find((item) => item.id === id);
    if (!found) return;
    for (const { key } of fields)
      setValue(`address.${key}`, found[key] ?? "", { shouldDirty: true });
    clearErrors("address");
    invalidateDelivery();
  };
  return { addressFields, shippingOptions, paymentOptions, selectAddress };
}
