import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Checklist } from '../../store/useStore';

interface MinimalChecklistCardProps {
  checklist: Checklist;
}

export const MinimalChecklistCard: React.FC<MinimalChecklistCardProps> = ({ checklist }) => {
  const { t } = useTranslation();
  
  return (
    <Link
      to={`/collection/${checklist.id}`}
      className="group bg-card border border-border rounded-2xl p-4 flex flex-col hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3 rtl:flex-row-reverse">
        <span className="text-[10px] font-black px-2 py-0.5 bg-muted rounded-md uppercase tracking-wider text-muted-foreground">
          {checklist.year}
        </span>
        <div className="p-1.5 bg-primary-500/10 text-primary-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <Layers className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-sm font-black mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors rtl:text-right">
        {checklist.name}
      </h3>

      <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between rtl:flex-row-reverse">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
          {checklist.totalCards} {checklist.type === 'sticker' ? t('landing.features.checklists.title') : t('nav.checklists')}
        </span>
      </div>
    </Link>
  );
};
