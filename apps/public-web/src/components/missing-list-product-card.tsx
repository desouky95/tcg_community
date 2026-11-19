"use client";

import { PackOpening2D } from "@tcg/ui-web";
import Link from "next/link";

export function MissingListProductCard({
  href,
  title,
  image,
  stickers,
  price,
  soldOut = false,
  imageLoading = "lazy",
}: {
  href: string;
  title: string;
  image?: string | null;
  stickers: string[];
  price?: string;
  soldOut?: boolean;
  imageLoading?: "eager" | "lazy";
}) {
  const canOpen = !!image && stickers.length > 0;

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-xl text-primary-500">
      <div className="relative isolate aspect-square overflow-hidden rounded-xl bg-accent-500">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-signature-lime-500 [clip-path:polygon(0_0,63%_0,0_64%)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:-translate-y-2 motion-safe:group-focus-visible:-translate-y-2"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-paper-100 [clip-path:polygon(100%_61%,100%_100%,63%_100%)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:translate-y-2 motion-safe:group-focus-visible:translate-y-2"
        />
        <div
          aria-hidden="true"
          className="absolute inset-s-4 top-4 z-40 size-5 bg-primary-500 [clip-path:polygon(50%_0,61%_37%,100%_50%,61%_63%,50%_100%,39%_63%,0_50%,39%_37%)]"
        />
        {canOpen ? (
          <PackOpening2D
            packImage={image}
            cardImages={stickers}
            rounded
            openButtonLabel="Open pack"
            variant="product-card"
            withShimmer={false}
            withGradient={false}
            className="inset-0"
          />
        ) : image ? (
          <img
            src={image}
            alt=""
            loading={imageLoading}
            className="h-full w-full object-contain p-4 sm:p-6 relative"
          />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-sm font-semibold">
            Pack cover unavailable
          </div>
        )}
        <span className="pointer-events-none absolute start-3 top-3 z-40 rounded-md bg-primary-500 px-2.5 py-1.5 text-xs font-bold text-white">
          Missing list
        </span>
        {soldOut && (
          <span className="pointer-events-none absolute end-3 top-3 z-40 rounded-md bg-primary-500 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-2 pt-4">
        <Link
          href={href}
          className="focus-ring rounded-sm font-display text-sm font-semibold leading-snug group-hover:underline group-hover:underline-offset-4 group-focus-visible:underline sm:text-base"
        >
          {title}
        </Link>
        {price && (
          <p className="mt-auto pt-3 font-display text-base font-semibold tabular-nums sm:text-lg">
            {price}
          </p>
        )}
      </div>
    </article>
  );
}
