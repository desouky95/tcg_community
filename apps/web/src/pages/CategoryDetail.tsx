import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Grid3X3, List, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicShell from "../components/PublicShell";
import { ChecklistListItem } from "../components/checklists/ChecklistListItem";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { useCategory } from "../hooks/useCategories";

export default function CategoryDetail() {
  const { t } = useTranslation();
  const { categoryId: idOrSlug } = useParams<{ categoryId: string }>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");

  const { data: category, isLoading } = useCategory(idOrSlug);

  const filteredChecklists = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return category?.checklists ?? [];
    return (category?.checklists ?? []).filter((checklist) =>
      checklist.name.toLowerCase().includes(query) || String(checklist.year).includes(query),
    );
  }, [category?.checklists, search]);

  if (isLoading) {
    return (
      <PublicShell>
        <div className="wax-public-section wax-category-loading" aria-label="Loading category">
          <div className="wax-public-skeleton wax-heading-skeleton" />
          <div className="wax-checklist-grid">
            {[...Array(6)].map((_, index) => <div key={index} className="wax-public-skeleton wax-checklist-skeleton" />)}
          </div>
        </div>
      </PublicShell>
    );
  }

  if (!category) {
    return (
      <PublicShell>
        <section className="wax-public-empty wax-public-empty-page">
          <h1>{t("category_not_found", { defaultValue: "Category not found" })}</h1>
          <p>This shelf may have moved, or the catalogue is not available yet.</p>
          <Link to="/checklists" className="wax-button focus-ring"><ArrowLeft aria-hidden="true" /> Back to catalogues</Link>
        </section>
      </PublicShell>
    );
  }

  const isParent = category.parentId === -1 || !category.parentId;

  return (
    <PublicShell>
      <div className="wax-category-page">
        <nav className="wax-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/checklists" className="focus-ring">Catalogues</Link>
          {category.parent && (
            <>
              <ChevronRight aria-hidden="true" />
              <Link to={`/s/${category.parent.slug || category.parent.id}`} className="focus-ring">{category.parent.name}</Link>
            </>
          )}
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{category.name}</span>
        </nav>

        <header className="wax-category-header">
          <div>
            <h1>{category.name}</h1>
            <p>{isParent
              ? t("category.parent_subtitle", { defaultValue: "Explore the sets and series on this shelf." })
              : t("category.sub_subtitle", { defaultValue: "Browse every catalogue in this series." })}
            </p>
          </div>
          {!isParent && (
            <label className="wax-compact-search" htmlFor="category-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search this category</span>
              <input
                id="category-search"
                type="search"
                placeholder={t("category.search_in_category", { defaultValue: `Search in ${category.name}` })}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          )}
        </header>

        <section className="wax-category-results" aria-labelledby="category-results-heading">
          <div className="wax-category-results-bar">
            <div>
              <h2 id="category-results-heading">
                {isParent ? t("category.featured_collections", { defaultValue: "Featured collections" }) : "Sets in this category"}
              </h2>
              <span>{filteredChecklists.length} collections</span>
            </div>
            <div className="wax-view-switch" aria-label="Choose catalogue view">
              <button
                type="button"
                className="focus-ring"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
              ><List aria-hidden="true" /></button>
              <button
                type="button"
                className="focus-ring"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
              ><Grid3X3 aria-hidden="true" /></button>
            </div>
          </div>

          {filteredChecklists.length > 0 ? (
            viewMode === "grid" ? (
              <div className="wax-checklist-grid">
                {filteredChecklists.slice(0, isParent ? 9 : undefined).map((checklist) => (
                  <MinimalChecklistCard key={checklist.id} checklist={checklist} />
                ))}
              </div>
            ) : (
              <div className="wax-checklist-list">
                {filteredChecklists.slice(0, isParent ? 10 : undefined).map((checklist) => (
                  <ChecklistListItem key={checklist.id} checklist={checklist} />
                ))}
              </div>
            )
          ) : (
            <div className="wax-public-empty">
              <h3>{search ? `No sets match “${search}”.` : "No sets are available yet."}</h3>
              <p>{search ? "Try another set name or release year." : "Check back when this catalogue shelf is populated."}</p>
              {search && <button type="button" className="wax-text-link focus-ring" onClick={() => setSearch("")}>Clear search</button>}
            </div>
          )}
        </section>

        {isParent && category.children.length > 0 && (
          <section className="wax-subcategory-section" aria-labelledby="subcategory-heading">
            <div className="wax-public-section-heading">
              <div>
                <h2 id="subcategory-heading">{t("category.browse_subcategories", { defaultValue: "Browse subcategories" })}</h2>
                <p>Move from the main shelf into a specific series or era.</p>
              </div>
            </div>
            <div className="wax-subcategory-list">
              {category.children.map((sub, index) => (
                <Link key={sub.id} to={`/s/${sub.slug || sub.id}`} className="wax-subcategory-row focus-ring">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{sub.name}</strong>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
