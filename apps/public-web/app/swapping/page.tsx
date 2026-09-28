import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PublicShell } from "@tcg/ui-web";

export const metadata: Metadata = {
  title: "Swapping | TCG Nexus",
  description:
    "Find the missing card, compare collections, and make clearer swaps with TCG Nexus.",
};

export default function SwappingPage() {
  return (
    <PublicShell currentPath="/swapping">
      <div className="wax-page wax-swap-page">
        <section className="wax-swap-explainer" aria-labelledby="swapping-heading">
          <div className="wax-swap-explainer-copy">
            <p className="wax-kicker">THE COLLECTOR EXCHANGE</p>
            <h1 id="swapping-heading">
              Find the missing piece.
              <em>Then make the exchange.</em>
            </h1>
            <p className="wax-swap-lede">
              A good swap starts with context. Bring your collection, spot the match,
              and agree on the details before anything changes hands.
            </p>
          </div>

          <div className="wax-swap-animation" aria-label="How swapping works">
            <svg
              className="wax-swap-svg"
              viewBox="0 0 760 380"
              role="img"
              aria-labelledby="swap-svg-title swap-svg-description"
            >
              <title id="swap-svg-title">A card swap between two collectors</title>
              <desc id="swap-svg-description">
                A wanted card moves from one collector toward another while an offered
                card travels back along the exchange route.
              </desc>
              <defs>
                <marker id="swap-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                  <path d="M0 0L10 5L0 10Z" fill="currentColor" />
                </marker>
              </defs>
              <path className="wax-swap-route" d="M170 190C245 72 515 72 590 190" />
              <path className="wax-swap-route wax-swap-route-return" d="M590 230C515 345 245 345 170 230" />
              <path className="wax-swap-motion" d="M170 190C245 72 515 72 590 190" markerEnd="url(#swap-arrow)" />
              <path className="wax-swap-motion wax-swap-motion-return" d="M590 230C515 345 245 345 170 230" markerEnd="url(#swap-arrow)" />

              <g className="wax-swap-person wax-swap-person-you">
                <circle cx="130" cy="184" r="42" />
                <path d="M80 292c8-47 29-71 50-71s42 24 50 71" />
                <text x="130" y="316" textAnchor="middle">YOU</text>
              </g>
              <g className="wax-swap-person wax-swap-person-them">
                <circle cx="630" cy="184" r="42" />
                <path d="M580 292c8-47 29-71 50-71s42 24 50 71" />
                <text x="630" y="316" textAnchor="middle">COLLECTOR</text>
              </g>

              <g className="wax-swap-card wax-swap-card-wanted">
                <rect x="80" y="46" width="100" height="132" rx="2" />
                <rect x="94" y="60" width="72" height="66" />
                <path d="M106 109h48M106 117h32" />
                <text x="130" y="151" textAnchor="middle">WANTED</text>
              </g>
              <g className="wax-swap-card wax-swap-card-offered">
                <rect x="580" y="46" width="100" height="132" rx="2" />
                <rect x="594" y="60" width="72" height="66" />
                <path d="M606 109h48M606 117h32" />
                <text x="630" y="151" textAnchor="middle">OFFER</text>
              </g>

              <g className="wax-swap-stamp" transform="translate(330 154)">
                <circle cx="50" cy="50" r="49" />
                <path d="M31 50h38M50 31v38" />
              </g>
            </svg>
          </div>

          <ol className="wax-swap-steps">
            <li>
              <span className="wax-swap-step-icon"><Search aria-hidden="true" /></span>
              <span><strong>Find a match</strong><small>Search the collections around you.</small></span>
            </li>
            <li>
              <span className="wax-swap-step-icon"><ClipboardCheck aria-hidden="true" /></span>
              <span><strong>Compare the context</strong><small>Check set, condition, and fit.</small></span>
            </li>
            <li>
              <span className="wax-swap-step-icon"><MessageCircle aria-hidden="true" /></span>
              <span><strong>Agree before you trade</strong><small>Keep the conversation clear.</small></span>
            </li>
          </ol>
        </section>

        <section className="wax-swap-guide" aria-labelledby="swapping-guide-heading">
          <div className="wax-swap-guide-intro">
            <p className="wax-kicker">A CLEARER WAY TO TRADE</p>
            <h2 id="swapping-guide-heading">A swap should feel clear before it feels exciting.</h2>
            <p>Use your collection as the starting point, then narrow the conversation until both sides know what is moving.</p>
          </div>
          <div className="wax-swap-guide-layout">
            <div className="wax-swap-guide-block">
              <h3>Before you agree</h3>
              <ul className="wax-swap-rule-list">
                <li><Check aria-hidden="true" />Confirm the card name, set, and number.</li>
                <li><Check aria-hidden="true" />Describe condition honestly and clearly.</li>
                <li><Check aria-hidden="true" />Make sure both sides understand the exchange.</li>
                <li><Check aria-hidden="true" />Keep the final details in the conversation.</li>
              </ul>
            </div>
            <div className="wax-swap-guide-block">
              <h3>Ways to look for a match</h3>
              <ul className="wax-swap-option-list">
                <li><Search aria-hidden="true" /><span><strong>Collection matches</strong><small>Start with what you want and what you can offer.</small></span></li>
                <li><MapPin aria-hidden="true" /><span><strong>Nearby collectors</strong><small>Use location context to make discovery more relevant.</small></span></li>
                <li><ShieldCheck aria-hidden="true" /><span><strong>Thoughtful exchanges</strong><small>Review the details before you move from interest to agreement.</small></span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="wax-swap-cta" aria-labelledby="swapping-cta-heading">
          <div>
            <p className="wax-kicker">YOUR NEXT GOOD PULL</p>
            <h2 id="swapping-cta-heading">Might be in someone else&apos;s binder.</h2>
            <p>Sign in to search for matches, or create your collector profile and start building your exchange context.</p>
          </div>
          <div className="wax-swap-cta-actions">
            <a className="wax-button wax-button-primary" href="/signup">Join the club <ArrowRight aria-hidden="true" /></a>
            <a className="wax-button wax-button-secondary" href="/login">Sign in to swap</a>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
