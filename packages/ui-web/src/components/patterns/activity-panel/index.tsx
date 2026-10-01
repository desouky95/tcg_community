import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { Skeleton } from "../../primitives/skeleton";

export type ActivityItem = { id: string; name: string; action: string; location: string; time: string; dateTime?: string };
export type ActivityPanelProps = ComponentPropsWithoutRef<"section"> & {
  items: readonly ActivityItem[];
  status?: "ready" | "loading" | "offline" | "error";
  demo?: boolean;
  title?: string;
  action?: ReactNode;
  recovery?: ReactNode;
};
export function ActivityPanel({ items, status = "ready", demo = true, title, action, recovery, className, ...props }: ActivityPanelProps) {
  const message = status === "offline" ? "Activity is offline. Reconnect to see recent exchanges." : status === "error" ? "Activity could not load. Try again." : "No activity yet. Discover collectors in the exchange.";
  return <section {...props} aria-label={title ?? (demo ? "Demo community activity" : "Community activity")} aria-busy={status === "loading"} className={cn("min-h-80 self-center border border-wax-line bg-card p-5 text-card-foreground", className)}>
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-wax-line pb-4">
      <h3 className="font-display text-lg font-bold uppercase">{title ?? "Community activity"}</h3>
      <span className="font-mono text-utility text-wax-muted">{demo ? "DEMONSTRATION" : status === "ready" ? "RECENT" : status.toUpperCase()}</span>
    </header>
    <div className="min-h-48" aria-live="polite">
      {status === "loading" ? <><span className="sr-only">Loading community activity</span>{[0, 1, 2].map(i => <Skeleton key={i} className="my-4 h-12" />)}</> : status !== "ready" || !items.length ? <div className="grid min-h-48 content-center gap-3 text-sm"><p>{message}</p>{recovery}</div> :
        <ul>{items.map(item => <li key={item.id} className="flex items-center gap-3 border-b border-wax-line py-4">
          <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center bg-wax-navy font-display text-wax-paper">{item.name.slice(0, 1)}</span>
          <div className="min-w-0 flex-1"><strong className="block break-words text-sm">{item.name}</strong><p className="text-sm text-wax-muted">{item.action}</p><span className="text-utility text-wax-muted">{item.location}</span></div>
          <time dateTime={item.dateTime} className="shrink-0 font-mono text-utility text-wax-muted">{item.time}</time>
        </li>)}</ul>}
    </div>
    {action && <div className="mt-4">{action}</div>}
  </section>;
}
