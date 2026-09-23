import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import Layout from "../components/Layout";
import { SectionHeading } from "../components/layout/SectionHeading";
import { ChecklistListItem } from "../components/checklists/ChecklistListItem";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { BackButton } from "../components/common/BackButton";
import { LayoutGrid, List as ListIcon, Search, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../store/useStore";

export default function CategoryDetail() {
  const { t } = useTranslation();
  const { categoryId: idOrSlug } = useParams<{ categoryId: string }>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", idOrSlug],
    queryFn: async () => {
      const { data } = await api.getCategory(idOrSlug!);
      return data as Category;
    },
    enabled: !!idOrSlug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-muted rounded-xl" />
            <div className="h-12 w-96 bg-muted rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">{t("category_not_found") || "Category not found"}</h1>
          <Link to="/checklists" className="text-primary mt-4 inline-block hover:underline">{t("back_to_checklists") || "Back to all collections"}</Link>
        </div>
      </Layout>
    );
  }

  const isParent = category.parentId === -1 || !category.parentId;
  const filteredChecklists = category.checklists?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.year.toString().includes(search)
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center space-x-4 mb-8 rtl:space-x-reverse">
          <BackButton to="/checklists" />
          <div className="w-px h-10 bg-border/50 mx-2" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/checklists" className="hover:text-primary transition-colors">{t("checklists.path") || "Checklists"}</Link>
            {category.parent && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link to={`/s/${category.parent.slug || category.parent.id}`} className="hover:text-primary transition-colors">
                  {category.parent.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-semibold">{category.name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading
              title={category.name}
              subtitle={isParent ? t("category.parent_subtitle") : t("category.sub_subtitle")}
              align="left"
              className="px-0 mb-0"
            />

            {!isParent && (
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder={t("category.search_in_category") || `Search in ${category.name}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card focus:ring-2 focus:ring-primary/20 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          {isParent ? (
            /* Parent Category Layout */
            <div className="space-y-16">
              {/* Top Grid: Recent/Featured in this Category */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{t("category.featured_collections") || "Featured Collections"}</h3>
                  <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.checklists?.slice(0, 9).map((checklist) => (
                      <MinimalChecklistCard key={checklist.id} checklist={checklist} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {category.checklists?.slice(0, 10).map((checklist) => (
                      <ChecklistListItem key={checklist.id} checklist={checklist} />
                    ))}
                  </div>
                )}
              </section>

              {/* Bottom Grid: Sub-categories */}
              <section>
                <h3 className="text-xl font-bold mb-6">{t("category.browse_subcategories") || "Browse Subcategories"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.children?.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/s/${sub.slug || sub.id}`}
                      className="group p-6 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-center"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <LayoutGrid className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-bold text-lg group-hover:text-primary transition-colors">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Sub-category Layout */
            <section>
               <div className="flex items-center justify-between mb-6">
                  <span className="text-muted-foreground">
                    {filteredChecklists?.length || 0} {t("checklists.collections_found") || "collections found"}
                  </span>
                  <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredChecklists?.map((checklist) => (
                      <MinimalChecklistCard key={checklist.id} checklist={checklist} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredChecklists?.map((checklist) => (
                      <ChecklistListItem key={checklist.id} checklist={checklist} />
                    ))}
                  </div>
                )}

                {filteredChecklists?.length === 0 && (
                  <div className="py-20 text-center opacity-50">
                    <p className="text-lg font-medium">{t("checklists.no_results") || "No collections match your search"}</p>
                  </div>
                )}
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
