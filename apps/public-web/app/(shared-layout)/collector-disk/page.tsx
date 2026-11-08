import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@tcg/ui-web";

export const metadata = {
  title: "Collector Disk | Next Pull",
  description: "Discover the collector tools coming soon to Next Pull.",
};

const features = [
  { name: "Swapping", description: "Find other collectors and make your next exchange." },
  { name: "Collection Tracking", description: "Keep track of your collection and the cards you are looking for." },
  { name: "Marketplace Listing", description: "Give your cards their next chapter with listings for collectors." },
];

export default function CollectorDiskPage() {
  return (
    <>
      <section className="bg-wax-navy px-gutter py-section text-wax-paper">
        <div className="mx-auto grid max-w-360 gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-none md:text-7xl">More ways to collect are coming.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-wax-paper/85">Collector Disk is coming soon. We are bringing your collection, swaps, and listings together in one place.</p>
          </div>
          <div className="border-t border-wax-paper/40 pt-6 lg:ms-auto lg:max-w-sm">
            <p className="text-sm font-semibold uppercase tracking-wider">Coming soon</p>
            <p className="mt-3 leading-relaxed text-wax-paper/85">Until then, explore the Next Pull store for your next addition.</p>
            <Button asChild className="mt-6"><Link href="/shop">Explore the store <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </section>
      <style>{`@media (prefers-reduced-motion: no-preference) { .collector-features article { animation: collector-focus 650ms cubic-bezier(.16,1,.3,1) both; } } @keyframes collector-focus { from { filter: blur(2px); opacity: .7; } to { filter: blur(0); opacity: 1; } }`}</style>
      <section className="collector-features mx-auto max-w-360 px-gutter py-section" aria-labelledby="features-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div><h2 id="features-heading" className="font-display text-3xl font-bold md:text-5xl">Made for the way you collect.</h2><p className="mt-5 max-w-sm leading-relaxed text-wax-muted">Three tools, one home for your collection. Each is coming in a future release.</p></div>
          <div className="border-t border-wax-line">
            {features.map((feature) => (
              <article key={feature.name} className="grid gap-3 border-b border-wax-line py-7 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
                <h3 className="font-display text-2xl font-semibold">{feature.name}</h3>
                <div><p className="leading-relaxed text-wax-muted">{feature.description}</p><p className="mt-3 text-sm font-semibold">Coming soon</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
