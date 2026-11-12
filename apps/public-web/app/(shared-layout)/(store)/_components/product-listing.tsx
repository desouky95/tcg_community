import { ProductCard } from "@tcg/ui-web";
import Link from "next/link";
import {
  PAGE_SIZE,
  stockStatus,
  type CollectionFilters,
} from "../../../../src/lib/collection-queries";
import { lowestProductPrice } from "../../../../src/lib/homepage-product-queries";
import type { listProductResults } from "../../../../src/lib/shop-data.server";
import { FilterDrawer } from "../collections/[handle]/filter-drawer";

type Results = Awaited<ReturnType<typeof listProductResults>>;
const sortLabels: Record<string, string> = {
  newest: "Newest",
  oldest: "Oldest",
  title: "A–Z",
  "-title": "Z–A",
  price: "Price: low to high",
  "-price": "Price: high to low",
};
export function ProductListing({
  result,
  filters,
}: {
  result: Results;
  filters: CollectionFilters;
}) {
  const {
    products,
    count,
    page,
    currency,
    pricingUnavailable,
    stockAvailable,
    invalidRange,
  } = result;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  function url(overrides: Partial<CollectionFilters>) {
    const next = { ...filters, ...overrides };
    const query = new URLSearchParams();
    if (next.sort !== "newest") query.set("sort", next.sort);
    if (next.min) query.set("min", next.min);
    if (next.max) query.set("max", next.max);
    if (next.availability) query.set("availability", next.availability);
    if (next.page > 1) query.set("page", String(next.page));
    return `?${query}`;
  }
  const chips = [
    ...(filters.min
      ? [
          {
            label: `Min ${currency?.toUpperCase() ?? ""} ${filters.min}`,
            href: url({ min: "", page: 1 }),
          },
        ]
      : []),
    ...(filters.max
      ? [
          {
            label: `Max ${currency?.toUpperCase() ?? ""} ${filters.max}`,
            href: url({ max: "", page: 1 }),
          },
        ]
      : []),
    ...(filters.availability
      ? [
          {
            label:
              filters.availability === "in-stock" ? "In stock" : "Out of stock",
            href: url({ availability: "", page: 1 }),
          },
        ]
      : []),
  ];
  return (
    <div>
      {pricingUnavailable && (
        <div
          role="status"
          className="mt-5 rounded-md border border-wax-line p-4 text-sm"
        >
          Prices are temporarily unavailable for your region. Products can still
          be browsed.{" "}
          <a
            href={url({ page: 1 })}
            className="focus-ring font-semibold underline underline-offset-4"
          >
            Try again
          </a>
        </div>
      )}
      {invalidRange && (
        <p role="alert" className="mt-4 text-sm font-semibold">
          Minimum price must not exceed maximum price. Open Filter &amp; Sort to
          correct it.
        </p>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-wax-line py-4">
        <div className="flex flex-wrap items-center gap-4">
          <FilterDrawer
            key={JSON.stringify(filters)}
            filters={filters}
            priceAvailable={!pricingUnavailable}
            stockAvailable={stockAvailable || !!filters.availability}
            currency={currency}
          />
          <span className="text-sm">
            Sort:{" "}
            {pricingUnavailable && ["price", "-price"].includes(filters.sort)
              ? "Newest (price unavailable)"
              : sortLabels[filters.sort]}
          </span>
        </div>
        <p className="text-sm text-primary-400">
          {count} {count === 1 ? "product" : "products"}
        </p>
      </div>
      {chips.length > 0 && (
        <div
          aria-label="Active filters"
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="focus-ring rounded-md border border-wax-line px-3 py-2 text-sm"
            >
              {chip.label} <span aria-hidden="true">×</span>
              <span className="sr-only"> (remove filter)</span>
            </Link>
          ))}
          <Link
            href="?"
            className="focus-ring px-2 py-2 text-sm underline underline-offset-4"
          >
            Clear all
          </Link>
        </div>
      )}
      {products.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product, index) => {
            const price = lowestProductPrice(product);
            return (
              <ProductCard
                key={product.id}
                Link={Link}
                href={`/shop/${product.id}`}
                title={product.title}
                image={product.thumbnail}
                soldOut={stockStatus(product) === "out-of-stock"}
                imageLoading={index < 4 ? "eager" : "lazy"}
                price={
                  price
                    ? new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: price.currency_code!,
                      }).format(price.calculated_amount!)
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="border-y border-wax-line py-16 text-center">
          <h2 className="font-display text-xl font-semibold">
            {chips.length
              ? "No products match your filters"
              : "No products here yet"}
          </h2>
          <p className="mt-3 text-primary-400">
            {chips.length
              ? "Try adjusting or clearing your filters."
              : "Check back soon for new releases."}
          </p>
          {chips.length > 0 && (
            <Link
              href="?"
              className="focus-ring mt-5 inline-block font-semibold underline underline-offset-4"
            >
              Clear filters
            </Link>
          )}
        </div>
      )}
      {pages > 1 && (
        <nav
          aria-label="Product pages"
          className="mt-14 flex items-center justify-center gap-6 text-sm font-semibold"
        >
          {page > 1 && (
            <Link
              className="focus-ring underline underline-offset-4"
              href={url({ page: page - 1 })}
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
              href={url({ page: page + 1 })}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
