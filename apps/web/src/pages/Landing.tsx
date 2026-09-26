import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Repeat2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { PackOpening2D } from "../components/interactive/PackOpening2D";
import PublicShell from "../components/PublicShell";

const featuredCards = [
  { name: "Charizard VSTAR", set: "Brilliant Stars · 174/172", condition: "Near mint", image: "/images/landing/yamal.jpg", tone: "red" },
  { name: "Blue-Eyes White Dragon", set: "Legend of Blue-Eyes · SDK-001", condition: "Lightly played", image: "/images/landing/messi.jpg", tone: "navy" },
  { name: "Ronaldinho Icon", set: "World Cup Heritage · 12/50", condition: "Excellent", image: "/images/landing/ronaldinho.jpg", tone: "gold" },
  { name: "Lamine Yamal", set: "UCL 24/25 · 041", condition: "Near mint", image: "/images/packs/yamal.png", tone: "blue" },
];

const activity = [
  ["Cairo Binder Club", "requested a swap", "8m ago"],
  ["Mina Cards", "listed Charizard VSTAR", "22m ago"],
  ["NileCollector", "completed a trade", "41m ago"],
];

export default function Landing() {
  const user = useStore((state) => state.user);
  const [activeCard, setActiveCard] = useState(0);
  const [packOpen, setPackOpen] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <PublicShell>
        <section className="wax-hero wax-rule-top">
          <div className="wax-hero-copy">
            <p className="wax-kicker">EGYPT FIRST · COLLECTORS TOGETHER</p>
            <h1>Build a collection worth sharing.</h1>
            <p className="wax-lede">Track what you own, discover what is missing, and trade with collectors who care about the details.</p>
            <div className="wax-hero-actions">
              <Link to="/marketplace" className="wax-button">Browse the collection <ArrowRight aria-hidden="true" /></Link>
              <Link to="/signup" className="wax-text-link">Join the club</Link>
            </div>
          </div>

          <div className="wax-hero-specimen" aria-roledescription="carousel" aria-label="Featured cards">
            <div className="wax-pack-label">FEATURED PULL · 01</div>
            <div className="wax-card-stack" aria-live="polite">
              {featuredCards.map((card, index) => {
                const position = (index - activeCard + featuredCards.length) % featuredCards.length;
                if (position > 2) return null;
                return (
                  <article key={card.name} className={`wax-card wax-card-${position + 1}`}>
                    <img src={card.image} alt={`${card.name} card`} />
                    <div className="wax-card-caption"><strong>{card.name}</strong><span>{card.set}</span></div>
                  </article>
                );
              })}
            </div>
            {packOpen && (
              <div className="wax-pack-opening">
                <PackOpening2D
                  packImage="/images/packs/ucl_24_25.jpg"
                  cardImages={featuredCards.map((card) => card.image)}
                  className="wax-pack-opening-canvas"
                  onReset={() => setPackOpen(false)}
                />
              </div>
            )}
            <div className="wax-specimen-note">
              <span>{String(activeCard + 1).padStart(2, "0")} / {String(featuredCards.length).padStart(2, "0")}</span>
              <strong>Good cards. Better connections.</strong>
              <div className="wax-card-slider-controls">
                <button type="button" className="wax-card-slider-button" aria-label="Previous featured card" onClick={() => setActiveCard((current) => (current - 1 + featuredCards.length) % featuredCards.length)}><ChevronLeft aria-hidden="true" /></button>
                <button type="button" className="wax-card-slider-button" aria-label="Next featured card" onClick={() => setActiveCard((current) => (current + 1) % featuredCards.length)}><ChevronRight aria-hidden="true" /></button>
                <button type="button" className="wax-card-slider-button wax-pack-open-button" aria-label={packOpen ? "Close pack opening" : "Open a pack"} onClick={() => setPackOpen((open) => !open)}>+</button>
              </div>
            </div>
          </div>
        </section>

        <section className="wax-trust-strip" aria-label="Why collectors use TCG Nexus">
          <div><ShieldCheck aria-hidden="true" /><span><strong>Trusted catalogue</strong><small>Sets, numbers, and condition in one place.</small></span></div>
          <div><BookOpen aria-hidden="true" /><span><strong>Know your collection</strong><small>See what you own and what comes next.</small></span></div>
          <div><Repeat2 aria-hidden="true" /><span><strong>Trade with context</strong><small>Find fair swaps with real collectors.</small></span></div>
          <div><Users aria-hidden="true" /><span><strong>Built around people</strong><small>A stronger local collector scene.</small></span></div>
        </section>

        <section className="wax-content-section">
          <div className="wax-section-heading"><div><p className="wax-kicker">THE LATEST PULLS</p><h2>Cards worth a closer look.</h2></div><Link to="/marketplace" className="wax-text-link">View all cards <ArrowRight aria-hidden="true" /></Link></div>
          <div className="wax-card-grid">
            {featuredCards.map((card) => (
              <Link to="/marketplace" className="wax-listing-card" key={card.name}>
                <div className={`wax-listing-image wax-tone-${card.tone}`}><img src={card.image} alt="" /><span>AVAILABLE</span></div>
                <div className="wax-listing-meta"><div><strong>{card.name}</strong><span>{card.set}</span></div><span className="wax-condition">{card.condition}</span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="wax-exchange-section">
          <div className="wax-exchange-copy"><p className="wax-kicker">A COMMUNITY THAT MOVES</p><h2>Every collection has a missing piece.</h2><p>Keep your checklist close, find the right collector, and make the exchange feel as good as the pull.</p><Link to="/signup" className="wax-button">Start your collection <ArrowRight aria-hidden="true" /></Link></div>
          <div className="wax-activity-panel"><div className="wax-panel-heading"><strong>LIVE ACTIVITY</strong><span><i /> Cairo &amp; Alexandria</span></div>{activity.map(([name, action, time]) => <div className="wax-activity-row" key={name}><span className="wax-avatar" aria-hidden="true">{name.slice(0, 1)}</span><span><strong>{name}</strong><small>{action}</small></span><time>{time}</time></div>)}<Link to="/swapping" className="wax-panel-link">See the exchange <ArrowRight aria-hidden="true" /></Link></div>
        </section>
    </PublicShell>
  );
}
