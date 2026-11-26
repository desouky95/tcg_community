import Link from "next/link";
import { io } from "next/cache";
import { Suspense } from "react";
import { HeroSlider } from "@tcg/ui-web";
import {
  ProductSection,
  ProductSectionFallback,
} from "../../src/components/homepage-product-section";
import {
  getHomepage,
  mapHeroSlides,
  mediaURL,
} from "../../src/lib/cms/homepage.server";

type Sections = Extract<
  Awaited<ReturnType<typeof getHomepage>>,
  { kind: "ready" }
>["sections"];

function renderSection(section: Sections[number]) {
  switch (section.__component) {
    case "homepage.collection-section":
      return (
        <Suspense
          fallback={<ProductSectionFallback heading={section.heading} />}
        >
          <ProductSection
            dark={
              section.__component === "homepage.collection-section" &&
              section.variant === "dark"
            }
            section={section}
          />
        </Suspense>
      );
    case "slider.hero-slider":
      return <HeroSlider slides={mapHeroSlides(section.banners ?? [])} />;
    case "homepage.banner-strip": {
      const image = mediaURL(section.image);
      return image ? (
        <div>
          <img
            src={image}
            alt={section.image?.alternativeText ?? ""}
            className="w-full"
          />
        </div>
      ) : null;
    }
    default:
      return null;
  }
}

export default async function HomePage() {
  await io();
  const homepage = await getHomepage();
  if (homepage.kind !== "ready")
    return (
      <section className="mx-auto max-w-360 px-gutter py-section">
        <h1 className="font-display text-3xl font-semibold">
          {homepage.kind === "setup"
            ? "Our homepage is being prepared."
            : "The homepage is temporarily unavailable."}
        </h1>
        <p className="mt-4 text-wax-muted">
          {homepage.kind === "setup"
            ? "Explore the shop while we put things together."
            : "Please try again soon, or explore the shop."}
        </p>
        <Link
          className="focus-ring mt-6 inline-block underline underline-offset-4"
          href="/shop"
        >
          Visit the shop
        </Link>
      </section>
    );

  return (
    <>
      {homepage.sections.map((section) => (
        <div key={`${section.__component}-${section.id}`}>
          {renderSection(section)}
        </div>
      ))}
    </>
  );
}

export const instant = false