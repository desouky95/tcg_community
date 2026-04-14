import { Link } from 'react-router-dom';
import type { Checklist } from '../../store/useStore';

interface ChecklistListItemProps {
  checklist: Checklist;
}

export function ChecklistListItem({ checklist }: ChecklistListItemProps) {
  return (
    <Link
      to={`/collection/${checklist.id}`}
      className="block py-0.5 text-[13px] text-primary hover:underline transition-all truncate rtl:text-right"
      aria-label={`${checklist.name} (${checklist.year})`}
      title={`${checklist.name} (${checklist.year})`}
    >
      <span className="font-medium">{checklist.name}</span>
      {checklist.year && (
        <span className="text-muted-foreground ml-1 rtl:ml-0 rtl:mr-1 font-normal italic">({checklist.year})</span>
      )}
    </Link>
  );
}
