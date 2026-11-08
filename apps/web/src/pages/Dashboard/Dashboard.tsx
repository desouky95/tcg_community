import { Link } from "react-router-dom";
import {
  ChecklistCard,
  ChecklistListItem,
  Field,
  Input,
  LoadingGrid,
  SectionHeading,
  ViewToggle,
  type LinkComponent,
} from "@tcg/ui-web";
import Layout from "../../components/Layout";
import { useDashboard } from "./dashboard.hook";

const RouterLink = Link as unknown as LinkComponent;

export function Dashboard() {
  const {
    categories,
    checklists,
    summaries,
    summariesLoading,
    summariesError,
    categorySelected,
    handleCategorySelect,
    isLoading,
    catalogueError,
    setViewMode,
    t,
    viewMode,
    query,
    setQuery,
    clear,
  } = useDashboard();

  return (
    <Layout>
      <div className="wax-workspace-view">
        <section aria-labelledby="my-collections-heading" className="pb-10 pt-4">
          <SectionHeading>
            <div>
              <h2 id="my-collections-heading">{t("dashboard.my_collections")}</h2>
              <p>{t("dashboard.my_collections_subtitle")}</p>
            </div>
          </SectionHeading>
          {summariesLoading ? (
            <p role="status" className="text-wax-muted">{t("dashboard.my_collections_loading")}</p>
          ) : summariesError ? (
            <p role="alert" className="text-wax-muted">{t("dashboard.my_collections_error")}</p>
          ) : summaries.length === 0 ? (
            <p className="text-wax-muted">{t("dashboard.my_collections_empty")}</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {summaries.map((item) => (
                <li key={item.id}>
                  <Link to={`/collection/${item.slug}`} className="block h-full rounded-xl border border-wax-line bg-wax-paper p-5 transition-colors hover:border-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500">
                    <h3 className="font-display text-lg font-bold text-wax-ink">{item.name}</h3>
                    <p className="mt-4 text-sm font-semibold tabular-nums text-wax-ink">{t("dashboard.owned_progress", { owned: item.owned, total: item.totalCards })}</p>
                    <p className="mt-1 text-sm tabular-nums text-wax-muted">{t("dashboard.collection_activity", { wanted: item.wanted, offered: item.offered })}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <SectionHeading className="border-b-2 border-wax-ink pt-4">
          <div>
            <h2>
              {t("dashboard.catalogue_title", {
                defaultValue: "Explore the full catalogue",
              })}
            </h2>
            <p>
              {t("dashboard.catalogue_subtitle", {
                defaultValue:
                  "Filter by category, then choose the view that fits your collecting session.",
              })}
            </p>
          </div>
          <div className="grid gap-2 justify-items-end">
            <div className="grid shrink-0 gap-1.5 text-start md:text-end [&_span]:text-sm [&_span]:text-wax-muted [&_strong]:font-display [&_strong]:text-2xl [&_strong]:leading-none">
              <span>
                {t("dashboard.workspace_label", {
                  defaultValue: "Collector workspace",
                })}
              </span>
              <strong>
                {checklists.length}{" "}
                {t("dashboard.collection_count", {
                  defaultValue: "collections",
                })}
              </strong>
            </div>
            <ViewToggle
              value={viewMode}
              onChange={setViewMode}
              labels={{
                grid: t("checklists.view_grid"),
                list: t("checklists.view_list"),
              }}
            />
          </div>
        </SectionHeading>

        {isLoading ? (
          <LoadingGrid label={t("dashboard.catalogue_loading")} />
        ) : catalogueError ? (
          <p role="alert" className="py-6 text-wax-muted">{t("dashboard.catalogue_error")}</p>
        ) : (
        <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 space-y-2 rtl:text-right lg:sticky top-[20vh]">
            <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-4">
              {t("dashboard.categories")}
            </h3>
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-start px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!categorySelected ? "bg-primary-500/10 text-primary-500" : "hover:bg-input/50 text-foreground"}`}
            >
              {t("dashboard.all")}
            </button>

            {categories?.data.map((cat) => (
              <div key={cat.id} className="space-y-1 mt-2">
                <button
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-start px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${categorySelected?.category === cat.slug || categorySelected?.parent === cat.slug ? "bg-primary-500/10 text-primary-500" : "hover:bg-input/50 text-foreground"}`}
                >
                  {cat.name}
                </button>
                {(categorySelected?.category === cat.slug ||
                  categorySelected?.parent === cat.slug) &&
                  cat.children.length > 0 && (
                    <div className="ps-6 pe-2 py-1 space-y-1 border-s-2 border-border ms-4 mt-1">
                      {cat.children.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategorySelect(sub.slug)}
                          className={`w-full text-start px-3 py-1.5 rounded-md text-sm transition-colors ${categorySelected.category === sub.slug ? "text-primary-500 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-input/20"}`}
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
            <div>
              <div className="pt-4 lg:sticky top-[10vh] mb-4 shadow-md bg-wax-paper z-10">
                <Field label={t("common.search")}>
                  <Input
                    value={query || ""}
                    name="search"
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                  />
                </Field>
              </div>
              <div>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
                      : "flex flex-col space-y-4 [&>*:first-child]:z-20"
                  }
                >
                  {(checklists || []).map((list) =>
                    viewMode === "grid" ? (
                      <ChecklistCard
                        key={list.id}
                        checklist={list}
                        href={`/collection/${list.slug}`}
                        Link={RouterLink}
                      />
                    ) : (
                      <ChecklistListItem
                        key={list.id}
                        checklist={list}
                        href={`/collection/${list.slug}`}
                        Link={RouterLink}
                      />
                    ),
                  )}
                </div>
                {checklists.length === 0 && (
                  <div className="w-full py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-input/5">
                    <p className="text-muted-foreground font-semibold">
                      {t("dashboard.no_results")}
                    </p>
                    <button
                      onClick={clear}
                      className="mt-4 text-primary-500 hover:text-primary-600 font-bold underline decoration-primary-500/30 underline-offset-4"
                    >
                      {t("dashboard.clear")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </Layout>
  );
}
