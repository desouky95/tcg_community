import { Link } from "react-router-dom";
import { ChecklistCard } from "@tcg/ui-web";
import type { ComponentProps } from "react";
import type { Checklist } from "../../store/useStore";

interface MinimalChecklistCardProps {
  checklist: Checklist;
}

const RouterLink = ({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, "to"> & { href: string }) => (
  <Link to={href} {...props} />
);

export const MinimalChecklistCard = ({ checklist }: MinimalChecklistCardProps) => (
  <ChecklistCard
    checklist={checklist}
    href={`/collection/${checklist.id}`}
    Link={RouterLink}
  />
);
