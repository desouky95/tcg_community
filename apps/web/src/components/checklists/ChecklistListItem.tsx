import { Link } from "react-router-dom";
import { ChecklistListItem as SharedChecklistListItem } from "@tcg/ui-web";
import type { ComponentProps } from "react";
import type { Checklist } from "../../store/useStore";

interface ChecklistListItemProps {
  checklist: Checklist;
}

export function ChecklistListItem({ checklist }: ChecklistListItemProps) {
  return (
    <SharedChecklistListItem
      checklist={checklist}
      href={`/collection/${checklist.id}`}
      Link={({ href, ...props }: Omit<ComponentProps<typeof Link>, "to"> & { href: string }) => (
        <Link to={href} {...props} />
      )}
    />
  );
}
