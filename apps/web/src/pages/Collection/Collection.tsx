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
  DataTable,
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
          <Skeleton className="h-105" />
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
        className={`wax-collection-page bg-[url(${collection.coverImageUrl})] relative pb-0`}
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
          className="flex lg:flex-wrap max-sm:whitespace-nowrap max-sm:overflow-auto max-sm:py-2 items-center gap-2 font-mono text-utility uppercase text-wax-muted [&_a:hover]:text-wax-red [&_svg]:size-3.5 rtl:[&_svg]:rotate-180 [&_span]:font-bold [&_span]:text-wax-ink"
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

        <header className="wax-collection-header block bg-wax-paper max-sm:py-0 z-10">
          <div>
            <p>
              {collection.category?.name} - {collection.year}
            </p>
            <h1 className="text-lg lg:text-4xl">{collection.name}</h1>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 relative">
            <div className="w-20 lg:w-44 max-sm:absolute inset-e-0 bottom-0 lg:visible place-self-center col-start-2 lg:col-start-3 lg:place-self-end">
              <img src={collection.coverImageUrl ?? ""} alt={collection.name} />
            </div>
            <section
              className="wax-collection-stats max-sm:hidden row-start-1 lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2 lg:self-center"
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
            <div className="wax-collection-actions col-start-1 col-end-2 row-start-1 flex flex-row items-center lg:grid  lg:col-start-3 lg:row-start-2 lg:place-self-end">
              <Button
                size="sm"
                variant="outline"
                tone="success"
                type="button"
                onClick={handleDownloadExcel}
              >
                <FileSpreadsheet />
                <span className="hidden lg:visible">Download Checklist</span>
                <span className="visible lg:hidden">Download</span>
              </Button>
              {currentUser && (
                <Button asChild size="sm">
                  <Link
                    to={`/collection/${id}/edit`}
                    className={buttonStyles()}
                  >
                    <Edit3 aria-hidden="true" />
                    <span className="hidden lg:visible">Edit my list</span>
                    <span className="visible lg:hidden">Edit</span>
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
          <details className="wax-collection-advanced max-sm:m-2 max-sm:hidden max-sm:p-0 max-sm:border-0">
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

          <div className="z-50 max-sm:my-2 mb-2">
            <Input
              placeholder="Search number, card, type, or section"
              value={table.state.globalFilter}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
            />
          </div>
          <DataTable.Root
            // className="h-40vh lg:h-[60vh] "
            className="lg:h-[60vh] "
            scrollLabel="Scrollable card index"
            viewportClassName="max-sm:overscroll-auto"
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
              <DataTable.Table className="min-w-245">
                <DataTable.Header sticky>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <DataTable.Row key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <DataTable.Head
                          key={header.id}
                          className="align-baseline"
                          // style={{ width: table.options.meta?.maxWidth }}
                          align={header.index >= 4 ? "center" : "start"}
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
                            className="flex min-h-8 w-full items-center justify-between gap-2 rounded-sm text-start outline-none focus-visible:ring-3 focus-visible:ring-wax-gold"
                          >
                            <table.FlexRender header={header} />
                            {header.column.getCanSort() && (
                              <ArrowUpDown aria-hidden="true" />
                            )}
                          </button>
                        </DataTable.Head>
                      ))}
                    </DataTable.Row>
                  ))}
                </DataTable.Header>

                <DataTable.Body>
                  {table.getRowModel().rows.map((row) => (
                    <DataTable.Row
                      key={row.id}
                      className="hover:bg-primary-500/6"
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <DataTable.Cell
                          key={cell.id}
                          align={index >= 4 ? "center" : "start"}
                        >
                          <table.FlexRender cell={cell} />
                        </DataTable.Cell>
                      ))}
                    </DataTable.Row>
                  ))}
                </DataTable.Body>
              </DataTable.Table>
            )}
          </DataTable.Root>

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

          <footer className="wax-collection-index-footer p-2 min-h-fit border-0">
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
