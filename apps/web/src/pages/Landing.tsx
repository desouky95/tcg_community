import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { PackOpening2D } from "../components/interactive/PackOpening2D";
import PublicShell from "../components/PublicShell";
import { ActivityPanel, CardSpecimen, IconButton, ListingPreview, SearchRail, TrustStrip, Kicker, buttonStyles, textLinkStyles, type LinkComponent } from "@tcg/ui-web";

const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />;

const featuredCards = [
  { name: "Lamine Yamal", set: "Football collection", condition: "Near mint", image: "/images/landing/yamal.jpg", tone: "red" },
  { name: "Lionel Messi", set: "Football collection", condition: "Lightly played", image: "/images/landing/messi.jpg", tone: "navy" },
  { name: "Ronaldinho Icon", set: "World Cup Heritage · 12/50", condition: "Excellent", image: "/images/landing/ronaldinho.jpg", tone: "gold" },
  { name: "Lamine Yamal", set: "UCL 24/25 · 041", condition: "Near mint", image: "/images/packs/yamal.png", tone: "blue" },
];

const activity = [
  { id: "cairo", name: "Cairo Binder Club", action: "requested a swap", location: "Cairo", time: "8m ago" },
  { id: "mina", name: "Mina Cards", action: "listed a card", location: "Alexandria", time: "22m ago" },
  { id: "nile", name: "NileCollector", action: "completed a trade", location: "Cairo", time: "41m ago" },
];

export default function Landing() {
  const user = useStore((state) => state.user);
  const [activeCard, setActiveCard] = useState(0);
  const [packOpen, setPackOpen] = useState(false);

  if (user) return <Navigate to="/" replace />;

  return (
    <PublicShell>
        <section className="wax-hero border-t border-wax-line">
          <div className="wax-hero-copy">
            <Kicker>EGYPT FIRST · COLLECTORS TOGETHER</Kicker>
            <h1>Build a collection worth sharing.</h1>
            <p className="my-7 max-w-lg text-base leading-relaxed text-wax-muted md:text-lg">Track what you own, discover what is missing, and trade with collectors who care about the details.</p>

            <SearchRail className="my-6" popularQueries={["Football", "Pokémon", "2025"]} />
            <div className="flex flex-wrap gap-3 [&_a]:flex-1 [&_a]:justify-center">
              <Link to="/marketplace" className={buttonStyles()}>Browse the collection <ArrowRight aria-hidden="true" /></Link>
              <Link to="/signup" className={textLinkStyles()}>Join the club</Link>
            </div>

          </div>

          <div className="wax-hero-specimen" aria-roledescription="carousel" aria-label="Featured cards">
            <div className="wax-pack-label">FEATURED PULL · 01</div>
            <div className="wax-card-stack" aria-live="polite">
              {featuredCards.map((card, index) => {
                const position = (index - activeCard + featuredCards.length + 1) % featuredCards.length;
                if (position > 2) return null;
                return (
                  <CardSpecimen key={card.name} {...card} position={(position + 1) as 1 | 2 | 3} href="/marketplace" />
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
              <div className="ms-auto flex gap-2">
                <IconButton type="button" variant="outline" className="border-wax-paper/60 text-wax-paper hover:bg-wax-red" aria-label="Previous featured card" onClick={() => setActiveCard((current) => (current - 1 + featuredCards.length) % featuredCards.length)}><ChevronLeft aria-hidden="true" className="size-4" /></IconButton>
                <IconButton type="button" variant="outline" className="border-wax-paper/60 text-wax-paper hover:bg-wax-red" aria-label="Next featured card" onClick={() => setActiveCard((current) => (current + 1) % featuredCards.length)}><ChevronRight aria-hidden="true" className="size-4" /></IconButton>
                <IconButton type="button" variant="outline" className="border-wax-paper/60 text-wax-paper hover:bg-wax-red" aria-label={packOpen ? "Close pack opening" : "Open a pack"} onClick={() => setPackOpen((open) => !open)}>+</IconButton>
              </div>
            </div>
          </div>
        </section>

        <TrustStrip />

        <section className="mx-auto max-w-[1440px] px-gutter py-section [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-display">
          <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><Kicker>THE LATEST PULLS</Kicker><h2>Cards worth a closer look.</h2></div><Link to="/marketplace" className={textLinkStyles()}>View all cards <ArrowRight aria-hidden="true" /></Link></div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {featuredCards.map(card => <ListingPreview key={card.name} {...card} href="/marketplace" Link={RouterLink} />)}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-gutter py-section grid gap-8 bg-wax-navy text-wax-paper lg:grid-cols-2 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-display">
          <div className="max-w-2xl lg:pe-12 [&>p:not(.ui-kicker)]:my-6 [&>p:not(.ui-kicker)]:max-w-lg [&>p:not(.ui-kicker)]:leading-relaxed [&>p:not(.ui-kicker)]:text-wax-paper/85"><Kicker className="text-wax-gold">A COMMUNITY THAT MOVES</Kicker><h2>Every collection has a missing piece.</h2><p>Keep your checklist close, find the right collector, and make the exchange feel as good as the pull.</p><Link to="/signup" className={buttonStyles({ className: "border-wax-paper bg-wax-paper text-primary-600 hover:border-wax-gold hover:bg-wax-gold" })}>Start your collection <ArrowRight aria-hidden="true" /></Link></div>
          <ActivityPanel items={activity} action={<Link to="/swapping" className={textLinkStyles()}>See the exchange <ArrowRight aria-hidden="true" /></Link>} />
        </section>
    </PublicShell>
  );
}
