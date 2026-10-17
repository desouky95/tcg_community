import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { CatalogueChecklist, LinkComponent } from "../types";
import { motion, type Variants } from "motion/react";

const variants: Variants = {
  view: {
    opacity: 1,
  },
  reset: {
    opacity: 0,
  },
};
export function ChecklistListItem({
  checklist,
  href,
  Link,
  className,
}: {
  checklist: CatalogueChecklist;
  href: string;
  Link?: LinkComponent;
  className?: string;
}) {
  const content = (
    <motion.div
      initial={"reset"}
      whileHover={"view"}
      animate={"reset"}
      className="relative focus-ring grid min-h-16 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-wax-line px-3.5 py-3 hover:bg-card hover:text-wax-red sm:grid-cols-[4.5rem_minmax(0,1fr)_auto_auto]"
    >
      <span className="font-mono text-utility text-wax-muted">
        {checklist.year ?? "-"}
      </span>
      <span className="font-display text-lg font-bold uppercase">
        {checklist.name}
      </span>
      <span className="hidden font-mono text-utility text-wax-muted sm:block">
        {checklist.totalCards ?? checklist.cardsCount ?? 0} cards
      </span>
      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
      <motion.div variants={variants} className="absolute inset-e-1/4">
        <img src={checklist.coverImageUrl ?? ""} className="w-44" />
      </motion.div>
    </motion.div>
  );
  const linkClass = cn(
    "focus-ring grid min-h-16 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-wax-line px-3.5 py-3 hover:bg-card hover:text-wax-red sm:grid-cols-[4.5rem_minmax(0,1fr)_auto_auto]",
    className,
  );
  return Link ? (
    <Link href={href}>{content}</Link>
  ) : (
    <a href={href}>{content}</a>
  );
}
