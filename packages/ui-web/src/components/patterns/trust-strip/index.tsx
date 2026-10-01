import { BookOpen, Repeat2, ShieldCheck, Users } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export type TrustPoint = {
  title: string;
  description: string;
  icon: ReactNode;
};
const defaultPoints: readonly TrustPoint[] = [
  {
    title: "Trusted catalogue",
    description: "Sets, numbers, and condition in one place.",
    icon: <ShieldCheck />,
  },
  {
    title: "Know your collection",
    description: "See what you own and what comes next.",
    icon: <BookOpen />,
  },
  {
    title: "Trade with context",
    description: "Find fair swaps with real collectors.",
    icon: <Repeat2 />,
  },
  {
    title: "Built around people",
    description: "A stronger local collector scene.",
    icon: <Users />,
  },
];
export function TrustStrip({
  points = defaultPoints,
  className,
  ...props
}: ComponentPropsWithoutRef<"section"> & { points?: readonly TrustPoint[] }) {
  return (
    <section
      aria-label="Why collectors use TCG Nexus"
      {...props}
      className={cn(
        "mx-auto grid max-w-[1440px] border-y border-wax-line md:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {points.map((point) => (
        <div
          key={point.title}
          className="flex min-h-28 items-center gap-3 border-b border-wax-line p-5 last:border-b-0 md:border-e lg:border-b-0"
        >
          <span
            aria-hidden="true"
            className="shrink-0 text-wax-red [&>svg]:size-6"
          >
            {point.icon}
          </span>
          <div>
            <h3 className="font-display font-bold uppercase">{point.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-wax-muted">
              {point.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
