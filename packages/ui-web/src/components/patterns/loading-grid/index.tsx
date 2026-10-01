import { cn } from "../../../lib/cn";
import { Skeleton } from "../../primitives/skeleton";

export type LoadingGridProps = {
  count?: number;
  label?: string;
  className?: string;
  itemClassName?: string;
};

export function LoadingGrid({ count = 6, label = "Loading", className, itemClassName }: LoadingGridProps) {
  return (
    <div className={cn("grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-5", className)} aria-label={label} aria-busy="true">
      {Array.from({ length: count }, (_, index) => <Skeleton key={index} className={cn("min-h-48", itemClassName)} />)}
    </div>
  );
}
