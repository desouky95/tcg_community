"use client";

import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Repeat2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { PublicShell } from "@tcg/ui-web";
import { CardsSlider } from "../src/components/CardsSlider";

const featuredCards = [
  {
    name: "Charizard VSTAR",
    set: "Brilliant Stars · 174/172",
    condition: "Near mint",
    image: "/images/landing/yamal.jpg",
    tone: "red",
  },
  {
    name: "Blue-Eyes White Dragon",
    set: "Legend of Blue-Eyes · SDK-001",
    condition: "Lightly played",
    image: "/images/landing/messi.jpg",
    tone: "navy",
  },
  {
    name: "Ronaldinho Icon",
    set: "World Cup Heritage · 12/50",
    condition: "Excellent",
    image: "/images/landing/ronaldinho.jpg",
    tone: "gold",
  },
  {
    name: "Lamine Yamal",
    set: "UCL 24/25 · 041",
    condition: "Near mint",
    image: "/images/packs/yamal.png",
    tone: "blue",
  },
];
const cards = [
  [
    "Charizard VSTAR",
    "Brilliant Stars · 174/172",
    "Near mint",
    "/images/landing/yamal.jpg",
  ],
  [
    "Blue-Eyes White Dragon",
    "Legend of Blue-Eyes · SDK-001",
    "Lightly played",
    "/images/landing/messi.jpg",
  ],
  [
    "Ronaldinho Icon",
    "World Cup Heritage · 12/50",
    "Excellent",
    "/images/landing/ronaldinho.jpg",
  ],
];

export default function HomePage() {
  return (
    <PublicShell currentPath="/">
      <section className="wax-hero wax-rule-top">
        <div className="wax-hero-copy">
          <p className="wax-kicker">EGYPT FIRST · COLLECTORS TOGETHER</p>
          <h1>Build a collection worth sharing.</h1>
          <p className="wax-lede">
            Track what you own, discover what is missing, and trade with
            collectors who care about the details.
          </p>
          <div className="wax-hero-actions">
            <a href="/marketplace" className="wax-button">
              Browse the collection <ArrowRight aria-hidden="true" />
            </a>
            <a href="/signup" className="wax-text-link">
              Join the club
            </a>
          </div>
        </div>
        <CardsSlider cards={featuredCards} />
      </section>
      <section
        className="wax-trust-strip"
        aria-label="Why collectors use TCG Nexus"
      >
        <div>
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>Trusted catalogue</strong>
            <small>Sets, numbers, and condition in one place.</small>
          </span>
        </div>
        <div>
          <BookOpen aria-hidden="true" />
          <span>
            <strong>Know your collection</strong>
            <small>See what you own and what comes next.</small>
          </span>
        </div>
        <div>
          <Repeat2 aria-hidden="true" />
          <span>
            <strong>Trade with context</strong>
            <small>Find fair swaps with real collectors.</small>
          </span>
        </div>
        <div>
          <Users aria-hidden="true" />
          <span>
            <strong>Built around people</strong>
            <small>A stronger local collector scene.</small>
          </span>
        </div>
      </section>
      <section className="wax-content-section">
        <div className="wax-section-heading">
          <div>
            <p className="wax-kicker">THE LATEST PULLS</p>
            <h2>Cards worth a closer look.</h2>
          </div>
          <a href="/marketplace" className="wax-text-link">
            View all cards <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="wax-card-grid">
          {cards.map(([name, set, condition, image], index) => (
            <a href="/marketplace" className="wax-listing-card" key={name}>
              <div
                className={`wax-listing-image wax-tone-${["red", "navy", "gold", "blue"][index]}`}
              >
                <img src={image} alt="" />
                <span>AVAILABLE</span>
              </div>
              <div className="wax-listing-meta">
                <div>
                  <strong>{name}</strong>
                  <span>{set}</span>
                </div>
                <span className="wax-condition">{condition}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="wax-exchange-section">
        <div className="wax-exchange-copy">
          <p className="wax-kicker">A COMMUNITY THAT MOVES</p>
          <h2>Every collection has a missing piece.</h2>
          <p>
            Keep your checklist close, find the right collector, and make the
            exchange feel as good as the pull.
          </p>
          <a href="/signup" className="wax-button">
            Start your collection <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="wax-activity-panel">
          <div className="wax-panel-heading">
            <strong>LIVE ACTIVITY</strong>
            <span>
              <i /> Cairo &amp; Alexandria
            </span>
          </div>
          {[
            ["Cairo Binder Club", "requested a swap", "8m ago"],
            ["Mina Cards", "listed Charizard VSTAR", "22m ago"],
            ["NileCollector", "completed a trade", "41m ago"],
          ].map(([name, action, time]) => (
            <div className="wax-activity-row" key={name}>
              <span className="wax-avatar" aria-hidden="true">
                {name[0]}
              </span>
              <span>
                <strong>{name}</strong>
                <small>{action}</small>
              </span>
              <time>{time}</time>
            </div>
          ))}
          <a href="/swapping" className="wax-panel-link">
            See the exchange <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
