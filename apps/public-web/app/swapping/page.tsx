import type { Metadata } from "next";
import { ArrowRight, Check, MapPin, Search, ShieldCheck } from "lucide-react";
import { PublicShell } from "@tcg/ui-web";
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
      <div className="wax-page wax-swap-page">
        <section
          className="wax-swap-explainer"
          aria-labelledby="swapping-heading"
        >
          <div className="wax-swap-explainer-copy">
            <h1 className="font-bold text-2xl" id="swapping-heading">
              Find the missing piece.
              <span className="text-[var(--wax-red)]">Then make the exchange.</span>
            </h1>
          </div>
          <SwapDemo />
        </section>

        <section
          className="wax-swap-guide"
          aria-labelledby="swapping-guide-heading"
        >
          <div className="wax-swap-guide-intro">
            <p className="wax-kicker">A CLEARER WAY TO TRADE</p>
            <h2 id="swapping-guide-heading">
              A swap should feel clear before it feels exciting.
            </h2>
            <p>
              Use your collection as the starting point, then narrow the
              conversation until both sides know what is moving.
            </p>
          </div>
          <div className="wax-swap-guide-layout">
            <div className="wax-swap-guide-block">
              <h3>Before you agree</h3>
              <ul className="wax-swap-rule-list">
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
            <div className="wax-swap-guide-block">
              <h3>Ways to look for a match</h3>
              <ul className="wax-swap-option-list">
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
          className="wax-swap-cta"
          aria-labelledby="swapping-cta-heading"
        >
          <div>
            <p className="wax-kicker">YOUR NEXT GOOD PULL</p>
            <h2 id="swapping-cta-heading">
              Might be in someone else&apos;s binder.
            </h2>
            <p>
              Sign in to search for matches, or create your collector profile
              and start building your exchange context.
            </p>
          </div>
          <div className="wax-swap-cta-actions">
            <a className="wax-button wax-button-primary" href="/signup">
              Join the club <ArrowRight aria-hidden="true" />
            </a>
            <a className="wax-button wax-button-secondary" href="/login">
              Sign in to swap
            </a>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
