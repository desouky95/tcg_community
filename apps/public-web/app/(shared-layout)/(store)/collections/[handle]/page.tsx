import Link from "next/link";
import { ProductCard } from "@tcg/ui-web";
import { notFound } from "next/navigation";
import { getCollection } from "../../../../../src/lib/collection-data.server";
import {
  filterCollectionProducts,
  PAGE_SIZE,
  parseCollectionFilters,
  stockStatus,
} from "../../../../../src/lib/collection-queries";
import { lowestProductPrice } from "../../../../../src/lib/homepage-product-queries";
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
  const result = await getCollection(handle);
  
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
  const { collection, products } = result;
  const priceAvailable = products.some((product) =>
    lowestProductPrice(product),
  );
  const stockAvailable = products.some(
    (product) => stockStatus(product) !== undefined,
  );
  const filtered = filterCollectionProducts(products, filters);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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
          <span className="text-sm text-primary-400">[{filtered.length}]</span>
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
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </div>
      {shown.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {shown.map((product, index) => {
            const price = lowestProductPrice(product);
            const stock = stockStatus(product);
            return (
              <ProductCard
                key={product.id}
                Link={Link}
                href={`/shop/${product.id}`}
                title={product.title}
                image={product.thumbnail}
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
            {products.length
              ? "No products match your filters"
              : "No products here yet"}
          </h2>
          <p className="mt-3 text-primary-400">
            {products.length
              ? "Try adjusting or clearing your filters."
              : "Check back soon for new releases."}
          </p>
          <Link
            href={products.length ? "?" : "/shop"}
            className="focus-ring mt-5 inline-block font-semibold underline underline-offset-4"
          >
            {products.length ? "Clear filters" : "Browse the shop"}
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
