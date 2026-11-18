"use client";

import Link from "next/link";
import {
  Button,
  TextLink,
  CheckoutActions,
  CheckoutChoices,
  CheckoutContact,
  CheckoutDelivery,
  CheckoutHeading,
  CheckoutProgress,
  CheckoutReview,
  CheckoutStatus,
  CheckoutSummary,
} from "@tcg/ui-web";
import { money, steps, useCheckout } from "./use-checkout";
import { checkoutBindings } from "./checkout-bindings";

export function Checkout() {
  const state = useCheckout();
  const { addressFields, shippingOptions, paymentOptions, selectAddress } =
    checkoutBindings(state);
  const {
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
    setError,
    setStep,
    loadCart,
    submit,
  } = state;
  const shopLink = <Link href="/shop">Continue shopping</Link>;
  const currency = cart?.currency_code ?? "egp";
  if (load === "loading")
    return (
      <main className="mx-auto max-w-6xl px-gutter py-16">
        <p role="status">Loading checkout…</p>
      </main>
    );
  if (load !== "ready")
    return (
      <CheckoutStatus
        title="Checkout"
        alert={load === "error"}
        message={
          load === "error"
            ? "Your cart is temporarily unavailable."
            : load === "completed"
              ? "This cart has already been completed. Check your orders before starting a new cart."
              : "Your cart is empty."
        }
      >
        {load === "error" ? (
          <Button onClick={() => void loadCart()}>Try again</Button>
        ) : (
          <TextLink asChild>
            <Link href="/shop">Return to shop</Link>
          </TextLink>
        )}
      </CheckoutStatus>
    );
  if (order !== null)
    return (
      <CheckoutStatus
        title="Thank you for your order"
        headingRef={heading}
        message={`Your order ${order !== "confirmed" ? `#${order} ` : ""}has been placed.`}
      >
        {providerId === "pp_instapay_offline" && instapay && (
          <p className="text-sm">
            After transferring, send your screenshot with order reference {order} on{" "}
            <a
              className="font-semibold underline"
              href={`https://wa.me/${instapay.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(`Payment proof for order ${order}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            .
          </p>
        )}
        {providerId === "pp_cod_offline" && (
          <p className="text-sm">Pay the courier in cash when your order arrives.</p>
        )}
        <TextLink asChild>{shopLink}</TextLink>
      </CheckoutStatus>
    );
  return (
    <main className="mx-auto w-full max-w-7xl px-gutter py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold text-primary-500 sm:text-4xl">
        Checkout
      </h1>
      <CheckoutProgress steps={steps} current={step} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-16">
        <form
          noValidate
          onSubmit={(event) => void submit(event)}
          className="min-w-0"
        >
          <CheckoutHeading
            headingRef={heading}
            title={
              ["Contact details", "Delivery", "Payment", "Review your order"][
                step
              ]
            }
          />
          {step === 0 && (
            <CheckoutContact
              error={errors.email?.message}
              input={{
                disabled: busy,
                ...register("email", {
                  required: "Enter your email address.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                }),
              }}
            />
          )}
          {step === 1 && (
            <CheckoutDelivery
              fields={addressFields}
              disabled={busy}
              addresses={savedAddresses.map((item) => ({
                id: item.id,
                label: `${item.address_1}, ${item.city}`,
              }))}
              onAddress={selectAddress}
            >
              {shipping.length > 0 && (
                <CheckoutChoices
                  legend="Delivery method"
                  options={shippingOptions}
                  error={errors.shippingId?.message}
                />
              )}
            </CheckoutDelivery>
          )}
          {step === 2 && (
            <>
              <CheckoutChoices
                legend="Choose an available payment method."
                options={paymentOptions}
                error={errors.providerId?.message}
                empty="No supported payment methods are currently available. Please try again later or contact support."
              />
              {providerId === "pp_instapay_offline" && instapay && (
                <div className="mt-5 rounded-md border border-wax-line p-4" role="status">
                  <p>Transfer {money(cart?.total, currency)} using InstaPay:</p>
                  <a className="break-all font-semibold underline" href={instapay.instapay_url} target="_blank" rel="noreferrer">
                    Open InstaPay payment link
                  </a>
                  <p className="mt-2">After placing your order, send a screenshot of the transfer by WhatsApp.</p>
                </div>
              )}
              {providerId === "pp_cod_offline" && (
                <p className="mt-5 rounded-md border border-wax-line p-4" role="status">
                  Pay the courier in cash when your order arrives.
                </p>
              )}
            </>
          )}
          {step === 3 && <CheckoutReview email={email} address={address} />}
          {error && (
            <p
              role="alert"
              className="mt-6 text-sm font-semibold text-danger-600"
            >
              {error}
            </p>
          )}
          <CheckoutActions
            step={step}
            steps={steps}
            busy={busy}
            backDisabled={uncertain}
            disabled={
              uncertain ||
              (step === 2 && !providers.length) ||
              (step === 3 && cart?.total == null)
            }
            onBack={() => {
              setError("");
              setStep(step - 1);
            }}
            shopLink={shopLink}
            submitLabel={
              step === 0
                ? "Continue to delivery"
                : step === 1
                  ? shipping.length
                    ? "Continue to payment"
                    : "Find delivery methods"
                  : step === 2
                    ? "Review order"
                    : "Place order"
            }
          />
        </form>
        <CheckoutSummary
          lines={(cart?.items ?? []).map((item) => ({
            id: item.id,
            title: item.product_title || item.title,
            variant: item.variant_title,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
            total: money(item.total, currency),
          }))}
          subtotal={money(cart?.subtotal, currency)}
          delivery={
            cart?.shipping_methods?.length
              ? money(cart.shipping_total, currency)
              : "Calculated at delivery"
          }
          tax={money(cart?.tax_total, currency)}
          discount={
            cart?.discount_total
              ? `−${money(cart.discount_total, currency)}`
              : undefined
          }
          total={money(cart?.total, currency)}
        />
      </div>
    </main>
  );
}
