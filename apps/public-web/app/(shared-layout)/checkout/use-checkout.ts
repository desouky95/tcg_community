"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { HttpTypes } from "@medusajs/types";
import { useForm, useWatch } from "react-hook-form";
import { api } from "../../../src/lib/clients/adonis";
import { checkoutReview } from "../../../src/lib/commerce/checkout-review";
import {
  checkoutCart,
  saveContact,
  saveAddress,
  selectShipping,
  selectPayment,
  placeOrder,
  type CheckoutAddress,
} from "../../../src/lib/commerce/checkout-actions";

export const steps = ["Contact", "Delivery", "Payment", "Review"] as const;
const blank: CheckoutAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "",
  phone: "",
};
export const fields: {
  key: keyof CheckoutAddress;
  label: string;
  required?: boolean;
  autoComplete?: string;
}[] = [
  {
    key: "first_name",
    label: "First name",
    required: true,
    autoComplete: "given-name",
  },
  {
    key: "last_name",
    label: "Last name",
    required: true,
    autoComplete: "family-name",
  },
  {
    key: "address_1",
    label: "Address line 1",
    required: true,
    autoComplete: "address-line1",
  },
  { key: "address_2", label: "Address line 2", autoComplete: "address-line2" },
  {
    key: "city",
    label: "City",
    required: true,
    autoComplete: "address-level2",
  },
  {
    key: "province",
    label: "Governorate / region",
    autoComplete: "address-level1",
  },
  { key: "postal_code", label: "Postal code", autoComplete: "postal-code" },
  {
    key: "country_code",
    label: "Country code (e.g. EG)",
    required: true,
    autoComplete: "country",
  },
  { key: "phone", label: "Phone", autoComplete: "tel" },
];
export function money(value: number | null | undefined, currency: string) {
  return value == null
    ? "—"
    : new Intl.NumberFormat("en", { style: "currency", currency }).format(
        value,
      );
}
type SavedAddress = CheckoutAddress & { id: string };
type CheckoutForm = {
  email: string;
  address: CheckoutAddress;
  shippingId: string;
  providerId: string;
};

async function syncCheckoutCustomer() {
  const response = await fetch("/api/commerce/customer", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("Customer link unavailable");
  const result = (await response.json()) as {
    data?: { authenticated?: boolean; available?: boolean; linked?: boolean };
  };
  if (
    result.data?.authenticated !== false &&
    (!result.data?.available || !result.data.linked)
  )
    throw new Error("Customer link unavailable");
}

export function useCheckout() {
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const [load, setLoad] = useState<
    "loading" | "ready" | "empty" | "error" | "completed"
  >("loading");
  const [step, setStep] = useState(0);
  const {
    register,
    control,
    trigger,
    getValues,
    getFieldState,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      email: "",
      address: blank,
      shippingId: "",
      providerId: "",
    },
    shouldUnregister: false,
  });
  const email = useWatch({ control, name: "email" });
  const address = useWatch({ control, name: "address" });
  const providerId = useWatch({ control, name: "providerId" });
  const accountEmail = useRef("");
  const cartReady = useRef(false);
  const confirmedShipping = useRef("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [shipping, setShipping] = useState<HttpTypes.StoreCartShippingOption[]>(
    [],
  );
  const [providers, setProviders] = useState<HttpTypes.StorePaymentProvider[]>(
    [],
  );
  const [instapay, setInstapay] = useState<{
    instapay_url: string;
    whatsapp_number: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [order, setOrder] = useState<number | string | null>(null);
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const initialized = useRef(false);

  const loadCart = useCallback(async () => {
    setLoad("loading");
    const result = await checkoutCart();
    if (result.kind === "ready") {
      setCart(result.cart);
      cartReady.current = true;
      if (!getFieldState("email").isDirty)
        setValue("email", result.cart.email || accountEmail.current || "");
      if (result.cart.shipping_address) {
        for (const key of Object.keys(blank) as (keyof CheckoutAddress)[]) {
          if (!getFieldState(`address.${key}`).isDirty)
            setValue(`address.${key}`, result.cart.shipping_address[key] ?? "");
        }
      }
      setLoad("ready");
    } else setLoad(result.kind === "error" ? "error" : result.kind);
  }, [getFieldState, setValue]);
  useEffect(() => {
    void loadCart();
  }, [loadCart]);
  useEffect(() => {
    // Account data is optional; checkout remains usable for guests or if the account service is unavailable.
    void Promise.allSettled([
      api.getProfile({ withParams: false }),
      api.http.get<{ addresses: SavedAddress[] }>(
        "/account/commerce/addresses",
      ),
    ]).then(([profile, addresses]) => {
      if (profile.status === "fulfilled") {
        const user = profile.value.data?.data;
        accountEmail.current = user?.email ?? "";
        if (
          cartReady.current &&
          accountEmail.current &&
          !getValues("email") &&
          !getFieldState("email").isDirty
        )
          setValue("email", accountEmail.current);
      }
      if (addresses.status === "fulfilled")
        setSavedAddresses(addresses.value.data.addresses ?? []);
    });
  }, [getFieldState, getValues, setValue]);
  useEffect(() => {
    if (initialized.current) heading.current?.focus();
    else initialized.current = true;
  }, [step, order]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || uncertain) return;
    locked.current = true;
    const names =
      step === 0
        ? ["email" as const]
        : step === 1
          ? shipping.length
            ? ["shippingId" as const]
            : fields.map(({ key }) => `address.${key}` as const)
          : step === 2
            ? ["providerId" as const]
            : [];
    if (names.length && !(await trigger(names, { shouldFocus: true }))) {
      locked.current = false;
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (step === 0) {
        try {
          await syncCheckoutCustomer();
          const result = await saveContact(getValues("email"));
          if (result.kind === "error") setError(result.message);
          else {
            setCart(result.cart);
            setStep(1);
          }
        } catch {
          setError(
            "We couldn’t connect your account to this order. Please try again.",
          );
        }
      } else if (step === 1 && !shipping.length) {
        const result = await saveAddress(getValues("address"));
        if (result.kind === "error") setError(result.message);
        else {
          setCart(result.cart);
          setShipping(result.options);
          setValue("shippingId", "");
          if (!result.options.length)
            setError(
              "No delivery methods are available for this address. Check the address or contact support.",
            );
        }
      } else if (step === 1) {
        const result = await selectShipping(getValues("shippingId"));
        if (result.kind === "error") setError(result.message);
        else {
          setCart(result.cart);
          setProviders(result.providers);
          setInstapay(result.instapay);
          if (confirmedShipping.current !== getValues("shippingId"))
            setValue("providerId", "");
          confirmedShipping.current = getValues("shippingId");
          setStep(2);
        }
      } else if (step === 2) {
        const result = await selectPayment(getValues("providerId"));
        if (result.kind === "error") setError(result.message);
        else {
          setCart(result.cart);
          setInstapay(result.instapay);
          setStep(3);
        }
      } else if (cart?.total != null && cart.currency_code) {
        try {
          await syncCheckoutCustomer();
        } catch {
          setError(
            "We couldn’t connect your account to this order. Please try again.",
          );
          return;
        }
        const result = await placeOrder(
          cart.total,
          cart.currency_code,
          checkoutReview(cart),
        );
        if (result.kind === "order") setOrder(result.displayId ?? "confirmed");
        else if (result.kind === "changed") {
          setCart(result.cart);
          setShipping([]);
          setValue("shippingId", "");
          setValue("providerId", "");
          setProviders([]);
          confirmedShipping.current = "";
          setStep(0);
          setError(
            "Your cart changed. Review the updated order before placing it.",
          );
        } else {
          setError(result.message);
          if (result.kind === "uncertain") setUncertain(true);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return {
    cart,
    load,
    step,
    register,
    errors,
    email,
    address,
    savedAddresses,
    shipping,
    providers,
    providerId,
    instapay,
    error,
    busy,
    uncertain,
    order,
    heading,
    setValue,
    clearErrors,
    setShipping,
    setProviders,
    setInstapay,
    confirmedShipping,
    setError,
    setStep,
    loadCart,
    submit,
  };
}
