"use client";
export const dynamic = 'force-static';
import { ArrowRight } from "lucide-react";
import {
  ActivityPanel,
  SearchRail,
  TrustStrip,
  Kicker,
  PublicShell,
  buttonStyles,
  textLinkStyles,
  TextLink,
  Button,
  ListingPreview,
} from "@tcg/ui-web";
import Link from "next/link";
import { CardsSlider } from "../../src/components/CardsSlider";


const featuredCards = [
  {
    name: "Lamine Yamal",
    set: "Football collection",
    condition: "Near mint",
    image: "/images/landing/yamal.jpg",
    tone: "red",
  },
  {
    name: "Lionel Messi",
    set: "Football collection",
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
  }
];
const cards = [
  [
    "Lamine Yamal",
    "Football collection",
    "Near mint",
    "/images/landing/yamal.jpg",
  ],
  [
    "Lionel Messi",
    "Football collection",
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
      <section className="wax-hero border-t border-wax-line">
        <div className="wax-hero-copy">
          <Kicker>EGYPT FIRST · COLLECTORS TOGETHER</Kicker>
          <h1>Build a collection worth sharing.</h1>
          <p className="my-7 max-w-lg text-base leading-relaxed text-wax-muted md:text-lg">
            Track what you own, discover what is missing, and trade with
            collectors who care about the details.
          </p>
          <div className="flex flex-wrap gap-3 [&_a]:flex-1 [&_a]:justify-center">
            <Button asChild>
              <Link href="/marketplace">
                Browse the collection <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <TextLink asChild>
              <Link href={"/signup"}>Join the club</Link>
            </TextLink>
          </div>
        </div>
        <CardsSlider cards={featuredCards} />
      </section>
      <TrustStrip />
      <section className="mx-auto max-w-360 px-gutter py-section [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-display">
        <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Kicker>THE LATEST PULLS</Kicker>
            <h2>Cards worth a closer look.</h2>
          </div>
          <a href="/marketplace" className={textLinkStyles()}>
            View all cards <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {cards.map(([name, set, condition, image]) => <ListingPreview key={name} href="/marketplace" name={name} set={set} condition={condition} image={image} />)}
        </div>
      </section>
      <section className="mx-auto grid max-w-360 gap-8 bg-wax-red px-gutter py-section text-wax-paper lg:grid-cols-2 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-display">
        <div className="max-w-2xl lg:pe-12 [&>p:not(.ui-kicker)]:my-6 [&>p:not(.ui-kicker)]:max-w-lg [&>p:not(.ui-kicker)]:leading-relaxed [&>p:not(.ui-kicker)]:text-wax-paper/85">
          <Kicker className="text-wax-gold">A COMMUNITY THAT MOVES</Kicker>
          <h2>Every collection has a missing piece.</h2>
          <p>
            Keep your checklist close, find the right collector, and make the
            exchange feel as good as the pull.
          </p>
          <a
            href="/signup"
            className={buttonStyles({
              className:
                "border-wax-paper bg-wax-paper text-primary-600 hover:border-wax-gold hover:bg-wax-gold",
            })}
          >
            Start your collection <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <ActivityPanel
          items={[
            {
              id: "cairo",
              name: "Cairo Binder Club",
              action: "requested a swap",
              location: "Cairo",
              time: "8m ago",
            },
            {
              id: "mina",
              name: "Mina Cards",
              action: "listed a card",
              location: "Alexandria",
              time: "22m ago",
            },
            {
              id: "nile",
              name: "NileCollector",
              action: "completed a trade",
              location: "Cairo",
              time: "41m ago",
            },
          ]}
          action={
            <a href="/swapping" className={textLinkStyles()}>
              See the exchange <ArrowRight aria-hidden="true" />
            </a>
          }
        />
      </section>
    </PublicShell>
  );
}
