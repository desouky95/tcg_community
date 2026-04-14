import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import Layout from "../components/Layout";
import { SectionHeading } from "../components/layout/SectionHeading";
import { ChecklistListItem } from "../components/checklists/ChecklistListItem";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { CategoryListSection } from "../components/checklists/CategoryListSection";
import { useCategories } from "../hooks/useCategories";
import { BackButton } from "../components/common/BackButton";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Checklist } from "../store/useStore";
import { useMemo, useState } from "react";

export default function CategoryDetail() {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { data: checklists, isLoading: loadingChecklists } = useQuery({
    queryKey: ["checklists-all"],
    queryFn: async () => {
      const { data } = await api.getChecklists();
      return data as Checklist[];
    },
  });

  const category = categories
    ?.flatMap((c) => [c, ...(c.children || [])])
    .find((c) => c.id.toString() === categoryId);

  const subcategories = category?.children || [];
  const categoryChecklists = checklists?.filter(
    (c) =>
      c.categoryId.toString() === categoryId ||
      c.subcategoryId?.toString() === categoryId,
  );

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

  const isLoading = loadingCategories || loadingChecklists;

  return (
    <Layout transparent hideNav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center space-x-4 mb-10 rtl:space-x-reverse">
          <BackButton to="/checklists" />
          <div className="w-px h-10 bg-border/50 mx-2" />
          <h1 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center">
            <LayoutGrid className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
            {t("checklists.path")} / {category?.name}
          </h1>
        </div>

        <div className="flex items-start justify-between mb-8">
          <SectionHeading
            title={category?.name || t("common.loading")}
            highlight=""
            align="left"
            className="mb-0! px-0!"
          />

          {!isLoading && subcategories.length === 0 && (
            <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border mt-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={t("checklists.view_list")}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={t("checklists.view_grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 w-3/4 bg-border rounded" />
                <div className="h-3 w-1/2 bg-border rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {subcategories.length > 0 ? (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-x-12 space-y-10">
                {subcategories.map((sub) => (
                  <CategoryListSection
                    key={sub.id}
                    category={sub}
                    counts={counts}
                  />
                ))}
              </div>
            ) : (
              <div className="border-t border-border pt-8">
                {viewMode === "list" ? (
                  <div className="columns-1 sm:columns-2 md:columns-3 gap-x-12">
                    {categoryChecklists?.map((checklist) => (
                      <ChecklistListItem
                        key={checklist.id}
                        checklist={checklist}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categoryChecklists?.map((checklist) => (
                      <MinimalChecklistCard
                        key={checklist.id}
                        checklist={checklist}
                      />
                    ))}
                  </div>
                )}

                {categoryChecklists?.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-border opacity-60">
                    <p className="text-lg font-bold text-muted-foreground">
                      {t("checklists.no_checklists")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
