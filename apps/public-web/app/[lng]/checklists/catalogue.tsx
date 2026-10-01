"use client";
import { useCategories, useChecklists } from "@tcg/react-query";
import {
  CategoryIndexItem,
  ChecklistCard,
  EmptyStatePanel,
  LoadingGrid,
  PublicShell,
  SectionHeading,
} from "@tcg/ui-web";
import { useSearchParams } from "next/navigation";
import { Searchbar } from "./_search";
import { useT } from "next-i18next/client";

export function Catalogue() {
  const [t,i18n] = useT('checklists');

  const {
    data: checklists = [],
    isLoading,
    isError,
    refetch,
  } = useChecklists();
  const search = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const data = checklists.filter(
    (item) =>
      !search ||
      [item.name, item.year, item.category?.name, item.subcategory?.name].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search),
      ),
  );
  const { data: categories = [] } = useCategories();

  return (
    <PublicShell currentPath="/checklists">
      <section className="wax-public-hero">
        <div>
          <h1>
            Find the set.
            <br />
            Know the card.
          </h1>
          <p>
            {t("browse_subtitle")}
            {/* Explore catalogues by game, season, and set. Keep card numbers and
            collection context close before you trade. */}
          </p>
        </div>
        <Searchbar />
      </section>
      <section
        className="mx-auto max-w-360 px-gutter py-section"
        aria-labelledby="catalogue-results-heading"
      >
        <SectionHeading>
          <div>
            <h2 id="catalogue-results-heading">Featured collections</h2>
            <p>A useful place to start browsing.</p>
          </div>
          <span className="whitespace-nowrap font-mono text-utility uppercase text-wax-red">
            {String(data.length).padStart(2, "0")} sets
          </span>
        </SectionHeading>
        {isLoading ? (
          <LoadingGrid label="Loading catalogues" />
        ) : isError ? (
          <EmptyStatePanel
            title="Catalogues could not load."
            description="Try again to reconnect to the catalogue."
            action={
              <button
                type="button"
                className="focus-ring underline"
                onClick={() => void refetch()}
              >
                Try again
              </button>
            }
          />
        ) : data.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <ChecklistCard
                key={item.id}
                checklist={item}
                href={`/collection/${item.id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyStatePanel
            title="No catalogues available."
            description="Try again shortly or browse the category index below."
          />
        )}
      </section>
      <section
        className="mx-auto max-w-360 px-gutter py-section bg-wax-navy text-wax-paper"
        aria-labelledby="category-index-heading"
      >
        <div className="flex flex-col items-start justify-between gap-4 border-b border-wax-paper/30 pb-6 md:flex-row md:items-end md:gap-8 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-title [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-wax-paper/80">
          <h2 id="category-index-heading">Browse every category</h2>
          <p>Start broad, then narrow the shelf by series or era.</p>
        </div>
        <div className="grid lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryIndexItem
              key={category.id}
              index={index}
              name={category.name}
              href={`/s/${category.id}`}
              entries={category.children.map((child) => ({
                name: child.name,
                href: `/s/${child.id}`,
              }))}
            />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
