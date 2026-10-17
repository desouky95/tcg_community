import { Link } from "react-router-dom";
import {
  ArrowUpDown,
  ChevronRight,
  Edit3,
  FileSpreadsheet,
  Filter,
} from "lucide-react";

import {
  Button,
  EmptyStatePanel,
  Field,
  Input,
  PublicShell,
  Select,
  Skeleton,
  TextLink,
  buttonStyles,
  textLinkStyles,
} from "@tcg/ui-web";
import Layout from "../../components/Layout";

import React, { useState } from "react";
import { useCollectionPage } from "./collection.hook";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useMediaQuery } from "@reactuses/core";

export function Collection() {
  const {
    currentUser,
    resetFilters,
    t,
    stats,
    collection,
    isLoading,
    query,
    filters,
    handleDownloadExcel,
    id,
    breadcrumb,
    table,
    meta,
    isLoadingCards,
  } = useCollectionPage();
  const { scrollY } = useScroll();
  const [, setAnimate] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  useMotionValueEvent(scrollY, "change", (v) => {
    setAnimate(v > 400 && isDesktop);
  });

  if (isLoading) {
    return (
      <PublicShell>
        <main
          className="wax-collection-page wax-collection-loading"
          aria-label="Loading collection"
        >
          <Skeleton className="mb-12 h-24 max-w-xl" />
          <Skeleton className="wax-collection-table-skeleton" />
        </main>
      </PublicShell>
    );
  }

  if (!collection) {
    return (
      <PublicShell>
        <main className="mx-auto min-h-[70dvh] max-w-3xl border-0 px-5 py-section">
          <EmptyStatePanel
            title={t("collection.not_found")}
            description="This catalogue may have moved or is not available yet."
            action={
              <Link to="/checklists" className={buttonStyles()}>
                Browse catalogues
              </Link>
            }
          />
        </main>
      </PublicShell>
    );
  }

  const hasActiveFilters =
    query.length > 0 || Object.values(filters).some(Boolean);

  return (
    <Layout>
      <motion.main
        className={`wax-collection-page bg-[url(${collection.coverImageUrl})] relative`}
        animate={
          {
            // padding: animate
            //   ? "0"
            //   : "clamp(0.25rem,1vw,2rem) clamp(6px,2vw, 4rem) clamp(5rem, 8vw, 8rem)",
            // // : "clamp(0.25rem,1vw,2rem) clamp(6px,2vw, 4rem) clamp(5rem, 8vw, 8rem)",
            // transition: { ease: "easeInOut" },
          }
        }
      >
        <nav
          className="flex flex-wrap items-center gap-2 font-mono text-utility uppercase text-wax-muted [&_a:hover]:text-wax-red [&_svg]:size-3.5 rtl:[&_svg]:rotate-180 [&_span]:font-bold [&_span]:text-wax-ink"
          aria-label="Breadcrumb"
        >
          <Link to="/checklists" className="focus-ring">
            Catalogues
          </Link>
          <ChevronRight aria-hidden="true" />
          {breadcrumb.map((item) => (
            <React.Fragment key={item.slug}>
              <Link to={`/?category=${item.slug}`} className="focus-ring">
                {item.name ?? "Collection"}
              </Link>
              <ChevronRight aria-hidden="true" />
            </React.Fragment>
          ))}

          <span>{collection.name}</span>
        </nav>

        <header className="wax-collection-header block bg-wax-paper py-6 z-10">
          <div>
            <p>
              {collection.category?.name} - {collection.year}
            </p>
            <h1 className="text-4xl">{collection.name}</h1>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="w-44 place-self-center lg:col-start-3 lg:place-self-end">
              <img src={collection.coverImageUrl ?? ""} alt={collection.name} />
            </div>
            <section
              className="wax-collection-stats lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2 lg:self-center"
              aria-label="Collection summary"
            >
              <div>
                <span>Indexed cards</span>
                <strong>{stats.cards}</strong>
              </div>
              <div>
                <span>Collector demand</span>
                <strong>{stats.wanted}</strong>
              </div>
              <div>
                <span>Known holds</span>
                <strong>{stats.held}</strong>
              </div>
              <div>
                <span>Trade offers</span>
                <strong>{stats.offered}</strong>
              </div>
            </section>
            <div className="wax-collection-actions lg:col-start-3 lg:row-start-2 lg:place-self-end">
              <Button
                size="sm"
                variant="outline"
                tone="success"
                type="button"
                onClick={handleDownloadExcel}
              >
                <FileSpreadsheet />
                Download Checklist
              </Button>
              {currentUser && (
                <Button asChild size="sm">
                  <Link
                    to={`/collection/${id}/edit`}
                    className={buttonStyles()}
                  >
                    <Edit3 aria-hidden="true" /> Edit my list
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        <section
          className="wax-collection-index"
          aria-labelledby="collection-index-title"
        >
          <details className="wax-collection-advanced">
            <summary className="focus-ring">
              <Filter aria-hidden="true" /> Filters
            </summary>
            <div className="flex">
              {meta?.filters?.map((filter) => (
                <Field label={filter.display} key={filter.name}>
                  <Select.Root>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content position="popper" className="max-h-64">
                      {filter.options.map((option) => (
                        <Select.Item
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.display}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field>
              ))}
            </div>
          </details>

          <div className="sticky top-34 z-50 mb-2">
            <Input
              placeholder="Search number, card, type, or section"
              value={table.state.globalFilter}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
            />
          </div>
          <div
            className="wax-collection-table-wrap h-[60vh] overflow-y-auto"
            tabIndex={0}
            aria-label="Scrollable card index"
          >
            {isLoadingCards && (
              <main
                className="wax-collection-page wax-collection-loading"
                aria-label="Loading collection"
              >
                <Skeleton className="mb-12 h-12" />
                <Skeleton className="mb-12 h-12" />
                <Skeleton className="mb-12 h-12" />
                <Skeleton className="mb-12 h-12" />
              </main>
            )}
            {!isLoadingCards && (
              <table className="wax-collection-table">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="align-baseline"
                          aria-sort={
                            !header.column.getIsSorted()
                              ? "none"
                              : header.column.getIsSorted() === "asc"
                                ? "ascending"
                                : "descending"
                          }
                        >
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            // className="focus-ring"
                          >
                            <table.FlexRender header={header} />
                            {header.column.getCanSort() && (
                              <ArrowUpDown aria-hidden="true" />
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <td key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {table.getRowModel().rows.length === 0 && (
            <EmptyStatePanel
              className="wax-collection-empty"
              title={t("collection.no_match")}
              description="Clear the current search and filters to return to the full card index."
              action={
                <TextLink asChild>
                  <button type="button" onClick={resetFilters}>
                    Reset filters
                  </button>
                </TextLink>
              }
            />
          )}

          <footer className="wax-collection-index-footer">
            <span>{table.getRowModel().rows.length} cards displayed</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className={textLinkStyles()}
              >
                Reset all filters
              </button>
            )}
          </footer>
        </section>
      </motion.main>
    </Layout>
  );
}
