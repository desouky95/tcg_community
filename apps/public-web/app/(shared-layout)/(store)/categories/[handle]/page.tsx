import Link from "next/link";
import { notFound } from "next/navigation";
import { parseCollectionFilters } from "../../../../../src/lib/collection-queries";
import { categoryTreeIds, findCategory, listProductResults } from "../../../../../src/lib/shop-data.server";
import { ProductListing } from "../../_components/product-listing";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { handle } = await params;
  const filters = parseCollectionFilters(await searchParams);
  let category;
  try { category = await findCategory(handle); } catch { return <Unavailable />; }
  if (!category) notFound();
  let products;
  try { products = await listProductResults(filters, categoryTreeIds(category)); } catch { return <Unavailable />; }
  return <section className="mx-auto max-w-360 px-gutter pb-24 pt-12 text-primary-500 sm:pt-16">
    <header className="border-b border-wax-line pb-7"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-400"><Link href="/shop" className="focus-ring hover:underline">Shop</Link><span aria-hidden="true"> / </span>Categories</p><h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight">{category.name}</h1>{category.description && <p className="mt-5 max-w-3xl leading-relaxed text-primary-400">{category.description}</p>}</header>
    <ProductListing result={products} filters={filters} />
  </section>;
}
function Unavailable() { return <section className="mx-auto max-w-360 px-gutter py-section"><h1 className="font-display text-3xl font-semibold">Category unavailable</h1><p className="mt-4">We couldn’t load this category. Please try again later.</p><Link href="/shop" className="focus-ring mt-5 inline-block underline">Browse the shop</Link></section>; }
