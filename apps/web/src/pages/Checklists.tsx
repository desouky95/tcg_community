import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicShell from "../components/PublicShell";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { useCategories } from "../hooks/useCategories";
import { useChecklists } from "../hooks/useChecklists";
import type { Category } from "../store/useStore";

export default function Checklists() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: checklists, isLoading: loadingChecklists } = useChecklists();

  const filteredChecklists = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return checklists?.slice(0, 9) ?? [];
    return (checklists ?? []).filter((checklist) =>
      checklist.name.toLowerCase().includes(query) ||
      String(checklist.year).includes(query) ||
      checklist.category?.name.toLowerCase().includes(query) ||
      checklist.subcategory?.name.toLowerCase().includes(query),
    );
  }, [checklists, search]);

  const parentCategories = categories?.filter(
    (category) => category.parentId === -1 || !category.parentId,
  );

  return (
    <PublicShell>
      <section className="wax-public-hero wax-public-hero-catalogue">
        <div>
          <h1>Find the set.<br />Know the card.</h1>
          <p>
            Explore catalogues by game, season, and set. Keep card numbers and
            collection context close before you trade.
          </p>
        </div>
        <label className="wax-catalogue-search" htmlFor="catalogue-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search catalogues</span>
          <input
            id="catalogue-search"
            type="search"
            placeholder={t("checklists.search_placeholder", { defaultValue: "Search sets, years, or categories" })}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span className="wax-search-hint">SET / YEAR</span>
        </label>
      </section>

      <section className="wax-public-section" aria-labelledby="catalogue-results-heading">
        <div className="wax-public-section-heading">
          <div>
            <h2 id="catalogue-results-heading">
              {search ? "Search results" : t("checklists.relevant_collections", { defaultValue: "Featured collections" })}
            </h2>
            <p>
              {search
                ? `${filteredChecklists.length} catalogue${filteredChecklists.length === 1 ? "" : "s"} match your search.`
                : t("checklists.relevant_subtitle", { defaultValue: "A useful place to start browsing." })}
            </p>
          </div>
          <span className="wax-result-count">{String(filteredChecklists.length).padStart(2, "0")} sets</span>
        </div>

        {loadingChecklists ? (
          <div className="wax-checklist-grid" aria-label="Loading catalogues">
            {[...Array(6)].map((_, index) => <div key={index} className="wax-public-skeleton wax-checklist-skeleton" />)}
          </div>
        ) : filteredChecklists.length > 0 ? (
          <div className="wax-checklist-grid">
            {filteredChecklists.map((checklist) => (
              <MinimalChecklistCard key={checklist.id} checklist={checklist} />
            ))}
          </div>
        ) : (
          <div className="wax-public-empty">
            <h3>No catalogue matches “{search}”.</h3>
            <p>Try a set name, release year, or category such as football or Pokémon.</p>
            <button type="button" className="wax-text-link focus-ring" onClick={() => setSearch("")}>Clear search</button>
          </div>
        )}
      </section>

      <section className="wax-category-index" aria-labelledby="category-index-heading">
        <div className="wax-category-index-heading">
          <h2 id="category-index-heading">{t("checklists.all_categories", { defaultValue: "Browse every category" })}</h2>
          <p>Start broad, then narrow the shelf by series or era.</p>
        </div>

        {loadingCategories ? (
          <div className="wax-category-columns" aria-label="Loading categories">
            {[...Array(3)].map((_, index) => <div key={index} className="wax-public-skeleton wax-category-skeleton" />)}
          </div>
        ) : (
          <div className="wax-category-columns">
            {parentCategories?.map((parent, index) => (
              <article key={parent.id} className="wax-category-column">
                <span className="wax-category-number">{String(index + 1).padStart(2, "0")}</span>
                <Link to={`/s/${parent.slug || parent.id}`} className="wax-category-parent focus-ring">
                  <span>{parent.name}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
                {parent.children.length > 0 && (
                  <ul>
                    {parent.children.map((child: Category) => (
                      <li key={child.id}>
                        <Link to={`/s/${child.slug || child.id}`} className="focus-ring">{child.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
