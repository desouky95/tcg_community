import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import Layout from "../components/Layout";
import { useMemo } from "react";
import { SectionHeading } from "../components/layout/SectionHeading";
import { CategoryListSection } from "../components/checklists/CategoryListSection";
import { useCategories } from "../hooks/useCategories";
import { useTranslation } from "react-i18next";
import type { Checklist } from "../store/useStore";

export default function Checklists() {
  const { t } = useTranslation();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const { data: checklists, isLoading: loadingChecklists } = useQuery({
    queryKey: ["checklists-all"],
    queryFn: async () => {
      const { data } = await api.getChecklists();
      return data as Checklist[];
    },
  });

  const isLoading = loadingCategories || loadingChecklists;

  // Calculate counts for categories and subcategories
  const counts = useMemo(() => {
    if (!checklists) return {};
    const map: Record<string, number> = {};
    checklists.forEach((c) => {
      if (c.categoryId) {
        const catId = c.categoryId.toString();
        map[catId] = (map[catId] || 0) + 1;
      }
      if (c.subcategoryId) {
        const subId = c.subcategoryId.toString();
        map[subId] = (map[subId] || 0) + 1;
      }
    });
    return map;
  }, [checklists]);

  const filteredCategories = categories;

  return (
    <Layout transparent hideNav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border">
          <SectionHeading
            title={t("checklists.all_collections")}
            highlight=""
            subtitle={t("checklists.browse_subtitle")}
            align="left"
            className="mb-2 px-0"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="h-4 w-2/3 bg-border rounded-lg" />
                <div className="space-y-1.5 ml-2">
                  <div className="h-3 w-3/4 bg-border/50 rounded" />
                  <div className="h-3 w-1/2 bg-border/50 rounded" />
                  <div className="h-3 w-2/3 bg-border/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-x-12 space-y-10">
            {filteredCategories?.map((category) => (
              <CategoryListSection
                key={category.id}
                category={category}
                counts={counts}
              />
            ))}

            {filteredCategories?.length === 0 && (
              <div className="col-span-full py-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-border opacity-60">
                <p className="text-lg font-bold text-muted-foreground">
                  {t("checklists.no_categories")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
