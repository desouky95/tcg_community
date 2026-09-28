import { useState, useMemo } from "react";
import { useChecklists } from "../hooks/useChecklists";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  List as ListIcon,
  Layers,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks/useCategories";

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: checklists = [], isLoading } = useChecklists();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories = [] } = useCategories();
  // Filtering & View State

  const selectedCategory = useMemo(() => {
    return searchParams.get("category");
  }, [searchParams]);
  const selectedSub = useMemo(() => {
    return searchParams.get("sub");
  }, [searchParams]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Compute displayed lists
  const filteredLists = useMemo(() => {
    return checklists.filter((c) => {
      const catMatch = selectedCategory
        ? (c.category?.name || "Uncategorized") === selectedCategory
        : true;
      const subMatch = selectedSub ? c.subcategory?.name === selectedSub : true;
      return catMatch && subMatch;
    });
  }, [checklists, selectedCategory, selectedSub]);

  const relevantCollections = useMemo(() => {
    const relevanceOrder = ["cl1", "cl2", "cl3"];
    return [...filteredLists]
      .sort((a, b) => {
        const aIndex = relevanceOrder.indexOf(a.id);
        const bIndex = relevanceOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      })
      .slice(0, 3);
  }, [filteredLists]);

  const handleCategorySelect = (cat: string | null) => {
    if (cat === selectedCategory) {
      searchParams.delete("sub");
    }
    if (!cat) {
      searchParams.delete("category");
      searchParams.delete("sub");
    } else searchParams.set("category", cat || "");
    setSearchParams(searchParams);
  };
  const handleSubCategorySelect = (sub: string | null) => {
    if (!sub) searchParams.delete("sub");
    else searchParams.set("sub", sub || "");
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      <div className="wax-workspace-view wax-dashboard-view">
        <div className="wax-dashboard-heading">
          <div className="rtl:text-right">
            <h1>{t("dashboard.title")}</h1>
            <p>{t("dashboard.subtitle")}</p>
          </div>
          <div className="wax-dashboard-heading-meta">
            <span>{t("dashboard.workspace_label", { defaultValue: "Collector workspace" })}</span>
            <strong>{filteredLists.length} {t("dashboard.collection_count", { defaultValue: "collections" })}</strong>
          </div>
        </div>

        <section className="wax-dashboard-relevance" aria-labelledby="dashboard-relevance-heading">
          <div className="wax-dashboard-section-heading">
            <div>
              <h2 id="dashboard-relevance-heading">{t("dashboard.relevant_title", { defaultValue: "Most relevant collections" })}</h2>
              <p>{t("dashboard.relevant_subtitle", { defaultValue: "Start with the shelves that give your collection the clearest next move." })}</p>
            </div>
            <span>{t("dashboard.relevant_label", { defaultValue: "CURATED FROM THE CATALOGUE" })}</span>
          </div>

          {isLoading ? (
            <div className="wax-relevance-grid" aria-busy="true" aria-label={t("dashboard.loading", { defaultValue: "Loading relevant collections" })}>
              {[1, 2, 3].map((item) => <div className="wax-relevance-skeleton" key={item} />)}
            </div>
          ) : relevantCollections.length > 0 ? (
            <div className="wax-relevance-grid">
              {relevantCollections.map((collection, index) => (
                <Link to={`/collection/${collection.id}`} className={`wax-relevance-card wax-relevance-card-${index + 1}`} key={collection.id}>
                  <div className="wax-relevance-card-mark">
                    <span>{t("dashboard.relevant_pick", { defaultValue: "CATALOGUE PICK" })}</span>
                    <Layers aria-hidden="true" />
                  </div>
                  <div className="wax-relevance-card-body">
                    <span>{collection.category?.name || t("dashboard.uncategorized", { defaultValue: "Uncategorized" })}</span>
                    <h3>{collection.name}</h3>
                    <p>{collection.subcategory?.name || t("dashboard.collection_shelf", { defaultValue: "Collection shelf" })}</p>
                    <div className="wax-relevance-card-footer">
                      <strong>{collection.totalCards} {t("dashboard.cards", { defaultValue: "cards" })}</strong>
                      <ArrowUpRight aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="wax-relevance-empty">{t("dashboard.relevant_empty", { defaultValue: "Relevant collections will appear here once the catalogue is available." })}</div>
          )}
        </section>

        <div className="wax-dashboard-catalogue-heading">
          <div>
            <h2>{t("dashboard.catalogue_title", { defaultValue: "Explore the full catalogue" })}</h2>
            <p>{t("dashboard.catalogue_subtitle", { defaultValue: "Filter by category, then choose the view that fits your collecting session." })}</p>
          </div>
          <div className="wax-dashboard-view-toggle" role="group" aria-label={t("dashboard.view_label", { defaultValue: "Collection view" })}>
            <button
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "is-active" : ""}
              title={t("checklists.view_grid")}
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid aria-hidden="true" />
              <span>{t("dashboard.grid", { defaultValue: "Grid" })}</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "is-active" : ""}
              title={t("checklists.view_list")}
              aria-pressed={viewMode === "list"}
            >
              <ListIcon aria-hidden="true" />
              <span>{t("dashboard.list", { defaultValue: "List" })}</span>
            </button>
          </div>
        </div>

        <div className="wax-dashboard-catalogue flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-2 rtl:text-right">
          <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-4">
            {t("dashboard.categories")}
          </h3>
          <button
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-left rtl:text-right px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === null ? "bg-primary-500/10 text-primary-500" : "hover:bg-input/50 text-foreground"}`}
          >
            {t("dashboard.all")}
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1 mt-2">
              <button
                onClick={() => handleCategorySelect(cat.name)}
                className={`w-full text-left rtl:text-right px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === cat.name ? "bg-primary-500/10 text-primary-500" : "hover:bg-input/50 text-foreground"}`}
              >
                {cat.name}
              </button>
              {selectedCategory === cat.name && cat.children.length > 0 && (
                <div className="pl-6 pr-2 rtl:pl-2 rtl:pr-6 py-1 space-y-1 border-l-2 rtl:border-l-0 rtl:border-r-2 border-border ml-4 rtl:ml-0 rtl:mr-4 mt-1">
                  {cat.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubCategorySelect(sub.name)}
                      className={`w-full text-left rtl:text-right px-3 py-1.5 rounded-md text-sm transition-colors ${selectedSub === sub.name ? "text-primary-500 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-input/20"}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-card/50 rounded-xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col space-y-4"
              }
            >
              {filteredLists.map((list) => (
                <Link
                  key={list.id}
                  to={`/collection/${list.id}`}
                  className={`group relative bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:border-primary-500/30 block ${viewMode === "list" ? "flex flex-row items-center p-4" : "hover:-translate-y-1"}`}
                >
                  <div
                    className={`${viewMode === "list" ? "flex-1 pl-4 rtl:pl-0 rtl:pr-4" : "p-6"} rtl:text-right`}
                  >
                    <div className="flex items-center justify-between mb-3 rtl:flex-row-reverse">
                      <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase rounded-full tracking-wider">
                        {list.category?.name} / {list.subcategory?.name}
                      </span>
                      {viewMode === "list" && (
                        <span className="text-muted-foreground flex items-center text-sm font-mono bg-input/20 px-3 py-1 rounded-full rtl:flex-row-reverse">
                          <Layers className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 opacity-50" />
                          {list.totalCards}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`font-bold text-foreground group-hover:text-primary-500 transition-colors ${viewMode === "list" ? "text-2xl" : "text-xl mb-1"}`}
                    >
                      {list.name}
                    </h3>

                    {viewMode === "grid" && (
                      <p className="text-sm text-muted-foreground flex items-center font-mono mt-4 border-t border-border/50 pt-4 rtl:flex-row-reverse">
                        <Layers className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 opacity-50" />
                        {list.totalCards}
                      </p>
                    )}
                  </div>
                  {viewMode === "list" && (
                    <div className="p-4 pl-8 rtl:pl-4 rtl:pr-8 border-l rtl:border-l-0 rtl:border-r border-border/50 text-muted-foreground group-hover:text-primary-500 transition-colors">
                      <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                    </div>
                  )}
                </Link>
              ))}
              {filteredLists.length === 0 && (
                <div className="w-full py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-input/5">
                  <p className="text-muted-foreground font-semibold">
                    {t("dashboard.no_results")}
                  </p>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className="mt-4 text-primary-500 hover:text-primary-600 font-bold underline decoration-primary-500/30 underline-offset-4"
                  >
                    {t("dashboard.clear")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
}
