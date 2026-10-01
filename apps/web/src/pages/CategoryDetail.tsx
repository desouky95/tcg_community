import { SectionHeading } from "@tcg/ui-web";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicShell from "../components/PublicShell";
import { ChecklistListItem } from "../components/checklists/ChecklistListItem";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { useCategory } from "../hooks/useCategories";
import { CategoryRow, type LinkComponent, EmptyStatePanel, LoadingGrid, SearchBox, Skeleton, TextLink, ViewToggle, buttonStyles } from "@tcg/ui-web";

const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />;

export default function CategoryDetail() {
  const { t } = useTranslation();
  const { categoryId: idOrSlug } = useParams<{ categoryId: string }>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");

  const { data: category, isLoading } = useCategory(idOrSlug);

  const filteredChecklists = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return category?.checklists ?? [];
    return (category?.checklists ?? []).filter(
      (checklist) =>
        checklist.name.toLowerCase().includes(query) ||
        String(checklist.year).includes(query),
    );
  }, [category?.checklists, search]);

  if (isLoading) {
    return (
      <PublicShell>
        <div
          className="mx-auto max-w-[1440px] px-gutter py-section min-h-[70dvh]"
          aria-label="Loading category"
        >
          <Skeleton className="mb-12 h-24 max-w-xl" />
          <LoadingGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" itemClassName="min-h-60" />
        </div>
      </PublicShell>
    );
  }

  if (!category) {
    return (
      <PublicShell>
        <section className="mx-auto min-h-[70dvh] max-w-3xl border-0 px-5 py-section"><EmptyStatePanel title={t("category_not_found", { defaultValue: "Category not found" })} description="This shelf may have moved, or the catalogue is not available yet." action={<Link to="/checklists" className={buttonStyles()}><ArrowLeft aria-hidden="true" /> Back to catalogues</Link>} /></section>
      </PublicShell>
    );
  }

  const isParent = category.parentId === -1 || !category.parentId;

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1440px] px-gutter pt-8 pb-section">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-utility uppercase text-wax-muted [&_a:hover]:text-wax-red [&_svg]:size-3.5 rtl:[&_svg]:rotate-180 [&_span]:font-bold [&_span]:text-wax-ink" aria-label="Breadcrumb">
          <Link to="/checklists" className="focus-ring">
            Catalogues
          </Link>
          {category.parent && (
            <>
              <ChevronRight aria-hidden="true" />
              <Link
                to={`/s/${category.parent.slug || category.parent.id}`}
                className="focus-ring"
              >
                {category.parent.name}
              </Link>
            </>
          )}
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{category.name}</span>
        </nav>

        <header className="flex flex-col items-stretch justify-between gap-8 border-b-2 border-wax-ink pt-14 pb-8 lg:flex-row lg:items-end lg:pt-28 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:uppercase [&_h1]:leading-none md:[&_h1]:text-display [&>div>p]:mt-6 [&>div>p]:max-w-xl [&>div>p]:leading-relaxed [&>div>p]:text-wax-muted">
          <div>
            <h1>{category.name}</h1>
            <p>
              {isParent
                ? t("category.parent_subtitle", {
                    defaultValue: "Explore the sets and series on this shelf.",
                  })
                : t("category.sub_subtitle", {
                    defaultValue: "Browse every catalogue in this series.",
                  })}
            </p>
          </div>
          {!isParent && (
            <SearchBox id="category-search" label="Search this category" placeholder={t("category.search_in_category", { defaultValue: `Search in ${category.name}` })} value={search} onChange={setSearch} className="max-w-md" />
          )}
        </header>

        <section
          className="py-12 lg:py-24"
          aria-labelledby="category-results-heading"
        >
          <SectionHeading className="border-0 pb-0 [&_span]:font-mono [&_span]:text-utility [&_span]:text-wax-muted">
            <div>
              <h2 id="category-results-heading">
                {isParent
                  ? t("category.featured_collections", {
                      defaultValue: "Featured collections",
                    })
                  : "Sets in this category"}
              </h2>
              <span>{filteredChecklists.length} collections</span>
            </div>
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </SectionHeading>

          {filteredChecklists.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredChecklists
                  .slice(0, isParent ? 9 : undefined)
                  .map((checklist) => (
                    <MinimalChecklistCard
                      key={checklist.id}
                      checklist={checklist}
                    />
                  ))}
              </div>
            ) : (
              <div className="border-t border-wax-line">
                {filteredChecklists
                  .slice(0, isParent ? 10 : undefined)
                  .map((checklist) => (
                    <ChecklistListItem
                      key={checklist.id}
                      checklist={checklist}
                    />
                  ))}
              </div>
            )
          ) : (
            <EmptyStatePanel title={search ? `No sets match “${search}”.` : "No sets are available yet."} description={search ? "Try another set name or release year." : "Check back when this catalogue shelf is populated."} action={search ? <TextLink asChild><button type="button" onClick={() => setSearch("")}>Clear search</button></TextLink> : undefined} />
          )}
        </section>

        {isParent && category.children.length > 0 && (
          <section
            className="border-t-2 border-wax-ink pt-12 lg:pt-24"
            aria-labelledby="subcategory-heading"
          >
            <SectionHeading >
              <div>
                <h2 id="subcategory-heading">
                  {t("category.browse_subcategories", {
                    defaultValue: "Browse subcategories",
                  })}
                </h2>
                <p>Move from the main shelf into a specific series or era.</p>
              </div>
            </SectionHeading>
            <div className="border-t border-wax-line">
              {category.children.map((sub, index) => (
                <CategoryRow key={sub.id} Link={RouterLink} href={`/s/${sub.slug || sub.id}`} index={index} name={sub.name} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
