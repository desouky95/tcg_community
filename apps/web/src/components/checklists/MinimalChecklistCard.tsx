import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Checklist } from "../../store/useStore";

interface MinimalChecklistCardProps {
  checklist: Checklist;
}

export const MinimalChecklistCard: React.FC<MinimalChecklistCardProps> = ({ checklist }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/collection/${checklist.id}`}
      className="wax-checklist-card focus-ring"
    >
      <div className="wax-checklist-card-meta">
        <span>{checklist.year}</span>
        <span>{checklist.type === "sticker" ? "Sticker set" : "Card set"}</span>
      </div>
      <div className="wax-checklist-card-body">
        <Layers aria-hidden="true" />
        <h3>{checklist.name}</h3>
        <p>
          {checklist.category?.name}
          {checklist.subcategory?.name ? ` · ${checklist.subcategory.name}` : ""}
        </p>
      </div>
      <div className="wax-checklist-card-foot">
        <span>
          <strong>{checklist.totalCards}</strong>{" "}
          {checklist.type === "sticker" ? t("landing.features.checklists.title") : t("nav.checklists")}
        </span>
        <ArrowUpRight aria-hidden="true" />
      </div>
    </Link>
  );
};
