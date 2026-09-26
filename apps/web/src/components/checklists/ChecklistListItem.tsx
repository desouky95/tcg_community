import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Checklist } from "../../store/useStore";

interface ChecklistListItemProps {
  checklist: Checklist;
}

export function ChecklistListItem({ checklist }: ChecklistListItemProps) {
  return (
    <Link
      to={`/collection/${checklist.id}`}
      className="wax-checklist-list-item focus-ring"
      aria-label={`${checklist.name} (${checklist.year})`}
      title={`${checklist.name} (${checklist.year})`}
    >
      <span className="wax-checklist-list-year">{checklist.year}</span>
      <span className="wax-checklist-list-name">{checklist.name}</span>
      <span className="wax-checklist-list-total">{checklist.totalCards} cards</span>
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}
