import { ArrowUpRight, Layers } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { CatalogueChecklist, LinkComponent } from "../types";

export function ChecklistCard({ checklist, href, Link, className }: { checklist: CatalogueChecklist; href: string; Link?: LinkComponent; className?: string }) {
  const description = checklist.category?.name || checklist.subcategory?.name
    ? [checklist.category?.name, checklist.subcategory?.name].filter(Boolean).join(" · ")
    : checklist.categoryId ? `Category #${checklist.categoryId}` : undefined;
  const content = (
    <>
      <div className="flex items-center justify-between gap-3 font-mono text-utility uppercase text-wax-muted">{checklist.year && <span>{checklist.year}</span>}<span>{checklist.type === "sticker" ? "Sticker set" : "Card set"}</span></div>
      <div className="my-auto py-8"><Layers className="mb-4 size-6 text-wax-red" aria-hidden="true" /><h3 className="font-display text-3xl font-extrabold uppercase leading-tight">{checklist.name}</h3>{description && <p className="mt-3 text-sm text-wax-muted">{description}</p>}</div>
      <div className="flex items-center justify-between gap-3 border-t border-wax-line pt-3.5 font-mono text-utility uppercase text-wax-muted"><span><strong className="text-wax-ink">{checklist.totalCards ?? checklist.cardsCount ?? 0}</strong> cards</span><ArrowUpRight className="size-4 text-wax-red" aria-hidden="true" /></div>
    </>
  );
  const linkClass = cn("focus-ring flex min-h-60 flex-col border border-wax-line bg-card p-5 text-card-foreground hover:border-wax-red hover:shadow-lifted motion-safe:transition motion-safe:hover:-translate-y-1", className);
  return Link ? <Link href={href} className={linkClass}>{content}</Link> : <a href={href} className={linkClass}>{content}</a>;
}
