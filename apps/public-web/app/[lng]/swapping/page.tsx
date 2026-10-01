
import type { Metadata } from "next";
import { ArrowRight, Check, MapPin, Search, ShieldCheck } from "lucide-react";
import { Kicker, PublicShell, buttonStyles } from "@tcg/ui-web";
import { SwapDemo } from "./SwapDemo";
import "./swapping.css";

export const metadata: Metadata = {
  title: "Swapping | TCG Nexus",
  description:
    "Find the missing card, compare collections, and make clearer swaps with TCG Nexus.",
};

export default function SwappingPage() {
  return (
    <PublicShell currentPath="/swapping">
      <div className="wax-page overflow-hidden">
        <section
          className="mx-auto max-w-[1440px] border-t border-wax-line px-gutter py-12 lg:py-20"
          aria-labelledby="swapping-heading"
        >
          <div className="mb-10 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:text-wax-ink lg:[&_h1]:text-6xl">
            <h1 className="tracking-normal" id="swapping-heading">
              Find the missing piece.
              <span className="text-wax-red">Then make the exchange.</span>
            </h1>
          </div>
          <SwapDemo />
        </section>

        <section
          className="mx-auto max-w-[1440px] px-gutter py-section border-t border-wax-line [&_h2]:max-w-[18ch] [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none md:[&_h2]:text-display"
          aria-labelledby="swapping-guide-heading"
        >
          <div className="max-w-3xl [&>p:last-child]:mt-5 [&>p:last-child]:max-w-xl [&>p:last-child]:leading-relaxed [&>p:last-child]:text-wax-muted">
            <Kicker>A CLEARER WAY TO TRADE</Kicker>
            <h2 id="swapping-guide-heading">
              A swap should feel clear before it feels exciting.
            </h2>
            <p>
              Use your collection as the starting point, then narrow the
              conversation until both sides know what is moving.
            </p>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-2 lg:gap-24">
            <div className="border-t-2 border-wax-ink [&_h3]:mt-4 [&_h3]:mb-6 [&_h3]:font-display [&_h3]:text-3xl">
              <h3>Before you agree</h3>
              <ul className="m-0 grid list-none gap-4 p-0 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:leading-relaxed [&_svg]:mt-1 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-wax-red">
                <li>
                  <Check aria-hidden="true" />
                  Confirm the card name, set, and number.
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Describe condition honestly and clearly.
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Make sure both sides understand the exchange.
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Keep the final details in the conversation.
                </li>
              </ul>
            </div>
            <div className="border-t-2 border-wax-ink [&_h3]:mt-4 [&_h3]:mb-6 [&_h3]:font-display [&_h3]:text-3xl">
              <h3>Ways to look for a match</h3>
              <ul className="m-0 grid list-none gap-4 p-0 [&_li]:flex [&_li]:items-start [&_li]:gap-4 [&_li]:border-b [&_li]:border-wax-line [&_li]:py-3 [&_strong]:block [&_strong]:font-display [&_strong]:text-lg [&_small]:mt-1 [&_small]:block [&_small]:leading-relaxed [&_small]:text-wax-muted [&_svg]:mt-1 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-discovery-500">
                <li>
                  <Search aria-hidden="true" />
                  <span>
                    <strong>Collection matches</strong>
                    <small>
                      Start with what you want and what you can offer.
                    </small>
                  </span>
                </li>
                <li>
                  <MapPin aria-hidden="true" />
                  <span>
                    <strong>Nearby collectors</strong>
                    <small>
                      Use location context to make discovery more relevant.
                    </small>
                  </span>
                </li>
                <li>
                  <ShieldCheck aria-hidden="true" />
                  <span>
                    <strong>Thoughtful exchanges</strong>
                    <small>
                      Review the details before you move from interest to
                      agreement.
                    </small>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-[1440px] px-gutter py-section flex flex-col items-start justify-between gap-8 bg-wax-navy text-wax-paper lg:flex-row lg:items-end [&_h2]:max-w-[18ch] [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:leading-none md:[&_h2]:text-display [&_p:last-child]:mt-5 [&_p:last-child]:max-w-xl [&_p:last-child]:leading-relaxed [&_p:last-child]:text-wax-paper/85"
          aria-labelledby="swapping-cta-heading"
        >
          <div>
            <Kicker className="text-wax-gold">YOUR NEXT GOOD PULL</Kicker>
            <h2 id="swapping-cta-heading">
              Might be in someone else&apos;s binder.
            </h2>
            <p>
              Sign in to search for matches, or create your collector profile
              and start building your exchange context.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-wrap gap-3 sm:w-auto [&_svg]:size-4">
            <a className={buttonStyles({ className: "border-wax-paper bg-wax-paper text-primary-600 hover:border-wax-gold hover:bg-wax-gold" })} href="/signup">
              Join the club <ArrowRight aria-hidden="true" />
            </a>
            <a className={buttonStyles({ variant: "outline", className: "border-wax-paper text-wax-paper hover:bg-wax-paper hover:text-wax-ink" })} href="/login">
              Sign in to swap
            </a>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
