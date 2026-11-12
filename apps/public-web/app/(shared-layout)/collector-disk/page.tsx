import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@tcg/ui-web";
import {
  CardJourney,
  CollectorFeature,
  FeaturedCard,
} from "./collector-scenes";
import styles from "./collector-disk.module.css";

export const metadata = {
  title: "Collector Disk | Next Pull",
  description: "Discover the collector tools coming soon to Next Pull.",
};

const chapters = [
  {
    id: "collection",
    title: "Collection Tracking",
    description:
      "Keep track of your collection and the cards you are looking for.",
    scene: "collection" as const,
  },
  {
    id: "swapping",
    title: "Swapping",
    description: "Find other collectors and make your next exchange.",
    scene: "swap" as const,
  },
  {
    id: "marketplace",
    title: "Marketplace Listing",
    description:
      "Give your cards their next chapter with listings for collectors.",
    scene: "listing" as const,
  },
];

export default function CollectorDiskPage() {
  return (
    <main className={styles.page} data-journey-root>
      <CardJourney />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.status}>Coming soon</p>
            <h1>
              More ways to collect are coming
              <span className={styles.dot}>.</span>
            </h1>
            <p>
              Collector Disk is bringing your collection, swaps, and listings
              together in one place.
            </p>
            <a className={styles.discover} href="#collection">
              Discover Collector Disk <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.heroArtwork} aria-hidden="true">
            <span className={styles.heroCardBack} />
            <span className={styles.heroCardMiddle} />
            <span className={styles.heroCardFront}>
              <FeaturedCard anchor={0} />
            </span>
          </div>
        </div>
      </section>
      {chapters.map((chapter, index) => (
        <CollectorFeature
          key={chapter.id}
          id={chapter.id}
          title={chapter.title}
          description={chapter.description}
          variant={chapter.scene}
          dark={index === 1}
        />
      ))}
      <section className={styles.final}>
        <div className={styles.finalInner}>
          <div>
            <p className={styles.status}>Coming soon</p>
            <h2>Until then, find your next pull.</h2>
            <p>Explore the Next Pull store for your next addition.</p>
          </div>
          <Button asChild>
            <Link href="/shop">
              Explore the store <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
