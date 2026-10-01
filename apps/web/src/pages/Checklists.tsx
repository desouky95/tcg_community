import { SectionHeading } from "@tcg/ui-web";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicShell from "../components/PublicShell";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { useCategories } from "../hooks/useCategories";
import { useChecklists } from "../hooks/useChecklists";
import { CategoryIndexItem, type LinkComponent, EmptyStatePanel, LoadingGrid, SearchBox, TextLink } from "@tcg/ui-web";

const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />;

export default function Checklists() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const setSearch = (value: string) => setSearchParams(previous => {
    const next = new URLSearchParams(previous);
    if (value) next.set("q", value); else next.delete("q");
    return next;
  }, { replace: true });
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
        <SearchBox id="catalogue-search" label="Search catalogues" placeholder={t("checklists.search_placeholder", { defaultValue: "Search sets, years, or categories" })} value={search} onChange={setSearch} className="w-full max-w-xl" />
      </section>

      <section className="mx-auto max-w-[1440px] px-gutter py-section" aria-labelledby="catalogue-results-heading">
        <SectionHeading >
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
          <span className="whitespace-nowrap font-mono text-utility uppercase text-wax-red">{String(filteredChecklists.length).padStart(2, "0")} sets</span>
        </SectionHeading>

        {loadingChecklists ? (
          <LoadingGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" itemClassName="min-h-60" label="Loading catalogues" />
        ) : filteredChecklists.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChecklists.map((checklist) => (
              <MinimalChecklistCard key={checklist.id} checklist={checklist} />
            ))}
          </div>
        ) : (
          <EmptyStatePanel title={<>No catalogue matches “{search}”.</>} description="Try a set name, release year, or category such as football or Pokémon." action={<TextLink asChild><button type="button" onClick={() => setSearch("")}>Clear search</button></TextLink>} />
        )}
      </section>

      <section className="mx-auto max-w-[1440px] px-gutter py-section bg-wax-navy text-wax-paper" aria-labelledby="category-index-heading">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-wax-paper/30 pb-6 md:flex-row md:items-end md:gap-8 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-title [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-wax-paper/80">
          <h2 id="category-index-heading">{t("checklists.all_categories", { defaultValue: "Browse every category" })}</h2>
          <p>Start broad, then narrow the shelf by series or era.</p>
        </div>

        {loadingCategories ? (
          <LoadingGrid count={3} className="grid lg:grid-cols-3" itemClassName="min-h-60 bg-wax-paper/15" label="Loading categories" />
        ) : (
          <div className="grid lg:grid-cols-3">
            {parentCategories?.map((parent, index) => (
              <CategoryIndexItem key={parent.id} Link={RouterLink} index={index} name={parent.name} href={`/s/${parent.slug || parent.id}`} entries={parent.children.map(child => ({ name: child.name, href: `/s/${child.slug || child.id}` }))} />
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
