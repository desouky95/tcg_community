import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { EmptyState } from "../../primitives/empty-state";

export function EmptyStatePanel({ title, description, action, className }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <EmptyState className={cn(className)}>
      <div className="mx-auto grid max-w-md justify-items-center gap-3">
        <h3 className="m-0 font-display text-2xl text-wax-ink">{title}</h3>
        {description && <p className="m-0 text-wax-muted">{description}</p>}
        {action}
      </div>
    </EmptyState>
  );
}
