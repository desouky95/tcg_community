import { useState, useMemo } from "react";
import { useChecklists } from "../hooks/useChecklists";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  List as ListIcon,
  Layers,
  ChevronRight,
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/50 pb-6">
        <div className="rtl:text-right">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-input/20 p-1 rounded-lg border border-border">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            title={t("checklists.view_grid")}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            title={t("checklists.view_list")}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
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
    </Layout>
  );
}
