"use client";
export const dynamic = 'force-static';
import { ArrowRight } from "lucide-react";
import {
  ActivityPanel,
  SearchRail,
  TrustStrip,
  PublicShell,
  buttonStyles,
  textLinkStyles,
  TextLink,
  Button,
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
export default function HomePage() {
  return (
    <>
      <section className="wax-hero border-t border-wax-line">
        <div className="wax-hero-copy">
          <h1>Find your next pull.</h1>
          <p className="my-7 max-w-lg text-base leading-relaxed text-wax-muted md:text-lg">
            Track your collection, discover what is missing, and trade with
            collectors who know every card counts.
          </p>
          <div className="flex flex-wrap gap-3 [&_a]:flex-1 [&_a]:justify-center">
            <Button asChild>
              <Link href="/shop">
                Shop official releases <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <TextLink asChild>
              <a href={process.env.NEXT_PUBLIC_APP_URL ?? "/signup"}>Open your checklists</a>
            </TextLink>
          </div>
        </div>
        <CardsSlider cards={featuredCards} />
      </section>
      <TrustStrip />
      <section className="mx-auto max-w-360 px-gutter py-section [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-display">
        <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2>Your collection, in one place.</h2>
          </div>
          <Link href="/checklists" className={textLinkStyles()}>
            Explore checklists <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <p className="max-w-2xl text-wax-muted">Build a clear view of every set, track what you own, and return whenever the next card lands in your binder.</p>
      </section>
      <section className="mx-auto grid max-w-360 gap-8 bg-wax-red px-gutter py-section text-wax-paper lg:grid-cols-2 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-display">
        <div className="max-w-2xl lg:pe-12 [&>p:not(.ui-kicker)]:my-6 [&>p:not(.ui-kicker)]:max-w-lg [&>p:not(.ui-kicker)]:leading-relaxed [&>p:not(.ui-kicker)]:text-wax-paper/85">
          <h2>Every collection has a missing piece.</h2>
          <p>
            Keep your checklist close and know exactly what belongs in your binder.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_APP_URL ?? "/signup"}
            className={buttonStyles({
              className:
                "border-wax-paper bg-wax-paper text-primary-600 hover:border-wax-gold hover:bg-wax-gold",
            })}
          >
            Start collecting <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <ActivityPanel
          items={[
            {
              id: "cairo",
              name: "Cairo Binder Club",
              action: "updated a checklist",
              location: "Cairo",
              time: "8m ago",
            },
            {
              id: "mina",
              name: "Mina Cards",
              action: "completed a collection",
              location: "Alexandria",
              time: "22m ago",
            },
            {
              id: "nile",
              name: "NileCollector",
              action: "added a new set",
              location: "Cairo",
              time: "41m ago",
            },
          ]}
          action={
            <a href="/swapping" className={textLinkStyles()}>
              Swapping is coming soon <ArrowRight aria-hidden="true" />
            </a>
          }
        />
      </section>
      
    </>
  );
}
