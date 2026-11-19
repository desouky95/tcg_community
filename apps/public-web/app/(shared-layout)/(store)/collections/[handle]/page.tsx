import Link from "next/link";
import { notFound } from "next/navigation";
import { ShopProductCard } from "../../../../../src/components/shop-product-card";
import { getCollection } from "../../../../../src/lib/catalog/collection-data.server";
import {
  PAGE_SIZE,
  parseCollectionFilters,
  stockStatus,
} from "../../../../../src/lib/catalog/collection-queries";
import { lowestProductPrice } from "../../../../../src/lib/catalog/homepage-product-queries";
import { getMissingListVisuals } from "../../../../../src/lib/catalog/product-card-visuals.server";
import { FilterDrawer } from "./filter-drawer";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { handle } = await params;
  const filters = parseCollectionFilters(await searchParams);
  const result = await getCollection(handle, filters);
  
  if (result.kind === "not-found") notFound();
  if (result.kind === "unavailable")
    return (
      <section className="mx-auto max-w-360 px-gutter py-section">
        <h1 className="font-display text-3xl font-semibold">
          Collection unavailable
        </h1>
        <p className="mt-4">
          We couldn’t load this collection. Please try again later.
        </p>
        <Link className="mt-5 inline-block underline" href="/shop">
          Browse the shop
        </Link>
      </section>
    );
  const {
    collection,
    products,
    count,
    page,
    priceAvailable,
    stockAvailable,
  } = result;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const missingListIds = products
    .filter((product) => product.metadata?.type === "missing_list")
    .map((product) => product.id);
  const visuals = await getMissingListVisuals(missingListIds);
  const description =
    typeof collection.metadata?.description === "string"
      ? collection.metadata.description
      : null;
  const url = (nextPage: number) => {
    const p = new URLSearchParams();
    if (filters.sort !== "newest") p.set("sort", filters.sort);
    if (filters.min) p.set("min", filters.min);
    if (filters.max) p.set("max", filters.max);
    if (filters.availability) p.set("availability", filters.availability);
    if (nextPage > 1) p.set("page", String(nextPage));
    return `?${p}`;
  };
  return (
    <section className="mx-auto max-w-360 px-gutter pb-24 pt-12 text-primary-500 sm:pt-16">
      <div className="border-b border-wax-line pb-7">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-400">
          <Link href="/shop" className="focus-ring hover:underline">
            Shop
          </Link>
          <span aria-hidden="true"> / </span>Collections
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight">
            {collection.title}
          </h1>
          <span className="text-sm text-primary-400">[{count}]</span>
        </div>
        {description && (
          <p className="mt-5 max-w-3xl leading-relaxed text-primary-400">
            {description}
          </p>
        )}
      </div>
      <div className="mb-7 flex items-center justify-between gap-4 py-4">
        <FilterDrawer
          key={JSON.stringify(filters)}
          filters={filters}
          priceAvailable={priceAvailable}
          stockAvailable={stockAvailable}
          currency={products.map(lowestProductPrice).find(Boolean)?.currency_code ?? undefined}
        />
        <p className="text-sm text-primary-400">
          {count} {count === 1 ? "product" : "products"}
        </p>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product, index) => {
            const price = lowestProductPrice(product);
            const stock = stockStatus(product);
            return (
              <ShopProductCard
                key={product.id}
                Link={Link}
                href={`/shop/${product.id}`}
                title={product.title}
                productType={product.type?.value}
                image={product.thumbnail}
                isMissingList={product.metadata?.type === "missing_list"}
                missingListVisuals={visuals[product.id]}
                soldOut={stock === "out-of-stock"}
                imageLoading={index < 4 ? "eager" : "lazy"}
                price={price ? new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: price.currency_code!,
                }).format(price.calculated_amount!) : undefined}
              />
            );
          })}
        </div>
      ) : (
        <div className="border-y border-wax-line py-16 text-center">
          <h2 className="font-display text-xl font-semibold">
            {count
              ? "No products match your filters"
              : "No products here yet"}
          </h2>
          <p className="mt-3 text-primary-400">
            {count
              ? "Try adjusting or clearing your filters."
              : "Check back soon for new releases."}
          </p>
          <Link
            href={count ? "?" : "/shop"}
            className="focus-ring mt-5 inline-block font-semibold underline underline-offset-4"
          >
            {count ? "Clear filters" : "Browse the shop"}
          </Link>
        </div>
      )}
      {pages > 1 && (
        <nav
          aria-label="Collection pages"
          className="mt-14 flex items-center justify-center gap-6 text-sm font-semibold"
        >
          {page > 1 && (
            <Link
              className="focus-ring underline underline-offset-4"
              href={url(page - 1)}
            >
              Previous
            </Link>
          )}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link
              className="focus-ring underline underline-offset-4"
              href={url(page + 1)}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
