import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import type { LinkComponent } from "../types";

export type ProductCardProps = Omit<ComponentPropsWithoutRef<"a">, "title"> & {
  href: string;
  title: string;
  image?: string | null;
  price?: string;
  soldOut?: boolean;
  imageLoading?: "eager" | "lazy";
  Link?: LinkComponent;
};

/** A presentation-only product link. Pricing and inventory belong to the caller. */
export function ProductCard({
  href,
  title,
  image,
  price,
  soldOut = false,
  imageLoading = "lazy",
  Link,
  className,
  ...props
}: ProductCardProps) {
  const CardLink = Link ?? "a";

  return (
    <CardLink
      href={href}
      {...props}
      className={cn(
        "group focus-ring flex h-full min-w-0 flex-col rounded-xl text-primary-500",
        className,
      )}
    >
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
          className="absolute start-4 top-4 size-5 bg-primary-500 [clip-path:polygon(50%_0,61%_37%,100%_50%,61%_63%,50%_100%,39%_63%,0_50%,39%_37%)]"
        />
        {image ? (
          <img
            src={image}
            alt=""
            loading={imageLoading}
            className="relative h-full w-full object-contain p-5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105 sm:p-7"
          />
        ) : (
          <div className="relative grid h-full place-items-center p-6 text-center text-sm font-semibold text-primary-500">
            <span className="rounded-md bg-paper-50 px-3 py-2">Image unavailable</span>
          </div>
        )}
        {soldOut && (
          <span className="absolute end-3 top-3 rounded-md bg-primary-500 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-2 pt-4">
        <h2 className="font-display text-sm font-semibold leading-snug [overflow-wrap:anywhere] group-hover:underline group-hover:underline-offset-4 group-focus-visible:underline sm:text-base">
          {title}
        </h2>
        {price && (
          <p className="mt-auto pt-3 font-display text-base font-semibold tabular-nums sm:text-lg">
            {price}
          </p>
        )}
      </div>
    </CardLink>
  );
}
