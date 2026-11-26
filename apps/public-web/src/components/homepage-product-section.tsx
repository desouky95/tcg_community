import { Badge } from "@tcg/ui-web";
import Link from "next/link";
import { ShopProductCard } from "./shop-product-card";
import { getMissingListVisuals } from "../lib/catalog/product-card-visuals.server";
import { lowestProductPrice } from "../lib/catalog/homepage-product-queries";
import { getProductsByCollection } from "../lib/catalog/homepage-product-data";
import type { HomepageState } from "../lib/cms/homepage.server";

type Sections = Extract<HomepageState, { kind: "ready" }>["sections"];
type ProductSectionBlock = Extract<
  Sections[number],
  { __component: "homepage.collection-section" }
>;

export async function ProductSection({
  section,
  dark = false,
}: {
  section: ProductSectionBlock;
  dark?: boolean;
}) {
  let products: Awaited<ReturnType<typeof getProductsByCollection>> | null =
    null;
  try {
    products = await getProductsByCollection(section.collection, section.limit);
  } catch {
    products = null;
  }
  const visuals = products
    ? await getMissingListVisuals(
        products
          .filter((product) => product.metadata?.type === "missing_list")
          .map((product) => product.id),
      )
    : {};

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
        {products === null ? (
          <p>Products are temporarily unavailable. Please try again later.</p>
        ) : products.length === 0 ? (
          <p>No products are available here yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => {
              const price = lowestProductPrice(product);
              return (
                product.metadata?.type === "missing_list" ? (
                  <ShopProductCard
                    key={product.id}
                    href={`/shop/${product.id}`}
                    title={product.title}
                    image={product.thumbnail}
                    price={
                      price
                        ? new Intl.NumberFormat("en", {
                            style: "currency",
                            currency: price.currency_code!,
                          }).format(price.calculated_amount!)
                        : undefined
                    }
                    productType={product.type?.value}
                    isMissingList
                    missingListVisuals={visuals[product.id]}
                  />
                ) : (
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
                          className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h3 className="mx-2 mt-3 text-base leading-tight max-sm:h-[4lh] max-sm:overflow-y-auto sm:mx-5 sm:mt-4 sm:text-lg sm:leading-7 font-display font-semibold [overflow-wrap:anywhere] group-hover:underline">
                      {product.title}
                    </h3>
                    {(product.type?.value === "Coming Soon" || product.type?.value === "Pre-order") && (
                      <Badge tone="warning" className="mx-5 mt-2">{product.type.value}</Badge>
                    )}
                    {price && (
                      <p className="mx-5 mt-1 text-sm">
                        {new Intl.NumberFormat("en", {
                          style: "currency",
                          currency: price.currency_code!,
                        }).format(price.calculated_amount!)}
                      </p>
                    )}
                  </Link>
                )
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function ProductSectionFallback({ heading }: { heading: string }) {
  return (
    <section
      className="px-gutter py-22 text-paper-50"
      aria-busy="true"
      aria-label={`Loading ${heading}`}
    >
      <div className="mx-auto max-w-360">
        <h2 className="mb-9 border-b border-divider-300 pb-6 font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-primary-500">
          {heading}
        </h2>
        <p>Loading products…</p>
      </div>
    </section>
  );
}
