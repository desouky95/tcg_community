import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { CatalogueChecklist, LinkComponent } from "../types";

export function ChecklistListItem({ checklist, href, Link, className }: { checklist: CatalogueChecklist; href: string; Link?: LinkComponent; className?: string }) {
  const content = <><span className="font-mono text-utility text-wax-muted">{checklist.year ?? "-"}</span><span className="font-display text-lg font-bold uppercase">{checklist.name}</span><span className="hidden font-mono text-utility text-wax-muted sm:block">{checklist.totalCards ?? checklist.cardsCount ?? 0} cards</span><ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" /></>;
  const linkClass = cn("focus-ring grid min-h-16 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-wax-line px-3.5 py-3 hover:bg-card hover:text-wax-red sm:grid-cols-[4.5rem_minmax(0,1fr)_auto_auto]", className);
  return Link ? <Link href={href} className={linkClass}>{content}</Link> : <a href={href} className={linkClass}>{content}</a>;
}
