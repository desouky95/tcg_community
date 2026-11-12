import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type DiscoveryItem = {
  id: string;
  handle: string;
  name: string;
  image?: string;
};
export function DiscoverySection({
  title,
  items,
  path,
}: {
  title: string;
  items: DiscoveryItem[];
  path: string;
}) {
  if (!items.length) return null;
  return (
    <section className="mt-12" aria-label={title}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <span className="text-sm text-primary-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <p className="mb-2 text-sm text-primary-400">
        Scroll sideways to explore
      </p>
      <div
        tabIndex={0}
        role="region"
        aria-label={`${title}, scroll to see more`}
        className="focus-ring flex gap-3 overflow-x-auto pb-3 sm:gap-4"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${path}/${encodeURIComponent(item.handle)}`}
            className="group focus-ring relative flex min-h-36 w-48 shrink-0 flex-col justify-end overflow-hidden rounded-xl bg-primary-500 p-5 text-white sm:min-h-40 sm:w-60"
          >
            {item.image ? (
              <>
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* <span className="absolute inset-0 bg-primary-500/60" /> */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-accent-500/60 [clip-path:polygon(68%_0,100%_0,100%_100%,29%_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute end-4 top-4 size-5 bg-signature-lime-500/60 [clip-path:polygon(50%_0,61%_37%,100%_50%,61%_63%,50%_100%,39%_63%,0_50%,39%_37%)]"
                />
              </>
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-accent-500 [clip-path:polygon(68%_0,100%_0,100%_100%,29%_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute end-4 top-4 size-5 bg-signature-lime-500 [clip-path:polygon(50%_0,61%_37%,100%_50%,61%_63%,50%_100%,39%_63%,0_50%,39%_37%)]"
                />
              </>
            )}
            <span className="relative flex items-end justify-between gap-2">
              <span className="font-display text-lg font-semibold leading-tight [overflow-wrap:anywhere] group-hover:underline">
                {item.name}
              </span>
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
