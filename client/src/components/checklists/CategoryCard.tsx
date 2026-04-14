import { Link } from "react-router-dom";
import type { Category } from "../../store/useStore";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="bg-card border border-border rounded-4xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group">
      <div className="p-8">
        <Link
          to={`/s/${category.id}`}
          className="block mb-6 group-hover:translate-x-1 transition-transform"
        >
          <h3 className="text-2xl font-black tracking-tight uppercase flex items-center">
            {category.name}
            <ChevronRight className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
        </Link>

        {category.children && category.children.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                to={`/s/${sub.id}`}
                className="flex items-center p-3 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all text-sm font-bold group/sub"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2 group-hover/sub:scale-125 transition-transform" />
                {sub.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm font-medium italic">
            Browse all checklists in this category
          </p>
        )}
      </div>
    </div>
  );
}
