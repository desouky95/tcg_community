import { Suspense } from "react";
import { parseCollectionFilters } from "../../../../src/lib/collection-queries";
import {
  listDiscovery,
  listProductResults,
} from "../../../../src/lib/shop-data.server";
import { DiscoverySection } from "../_components/discovery-section";
import { ProductListing } from "../_components/product-listing";
import { CommerceCustomerLink } from "./commerce-customer-link";

export const metadata = {
  title: "Shop | Next Pull",
  description: "Explore collections, categories and products at Next Pull.",
};

function metadataImage(metadata: Record<string, unknown> | null | undefined) {
  const image = metadata?.image || metadata?.thumbnail;
  if (typeof image !== "string") return undefined;
  try {
    const url = new URL(image);
    return url.href;
    // return ["https:", "http:"].includes(url.protocol) ? image : undefined;
  } catch {
    return undefined;
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseCollectionFilters(await searchParams);
  return (
    <section className="mx-auto max-w-360 px-gutter pb-24 pt-12 text-primary-500 sm:pt-16">
      <CommerceCustomerLink />
      <header className="max-w-3xl">
        <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight">
          Find your next pull.
        </h1>
        <p className="mt-4 max-w-2xl text-primary-400">
          Explore collections and categories, then discover your next release.
        </p>
      </header>
      <Suspense
        fallback={
          <p className="mt-12" role="status">
            Loading collections and categories…
          </p>
        }
      >
        <Discovery />
      </Suspense>
      <section className="mt-14" aria-labelledby="all-products">
        <h2
          id="all-products"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          All products
        </h2>
        <Suspense
          key={JSON.stringify(filters)}
          fallback={
            <p className="mt-6" role="status">
              Loading products…
            </p>
          }
        >
          <ShopProducts filters={filters} />
        </Suspense>
      </section>
    </section>
  );
}

async function Discovery() {
  const [discovery] = await Promise.allSettled([listDiscovery()]);
  return discovery.status === "fulfilled" ? (
    <>
      {discovery.value.collections.length === 0 &&
        discovery.value.categories.length === 0 && (
          <p className="mt-12 text-primary-400">
            Collections and categories will appear here when available.
          </p>
        )}
      <DiscoverySection
        title="Browse collections"
        path="/collections"
        items={discovery.value.collections
          .filter((item) => !!item.handle)
          .map((item) => {
            return {
              id: item.id,
              handle: item.handle!,
              name: item.title,
              image: metadataImage(item.metadata),
            };
          })}
      />
      <DiscoverySection
        title="Shop by category"
        path="/categories"
        items={discovery.value.categories
          .filter((item) => !!item.handle)
          .map((item) => {
            console.log({ image: metadataImage(item.metadata) });

            return {
              id: item.id,
              handle: item.handle,
              name: item.name,
              image: metadataImage(item.metadata),
            };
          })}
      />
    </>
  ) : (
    <p className="mt-12 text-primary-400" role="status">
      Collections and categories are temporarily unavailable. Please try again
      later.
    </p>
  );
}

async function ShopProducts({
  filters,
}: {
  filters: ReturnType<typeof parseCollectionFilters>;
}) {
  try {
    return (
      <ProductListing
        result={await listProductResults(filters)}
        filters={filters}
      />
    );
  } catch {
    return (
      <div className="mt-6 border-y border-wax-line py-12">
        <p>Products are temporarily unavailable. Please try again later.</p>
        <a
          href="/shop"
          className="focus-ring mt-4 inline-block font-semibold underline underline-offset-4"
        >
          Try again
        </a>
      </div>
    );
  }
}
