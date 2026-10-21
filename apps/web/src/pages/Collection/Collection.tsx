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

import React from "react";
import { useCollectionPage } from "./collection.hook";
import { useMotionValueEvent, useScroll } from "motion/react";
import useStore from "../../store/useStore";

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
  const setShow = useStore((s) => s.setHideHeader);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setShow(current > previous && current > 150);
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
      <div className="wax-collection-page pb-0">
        <nav
          className="flex items-center gap-1.5 overflow-x-auto py-1.5 font-mono text-utility uppercase whitespace-nowrap text-wax-muted [&_a]:shrink-0 [&_a:hover]:text-wax-red [&_svg]:size-3 [&_svg]:shrink-0 md:gap-2 md:[&_svg]:size-3.5 rtl:[&_svg]:rotate-180"
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

          <span className="max-w-48 truncate font-bold text-wax-ink sm:max-w-80 lg:max-w-none">
            {collection.name}
          </span>
        </nav>

        <header className="wax-collection-header grid items-stretch gap-2.5 bg-wax-paper py-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-x-4 md:gap-y-2 lg:py-3">
          <div className="min-w-0 self-center">
            <p className="mb-0.5 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-wax-red uppercase">
              {collection.category?.name} - {collection.year}
            </p>
            <h1 className="max-w-3xl text-xl leading-tight tracking-[-0.025em] break-words text-wax-ink sm:text-2xl lg:text-3xl">
              {collection.name}
            </h1>
          </div>

          <div className="flex min-w-0 items-start gap-3 md:justify-end">
            {collection.coverImageUrl && (
              <div className="hidden aspect-2/3 w-14 shrink-0 overflow-hidden border border-wax-line bg-wax-input md:block lg:w-16">
                <img
                  src={collection.coverImageUrl}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            )}

            <div
              className={`wax-collection-actions grid min-w-0 flex-1 gap-2 md:flex-none ${currentUser ? "grid-cols-2" : "grid-cols-1"}`}
            >
              <Button
                className="w-full whitespace-nowrap md:w-auto"
                size="sm"
                variant="outline"
                tone="success"
                type="button"
                onClick={handleDownloadExcel}
              >
                <FileSpreadsheet aria-hidden="true" />
                <span className="lg:hidden">Download</span>
                <span className="hidden lg:inline">Download checklist</span>
              </Button>
              {currentUser && (
                <Button
                  asChild
                  className="w-full whitespace-nowrap md:w-auto"
                  size="sm"
                >
                  <Link to={`/collection/${id}/edit`}>
                    <Edit3 aria-hidden="true" />
                    <span className="lg:hidden">Edit</span>
                    <span className="hidden lg:inline">Edit my list</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <section
            className="wax-collection-stats hidden md:col-span-2 md:grid md:grid-cols-4 md:border-t md:border-wax-line [&>div]:gap-1 [&>div]:px-2 [&>div]:py-1.5 [&_strong]:text-base lg:[&_strong]:text-lg"
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
        </header>

        <section className="wax-collection-index" aria-label="Card index">
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

          <div className="z-50 my-2 md:mt-0">
            <label htmlFor="collection-search" className="sr-only">
              Search card index
            </label>
            <Input
              id="collection-search"
              placeholder="Search number, card, type, or section"
              value={table.state.globalFilter}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
            />
          </div>
          <DataTable.Root
            className="lg:h-[60vh]"
            scrollLabel="Scrollable card index"
            viewportClassName="overscroll-auto lg:overscroll-contain"
          >
            {isLoadingCards && (
              <div
                className="grid min-h-64 gap-3 p-4"
                role="status"
                aria-label="Loading card index"
              >
                <span className="sr-only">Loading card index</span>
                <Skeleton className="h-12" aria-hidden="true" />
                <Skeleton className="h-12" aria-hidden="true" />
                <Skeleton className="h-12" aria-hidden="true" />
                <Skeleton className="h-12" aria-hidden="true" />
              </div>
            )}
            {!isLoadingCards && (
              <DataTable.Table className="min-w-245">
                <DataTable.Header sticky>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <DataTable.Row key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort();
                        const sortDirection = header.column.getIsSorted();

                        return (
                          <DataTable.Head
                            key={header.id}
                            className="align-baseline"
                            align={header.index >= 4 ? "center" : "start"}
                            aria-sort={
                              !canSort || !sortDirection
                                ? canSort
                                  ? "none"
                                  : undefined
                                : sortDirection === "asc"
                                  ? "ascending"
                                  : "descending"
                            }
                          >
                            {canSort ? (
                              <button
                                type="button"
                                onClick={header.column.getToggleSortingHandler()}
                                className="flex min-h-8 w-full items-center justify-between gap-2 rounded-sm text-start outline-none focus-visible:ring-3 focus-visible:ring-wax-gold"
                              >
                                <table.FlexRender header={header} />
                                <ArrowUpDown aria-hidden="true" />
                              </button>
                            ) : (
                              <span className="flex min-h-8 items-center">
                                <table.FlexRender header={header} />
                              </span>
                            )}
                          </DataTable.Head>
                        );
                      })}
                    </DataTable.Row>
                  ))}
                </DataTable.Header>

                <DataTable.Body>
                  {table.getRowModel().rows.map((row) => (
                    <DataTable.Row
                      key={row.id}
                      className="hover:bg-primary-500/6"
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        return (
                          <DataTable.Cell
                            key={cell.id}
                            align={index >= 4 ? "center" : "start"}
                          >
                            <table.FlexRender cell={cell} />
                          </DataTable.Cell>
                        );
                      })}
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
      </div>
    </Layout>
  );
}
