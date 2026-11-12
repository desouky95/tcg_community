import Link from "next/link";
import { lowestProductPrice } from "../../src/lib/homepage-product-queries";
import { HeroSlider } from "@tcg/ui-web";
import {
  getHomepage,
  getHomepageProducts,
  getLatestHomepageProducts,
  mapHeroSlides,
  mediaURL,
} from "../../src/lib/homepage.server";
import { getProductsByCollection } from "#lib/homepage-product-data";

type Sections = Extract<
  Awaited<ReturnType<typeof getHomepage>>,
  { kind: "ready" }
>["sections"];
type ProductBlock = Extract<
  Sections[number],
  { __component: "homepage.product-section" }
>;

type LatestBlock = Extract<
  Sections[number],
  { __component: "homepage.latest-products" }
>;

type CollectionBlock = Extract<
  Sections[number],
  { __component: "homepage.collection-section" }
>;

async function ProductSection({
  section,
  dark = false,
}: {
  section: ProductBlock | LatestBlock | CollectionBlock;
  dark?: boolean;
}) {
  const result =
    section.__component === "homepage.collection-section"
      ? await getProductsByCollection(section.collection, section.limit)
      : section.__component === "homepage.latest-products"
        ? await getLatestHomepageProducts(section.collection, section.limit)
        : await getHomepageProducts(
          (section.products ?? []).map((product) => product.medusaId),
        );
  return (
    <section
      className={`${dark ? "bg-primary-500" : ""} px-gutter py-22 text-paper-50`}
    >
      <div className="mx-auto max-w-360">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6 border-b border-divider-300 pb-6">
          <div>
            <h2
              className={`font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.05] font-semibold tracking-tight ${!dark ? "text-primary-500" : ""}`}
            >
              {section.heading}
            </h2>
            {section.description && (
              <p
                className={`mt-3 max-w-2xl ${dark ? "text-primary-100" : "text-primary-400"}`}
              >
                {section.description}
              </p>
            )}
          </div>
          <Link
            className={`focus-ring font-semibold ${dark ? "text-signature-lime-500" : "text-primary-500"} underline underline-offset-4`}
            href={
              section.shop_link?.startsWith("/") &&
              !section.shop_link.startsWith("//")
                ? section.shop_link
                : "/shop"
            }
          >
            View all products <span aria-hidden="true">→</span>
          </Link>
        </div>
        {result.kind === "unavailable" ? (
          <p>Products are temporarily unavailable. Please try again later.</p>
        ) : result.products.length === 0 ? (
          <p>No products are available here yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {result.products.map((product) => {
              const price = lowestProductPrice(product);
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className={`group focus-ring block overflow-hidden rounded-xl ${dark ? "bg-paper-50" : "bg-paper-200 "} p-2 pb-5 text-primary-500 hover:bg-signature-lime-300`}
                >
                  <div className="aspect-square overflow-hidden rounded-[10px] bg-paper-200">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="mx-5 mt-4 font-display text-lg font-semibold group-hover:underline">
                    {product.title}
                  </h3>
                  {price && (
                    <p className="mx-5 mt-1 text-sm">
                      {new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: price.currency_code!,
                      }).format(price.calculated_amount!)}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const renderers = {
  "homepage.collection-section": (section: CollectionBlock) => (
    <ProductSection dark={section.variant === "dark"} section={section} />
  ),
  "slider.hero-slider": (
    section: Extract<Sections[number], { __component: "slider.hero-slider" }>,
  ) => {
    return <HeroSlider slides={mapHeroSlides(section.banners ?? [])} />;
  },
  "homepage.latest-products": (section: LatestBlock) => (
    <ProductSection dark section={section} />
  ),
  "homepage.product-section": (section: ProductBlock) => (
    <ProductSection section={section} />
  ),
  "homepage.banner-strip": (
    section: Extract<
      Sections[number],
      { __component: "homepage.banner-strip" }
    >,
  ) => (
    <div>
      <img src={mediaURL(section.image)} className="w-full" />
    </div>
  ),
};

export default async function HomePage() {
  const homepage = await getHomepage();
  console.log({ homepage });
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
      {homepage.sections.map((section) => {
        switch (section.__component) {
          case "slider.hero-slider":
            return (
              <div key={`${section.__component}-${section.id}`}>
                {renderers[section.__component](section)}
              </div>
            );
          case "homepage.latest-products":
            return (
              <div key={`${section.__component}-${section.id}`}>
                {renderers["homepage.latest-products"](section)}
              </div>
            );
          case "homepage.product-section":
            return (
              <div key={`${section.__component}-${section.id}`}>
                {renderers[section.__component](section)}
              </div>
            );
          case "homepage.banner-strip":
            return (
              <div key={`${section.__component}-${section.id}`}>
                {renderers[section.__component](section)}
              </div>
            );
          case "homepage.collection-section":
            return (
              <div key={`${section.__component}-${section.id}`}>
                {renderers[section.__component](section)}
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
