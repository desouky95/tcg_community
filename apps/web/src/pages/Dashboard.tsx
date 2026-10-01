import { useState, useMemo } from "react";
import { useChecklists } from "../hooks/useChecklists";
import { Link, useSearchParams } from "react-router-dom";
import { ChecklistCard, ChecklistListItem, EmptyStatePanel, LoadingGrid, SectionHeading, ViewToggle, type LinkComponent } from "@tcg/ui-web";
import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks/useCategories";

const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />;

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
      <div className="wax-workspace-view ">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b-2 border-wax-ink pb-6 md:flex-row md:items-end [&_h1]:font-display [&_h1]:text-4xl [&_h1]:uppercase [&_h1]:leading-none md:[&_h1]:text-display [&_p]:mt-3 [&_p]:text-wax-muted">
          <div className="rtl:text-right">
            <h1>{t("dashboard.title")}</h1>
            <p>{t("dashboard.subtitle")}</p>
          </div>
          <div className="grid shrink-0 gap-1.5 text-start md:text-end [&_span]:font-mono [&_span]:text-utility [&_span]:uppercase [&_span]:text-wax-red [&_strong]:font-display [&_strong]:text-3xl [&_strong]:leading-none">
            <span>{t("dashboard.workspace_label", { defaultValue: "Collector workspace" })}</span>
            <strong>{filteredLists.length} {t("dashboard.collection_count", { defaultValue: "collections" })}</strong>
          </div>
        </div>

        <section className="relative mb-14 border-t border-wax-line pt-4 before:absolute before:start-0 before:-top-0.5 before:h-1 before:w-18 before:bg-wax-gold" aria-labelledby="dashboard-relevance-heading">
          <SectionHeading className="border-0 [&>span]:font-mono [&>span]:text-utility [&>span]:text-wax-red">
            <div>
              <h2 id="dashboard-relevance-heading">{t("dashboard.relevant_title", { defaultValue: "Most relevant collections" })}</h2>
              <p>{t("dashboard.relevant_subtitle", { defaultValue: "Start with the shelves that give your collection the clearest next move." })}</p>
            </div>
            <span>{t("dashboard.relevant_label", { defaultValue: "CURATED FROM THE CATALOGUE" })}</span>
          </SectionHeading>

          {isLoading ? (
            <LoadingGrid count={3} label={t("dashboard.loading", { defaultValue: "Loading relevant collections" })} />
          ) : relevantCollections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {relevantCollections.map(collection => <ChecklistCard key={collection.id} checklist={collection} href={`/collection/${collection.id}`} Link={RouterLink} />)}
            </div>
          ) : (
            <EmptyStatePanel title={t("dashboard.relevant_empty", { defaultValue: "Relevant collections will appear here once the catalogue is available." })} />
          )}
        </section>

        <SectionHeading className="border-t-2 border-b-0 border-wax-ink pt-4">
          <div>
            <h2>{t("dashboard.catalogue_title", { defaultValue: "Explore the full catalogue" })}</h2>
            <p>{t("dashboard.catalogue_subtitle", { defaultValue: "Filter by category, then choose the view that fits your collecting session." })}</p>
          </div>
          <ViewToggle value={viewMode} onChange={setViewMode} labels={{ grid: t("checklists.view_grid"), list: t("checklists.view_list") }} />
        </SectionHeading>

        <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-2 rtl:text-right">
          <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-4">
            {t("dashboard.categories")}
          </h3>
          <button
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-start px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === null ? "bg-primary-500/10 text-primary-500" : "hover:bg-input/50 text-foreground"}`}
          >
            {t("dashboard.all")}
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1 mt-2">
              <button
                onClick={() => handleCategorySelect(cat.name)}
                className={`w-full text-start px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === cat.name ? "bg-primary-500/10 text-primary-500" : "hover:bg-input/50 text-foreground"}`}
              >
                {cat.name}
              </button>
              {selectedCategory === cat.name && cat.children.length > 0 && (
                <div className="ps-6 pe-2 py-1 space-y-1 border-s-2 border-border ms-4 mt-1">
                  {cat.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubCategorySelect(sub.name)}
                      className={`w-full text-start px-3 py-1.5 rounded-md text-sm transition-colors ${selectedSub === sub.name ? "text-primary-500 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-input/20"}`}
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
              {filteredLists.map(list => viewMode === "grid"
                ? <ChecklistCard key={list.id} checklist={list} href={`/collection/${list.id}`} Link={RouterLink} />
                : <ChecklistListItem key={list.id} checklist={list} href={`/collection/${list.id}`} Link={RouterLink} />)}
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
