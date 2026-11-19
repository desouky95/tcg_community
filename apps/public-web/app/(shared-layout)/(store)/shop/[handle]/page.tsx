import Link from "next/link";
import { Badge } from "@tcg/ui-web";
import { notFound } from "next/navigation";
import { CommerceCustomerLink } from "../commerce-customer-link";
import { ProductGallery } from "./_components/product-gallery";
import { PurchasePanel } from "./_components/purchase-panel";
import { MissingListCardSelector } from "../../../../../src/components/missing-list-card-selector";
import { getProductDetail } from "#lib/catalog/product-detail.server";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ cart?: string }>;
}) {
  const { handle } = await params;
  const { cart } = await searchParams;
  const result = await getProductDetail(handle);
  if (result.kind === "not-found") notFound();
  if (result.kind === "unavailable")
    return (
      <section className="mx-auto max-w-360 px-gutter py-section">
        <h1 className="font-display text-3xl font-semibold">
          Product unavailable
        </h1>
        <p className="mt-4">
          We couldn’t load this product. Please try again later.
        </p>
        <Link
          href="/shop"
          className="focus-ring mt-5 inline-block underline underline-offset-4"
        >
          Browse the shop
        </Link>
      </section>
    );
  const { product, regionId } = result;
  const isMissingList = product.metadata?.type === "missing_list" && product.type?.value !== "Coming Soon";
  const description = product.description?.trim();
  const images = [
    ...new Set(
      [
        product.thumbnail,
        ...(product.images ?? []).map((image) => image.url),
      ].filter((image): image is string => !!image),
    ),
  ];
  return (
    <section className="mx-auto max-w-360 px-gutter pb-24 pt-10 text-primary-500 sm:pt-14">
      <CommerceCustomerLink />
      <nav aria-label="Breadcrumb" className="mb-7 text-sm">
        <Link href="/shop" className="focus-ring underline underline-offset-4">
          Shop
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{product.title}</span>
      </nav>
      <h1 className="sr-only">{product.title}</h1>
      {isMissingList && product.type?.value === "Pre-order" && (
        <Badge tone="warning" className="mb-4">Pre-order — ships when available</Badge>
      )}
      {isMissingList ? (
        <MissingListCardSelector
          productId={product.id}
          title={product.title}
          cover={images[0]}
          description={description}
        />
      ) : (
        <div className="flex flex-col items-start gap-8 md:gap-10 lg:flex-row lg:gap-14 xl:gap-20">
          <ProductGallery title={product.title} images={images} />
          <div className="min-w-0 w-full max-w-xl lg:flex-1">
            <h2 className="font-display text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.08] tracking-tight wrap-anywhere">
              {product.title}
            </h2>
            <PurchasePanel
              productId={product.id}
              productType={product.type?.value}
              variants={product.variants ?? []}
              regionId={regionId}
            />
            {cart === "added" && (
              <p role="status" className="mt-5 font-semibold">
                Added to your cart.
              </p>
            )}
            {cart === "error" && (
              <p role="alert" className="mt-5 font-semibold">
                We couldn’t add this item. Please check availability and try
                again.
              </p>
            )}
            {description && (
              <section
                aria-labelledby="product-description"
                className="mt-10 border-t border-wax-line pt-7"
              >
                <h3
                  id="product-description"
                  className="font-display text-lg font-semibold"
                >
                  Description
                </h3>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-primary-400 wrap-anywhere">
                  {description}
                </p>
              </section>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
