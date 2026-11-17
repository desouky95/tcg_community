"use client";

import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { Button, Field, Input, Surface, TextLink } from "../../primitives";

type InputProps = Omit<ComponentPropsWithRef<"input">, "size">;
export type CheckoutField = {
  name: string;
  label: string;
  input: InputProps;
  error?: string;
  wide?: boolean;
};
export type CheckoutOption = {
  id: string;
  label: string;
  detail?: ReactNode;
  input: InputProps;
};
export type CheckoutLine = {
  id: string;
  title: string;
  variant?: string | null;
  quantity: number;
  thumbnail?: string | null;
  total: string;
};

export function CheckoutProgress({
  steps,
  current,
}: {
  steps: readonly string[];
  current: number;
}) {
  return (
    <ol
      aria-label="Checkout progress"
      className="mt-8 grid grid-cols-4 gap-2 border-b border-wax-line pb-5"
    >
      {steps.map((label, index) => (
        <li
          key={label}
          aria-current={index === current ? "step" : undefined}
          className={`text-xs font-semibold sm:text-sm ${index === current ? "text-accent-500" : "text-wax-muted"}`}
        >
          <span className="me-1">{index + 1}.</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
export function CheckoutContact({
  input,
  error,
}: {
  input: InputProps;
  error?: string;
}) {
  return (
    <div className="mt-6 max-w-xl">
      <p className="mb-5 text-wax-muted">
        Where should we send your order information?
      </p>
      <Field label="Email address" htmlFor="checkout-email" error={error}>
        <Input
          id="checkout-email"
          type="email"
          autoComplete="email"
          {...input}
        />
      </Field>
    </div>
  );
}
export function CheckoutChoices({
  legend,
  options,
  error,
  empty,
}: {
  legend: string;
  options: CheckoutOption[];
  error?: string;
  empty?: string;
}) {
  const errorId = `${options[0]?.id ?? "checkout-choice"}-error`;
  return (
    <fieldset className="mt-8">
      <legend className="font-display text-lg font-semibold">{legend}</legend>
      <div className="mt-3 space-y-2">
        {options.map(({ id, label, detail, input }) => (
          <label
            key={id}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-wax-line p-4"
          >
            <input
              type="radio"
              {...input}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
            <span className="flex-1 font-semibold">{label}</span>
            {detail}
          </label>
        ))}
        {!options.length && empty && <p role="status">{empty}</p>}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
export function CheckoutDelivery({
  fields,
  addresses,
  onAddress,
  disabled,
  children,
}: {
  fields: CheckoutField[];
  addresses: { id: string; label: string }[];
  onAddress: (id: string) => void;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="mb-5 text-wax-muted">Tell us where to send your order.</p>
      {addresses.length > 0 && (
        <div className="mb-6">
          <label
            htmlFor="saved-address"
            className="mb-2 block text-sm font-semibold"
          >
            Use a saved address
          </label>
          <select
            id="saved-address"
            defaultValue=""
            disabled={disabled}
            className="min-h-12 w-full rounded-md border border-wax-line bg-card px-3"
            onChange={(event) => onAddress(event.target.value)}
          >
            <option value="">Enter a new address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, input, error, wide }) => (
          <Field
            key={name}
            htmlFor={name}
            label={label}
            error={error}
            className={wide ? "sm:col-span-2" : ""}
          >
            <Input id={name} {...input} />
          </Field>
        ))}
      </div>
      {children}
    </div>
  );
}
export function CheckoutReview({
  email,
  address,
}: {
  email: string;
  address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    postal_code: string;
    country_code: string;
  };
}) {
  return (
    <div className="mt-6 space-y-5">
      <div>
        <h3 className="font-semibold">Contact</h3>
        <p>{email}</p>
      </div>
      <div>
        <h3 className="font-semibold">Delivery address</h3>
        <p>
          {address.first_name} {address.last_name}
          <br />
          {address.address_1}
          {address.address_2 && <>, {address.address_2}</>}
          <br />
          {address.city}, {address.province} {address.postal_code}
          <br />
          {address.country_code.toUpperCase()}
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Payment</h3>
        <p>Manual payment</p>
      </div>
      <p className="text-sm text-wax-muted">
        Review your items and final charges before placing your order.
      </p>
    </div>
  );
}
export function CheckoutActions({
  step,
  steps,
  busy,
  disabled,
  backDisabled,
  onBack,
  shopLink,
  submitLabel,
}: {
  step: number;
  steps: readonly string[];
  busy: boolean;
  disabled: boolean;
  backDisabled: boolean;
  onBack: () => void;
  shopLink: ReactNode;
  submitLabel: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-wax-line pt-6">
      {step > 0 ? (
        <Button
          type="button"
          variant="ghost"
          disabled={busy || backDisabled}
          onClick={onBack}
        >
          Back to {steps[step - 1]}
        </Button>
      ) : (
        <TextLink asChild>{shopLink}</TextLink>
      )}
      <Button type="submit" loading={busy} disabled={disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}
export function CheckoutHeading({
  title,
  headingRef,
}: {
  title: string;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <h2
      ref={headingRef}
      tabIndex={-1}
      className="font-display text-2xl font-semibold"
    >
      {title}
    </h2>
  );
}
export function CheckoutStatus({
  title,
  message,
  children,
  headingRef,
  alert,
}: {
  title: string;
  message: string;
  children: ReactNode;
  headingRef?: Ref<HTMLHeadingElement>;
  alert?: boolean;
}) {
  return (
    <main className="mx-auto max-w-6xl px-gutter py-16">
      <h1
        ref={headingRef}
        tabIndex={headingRef ? -1 : undefined}
        className="font-display text-3xl font-semibold"
      >
        {title}
      </h1>
      <p className="mt-5" role={alert ? "alert" : undefined}>
        {message}
      </p>
      <div className="mt-5">{children}</div>
    </main>
  );
}
function SummaryContents({
  lines,
  subtotal,
  delivery,
  tax,
  discount,
  total,
}: {
  lines: CheckoutLine[];
  subtotal: string;
  delivery: string;
  tax: string;
  discount?: string;
  total: string;
}) {
  return (
    <div className="mt-5">
      <ul className="space-y-4">
        {lines.map((item) => (
          <li key={item.id} className="flex gap-3">
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt=""
                className="size-16 shrink-0 rounded-md bg-paper-200 object-contain"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.title}</p>
              {item.variant && (
                <p className="text-sm text-wax-muted">{item.variant}</p>
              )}
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold">{item.total}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-2 border-t border-wax-line pt-5 text-sm">
        {[
          ["Subtotal", subtotal],
          ["Delivery", delivery],
          ["Tax", tax],
          ...(discount ? [["Discount", discount]] : []),
        ].map(([name, value]) => (
          <div key={name} className="flex justify-between">
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-wax-line pt-4 text-base font-bold">
          <dt>Total</dt>
          <dd>{total}</dd>
        </div>
      </dl>
    </div>
  );
}
export function CheckoutSummary(props: Parameters<typeof SummaryContents>[0]) {
  return (
    <aside>
      <details className="rounded-xl border border-wax-line p-5 lg:hidden">
        <summary className="cursor-pointer font-display text-lg font-semibold">
          Order summary · {props.total}
        </summary>
        <SummaryContents {...props} />
      </details>
      <Surface className="hidden rounded-xl p-6 lg:block">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>
        <SummaryContents {...props} />
      </Surface>
    </aside>
  );
}
