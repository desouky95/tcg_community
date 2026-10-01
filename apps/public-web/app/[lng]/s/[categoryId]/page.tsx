"use client";

import { SectionHeading } from "@tcg/ui-web";
import * as React from "react";

import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { CategoryRow, ChecklistCard, ChecklistListItem, EmptyStatePanel, LoadingGrid, PublicShell, SearchBox, ViewToggle, buttonStyles } from "@tcg/ui-web";
import { useCategory } from "@tcg/react-query";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = React.use(params);
  const { data: category, isLoading, isError, refetch } = useCategory(categoryId);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const isParent = category?.parentId === -1 || !category?.parentId;
  const query = search.trim().toLowerCase();
  const checklists = (category?.checklists ?? []).filter(item => !query || item.name.toLowerCase().includes(query) || String(item.year).includes(query));

  if (isLoading) return <PublicShell currentPath="/checklists"><LoadingGrid className="p-gutter" label="Loading category" /></PublicShell>;
  if (isError) return <PublicShell currentPath="/checklists"><EmptyStatePanel title="Category could not load." action={<button type="button" className="focus-ring underline" onClick={() => void refetch()}>Try again</button>} /></PublicShell>;

  if (!category)
    return (
      <PublicShell>
        <section className="mx-auto min-h-[70dvh] max-w-3xl border-0 px-5 py-section"><EmptyStatePanel title="Category not found" description="This shelf may have moved, or the catalogue is not available yet." action={<a href="/checklists" className={buttonStyles()}><ArrowLeft aria-hidden="true" /> Back to catalogues</a>} /></section>
      </PublicShell>
    );
  return (
    <PublicShell currentPath="/checklists">
      <div className="mx-auto max-w-[1440px] px-gutter pt-8 pb-section">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-utility uppercase text-wax-muted [&_a:hover]:text-wax-red [&_svg]:size-3.5 rtl:[&_svg]:rotate-180 [&_span]:font-bold [&_span]:text-wax-ink" aria-label="Breadcrumb">
          <a href="/checklists" className="focus-ring">
            Catalogues
          </a>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{category.name}</span>
        </nav>
        <header className="flex flex-col items-stretch justify-between gap-8 border-b-2 border-wax-ink pt-14 pb-8 lg:flex-row lg:items-end lg:pt-28 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:uppercase [&_h1]:leading-none md:[&_h1]:text-display [&>div>p]:mt-6 [&>div>p]:max-w-xl [&>div>p]:leading-relaxed [&>div>p]:text-wax-muted">
          <div>
            <h1>{category.name}</h1>
            <p>
              {isParent
                ? "Explore the sets and series on this shelf."
                : "Browse every catalogue in this series."}
            </p>
          </div>
          {!isParent && (
            <SearchBox id="category-search" label="Search this category" placeholder={`Search in ${category.name}`} value={search} onChange={setSearch} className="max-w-md" />
          )}
        </header>
        <section
          className="py-12 lg:py-24"
          aria-labelledby="category-results-heading"
        >
          <SectionHeading className="border-0 pb-0 [&_span]:font-mono [&_span]:text-utility [&_span]:text-wax-muted">
            <div>
              <h2 id="category-results-heading">
                {isParent ? "Featured collections" : "Sets in this category"}
              </h2>
              <span>{checklists.length} collections</span>
            </div>
            <ViewToggle value={view} onChange={setView} />
          </SectionHeading>
          {checklists.length ? (
            <div
              className={
                view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "border-t border-wax-line"
              }
            >
              {checklists.map((item) =>
                view === "grid" ? (
                  <ChecklistCard
                    key={item.id}
                    href={`/collection/${item.id}`}
                    checklist={item}
                  />
                ) : (
                  <ChecklistListItem
                    key={item.id}
                    href={`/collection/${item.id}`}
                    checklist={item}
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyStatePanel title="No sets match." description="Try another set name or release year." />
          )}
        </section>
        {isParent && category.children.length > 0 && (
          <section
            className="border-t-2 border-wax-ink pt-12 lg:pt-24"
            aria-labelledby="subcategory-heading"
          >
            <SectionHeading >
              <div>
                <h2 id="subcategory-heading">Browse subcategories</h2>
                <p>Move from the main shelf into a specific series or era.</p>
              </div>
            </SectionHeading>
            <div className="border-t border-wax-line">
              {category.children.map((sub, index) => (
                <CategoryRow key={sub.id} href={`/s/${sub.id}`} index={index} name={sub.name} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
