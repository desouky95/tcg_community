import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../store/useStore';

interface CategoryListSectionProps {
  category: Category;
  counts?: Record<string, number>;
}

export function CategoryListSection({ category, counts }: CategoryListSectionProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 break-inside-avoid rtl:text-right">
      <Link 
        to={`/s/${category.id}`} 
        className="block mb-2 text-primary font-black uppercase tracking-tight text-sm hover:underline"
      >
        {category.name}
      </Link>
      
      {category.children && category.children.length > 0 ? (
        <div className="space-y-0.5 ml-1 rtl:ml-0 rtl:mr-1">
          {category.children.map((sub) => (
            <Link
              key={sub.id}
              to={`/s/${sub.id}`}
              className="block text-[13px] text-primary hover:underline transition-colors"
            >
              {sub.name}
              {counts && counts[sub.id] !== undefined && (
                <span className="text-muted-foreground ml-1 rtl:ml-0 rtl:mr-1 font-normal italic">
                  ({counts[sub.id]})
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="ml-1 rtl:ml-0 rtl:mr-1">
          {counts && counts[category.id] !== undefined && (
             <span className="text-[12px] text-muted-foreground italic font-medium">
               ({counts[category.id]}) {t('checklists.available')}
             </span>
          )}
        </div>
      )}
    </div>
  );
}
