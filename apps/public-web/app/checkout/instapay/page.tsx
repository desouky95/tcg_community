import { Button, Surface, TextLink } from "@tcg/ui-web";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { userAgent } from "next/server";
import { Suspense } from "react";
import { getInstapayHandoff } from "../../../src/lib/commerce/checkout-actions";
import { PaymentLink } from "./payment-link";

export const metadata: Metadata = {
  title: "Pay with InstaPay | Next Pull",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type PaymentPageProps = {
  searchParams: Promise<{ total?: string | string[] }>;
};

async function PaymentInstructions({ searchParams }: PaymentPageProps) {
  const [payment, { total: expectedTotal }, requestHeaders] = await Promise.all([
    getInstapayHandoff(),
    searchParams,
    headers(),
  ]);
  const changed =
    payment &&
    expectedTotal !== undefined &&
    expectedTotal !== String(payment.total);

  if (!payment || changed) {
    return (
      <>
        <p className="text-sm text-muted-foreground">
          {changed
            ? "Your checkout total changed. If you already transferred, contact us before paying again."
            : "Payment details are unavailable. Return to checkout to try again."}
        </p>
        {changed && (
          <TextLink
            href={`https://wa.me/${payment.whatsapp_number.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            Contact us on WhatsApp
          </TextLink>
        )}
        <Button asChild variant="outline" className="self-center">
          <Link href="/checkout">Return to checkout</Link>
        </Button>
      </>
    );
  }

  const { device } = userAgent({ headers: requestHeaders });
  if (device.type === "mobile" || device.type === "tablet")
    redirect(payment.instapay_url);

  const amount = new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    currencyDisplay: "code",
  }).format(payment.total);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Amount to transfer
        <strong className="mt-1 block font-display text-3xl font-semibold tabular-nums text-foreground">
          {amount}
        </strong>
      </p>
      <PaymentLink url={payment.instapay_url} />
      <p className="border-t border-wax-line pt-4 text-sm text-muted-foreground">
        After transferring, return to your original checkout tab and place your order.
      </p>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Need the InstaPay app?</p>
        <div className="flex flex-wrap justify-center gap-x-5">
          <TextLink
            className="inline-flex min-h-control-sm items-center"
            href="https://apps.apple.com/eg/app/instapay-egypt/id1592108795"
            target="_blank"
            rel="noreferrer"
          >
            App Store
          </TextLink>
          <TextLink
            className="inline-flex min-h-control-sm items-center"
            href="https://play.google.com/store/apps/details?id=com.egyptianbanks.instapay"
            target="_blank"
            rel="noreferrer"
          >
            Google Play
          </TextLink>
        </div>
      </div>
    </>
  );
}

export default function InstapayPage({ searchParams }: PaymentPageProps) {
  return (
    <div className="min-h-dvh bg-wax-paper">
      <header className="bg-(--wax-navy)">
        <div className="mx-auto flex max-w-6xl items-center px-gutter py-3">
          <Image
            src="/brand/next-pull-logo-white.svg"
            alt="Next Pull"
            width={60}
            height={48}
          />
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-6 sm:py-10">
        <Surface className="flex flex-col gap-4 rounded-xl px-5 py-6 text-center sm:px-8">
          <h1 className="text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Pay with InstaPay
          </h1>
          <Suspense fallback={<p role="status">Loading payment details…</p>}>
            <PaymentInstructions searchParams={searchParams} />
          </Suspense>
        </Surface>
      </main>
    </div>
  );
}
