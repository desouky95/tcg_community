import { useCategories } from "@tcg/react-query";
import {
  Button,
  DataTable,
  EmptyState,
  FiltersDialog,
  IconButton,
  PageHeading,
} from "@tcg/ui-web";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  FolderTree,
  Plus,
  Tag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function AdminCategories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categories, isLoading, isError } = useCategories();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const parentCategories =
    categories?.data.filter((category) => category.parentId === -1) || [];

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const handleFiltersChange = (filters: Record<string, string | number>) => {
    for (const [key, value] of Object.entries(filters)) {
      searchParams.set(key, value.toString());
    }
    // navigate({ search: searchParams.toString() });
    // navigate({search: searchParams.toString()});
    setSearchParams(searchParams, { replace: true });
  };

  const handleResetFilters = () => {
    const searchParams = new URLSearchParams();
    setSearchParams(searchParams);
  };

  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const filters = useMemo(() => {
    return (categories?.meta?.filters || []).map((filter) => ({
      ...filter,
      value: searchParams.get(filter.name) ?? "",
    }));
  }, [searchParams, categories?.meta?.filters]);

  console.log("filters", filters);
  return (
    <div className="grid gap-8">
      <PageHeading
        size="xl"
        title={t("admin.categories.title")}
        description={t("admin.categories.subtitle")}
        leftActions={
          <Button onClick={() => setFiltersModalOpen((prev) => !prev)}>
            <Filter aria-hidden="true" className="size-4" />
            Filters
          </Button>
        }
        actions={
          <Button asChild>
            <Link to="/admin/categories/new">
              <Plus aria-hidden="true" className="size-4" />
              {t("admin.categories.new_cat")}
            </Link>
          </Button>
        }
      />
      <FiltersDialog
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        filters={filters}
        onApply={handleFiltersChange}
        onReset={handleResetFilters}
      />
      <DataTable.Root scrollLabel={t("admin.categories.title")}>
        <DataTable.Table className="min-w-160">
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head className="w-16">
                <span className="sr-only">
                  {t("admin.categories.expand_label")}
                </span>
              </DataTable.Head>
              <DataTable.Head>
                {t("admin.categories.table.name")}
              </DataTable.Head>
              <DataTable.Head>
                {t("admin.categories.table.kind")}
              </DataTable.Head>
              <DataTable.Head align="end">
                {t("admin.categories.table.subcategories")}
              </DataTable.Head>
              <DataTable.Head className="w-14">
                <span className="sr-only">{t("common.edit")}</span>
              </DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body aria-busy={isLoading}>
            {isLoading && (
              <DataTable.LoadingRows columns={5} label={t("common.loading")} />
            )}

            {!isLoading && isError && (
              <DataTable.StateRow colSpan={5}>
                <EmptyState role="alert">
                  <div className="grid justify-items-center gap-3">
                    <FolderTree
                      aria-hidden="true"
                      className="size-8 text-danger-600"
                    />
                    <div>
                      <p className="font-display text-xl font-bold">
                        {t("admin.categories.error_title")}
                      </p>
                      <p className="mt-1 text-sm text-wax-muted">
                        {t("admin.categories.error_description")}
                      </p>
                    </div>
                  </div>
                </EmptyState>
              </DataTable.StateRow>
            )}

            {!isLoading && !isError && parentCategories.length === 0 && (
              <DataTable.StateRow colSpan={5}>
                <EmptyState>
                  <div className="grid justify-items-center gap-3">
                    <FolderTree
                      aria-hidden="true"
                      className="size-8 text-wax-muted"
                    />
                    <div>
                      <p className="font-display text-xl font-bold">
                        {t("admin.categories.empty_title")}
                      </p>
                      <p className="mt-1 text-sm text-wax-muted">
                        {t("admin.categories.empty_description")}
                      </p>
                    </div>
                  </div>
                </EmptyState>
              </DataTable.StateRow>
            )}

            {!isLoading &&
              !isError &&
              parentCategories.flatMap((category) => {
                const id = String(category.slug);
                const isExpanded = expandedIds.has(id);
                const children = category.children ?? [];
                const editPath = `/admin/categories/${id}/edit`;
                const rows = [
                  <DataTable.Row
                    key={id}
                    interactive
                    onClick={() => navigate(editPath)}
                  >
                    <DataTable.Cell className="py-3">
                      <IconButton
                        variant="ghost"
                        aria-label={t(
                          isExpanded
                            ? "admin.categories.collapse"
                            : "admin.categories.expand",
                          { name: category.name },
                        )}
                        aria-expanded={isExpanded}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleExpanded(id);
                        }}
                        disabled={children.length === 0}
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </IconButton>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Link
                        to={editPath}
                        onClick={(event) => event.stopPropagation()}
                        className="focus-ring inline-flex items-center gap-3 font-bold text-wax-ink"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-wax-gold/20 text-amber-700 dark:text-wax-gold">
                          <FolderTree aria-hidden="true" className="size-4" />
                        </span>
                        {category.name}
                      </Link>
                    </DataTable.Cell>
                    <DataTable.Cell className="text-sm text-wax-muted">
                      {t("admin.categories.parent")}
                    </DataTable.Cell>
                    <DataTable.Cell
                      align="end"
                      className="font-mono text-sm tabular-nums text-wax-ink"
                    >
                      {children.length}
                    </DataTable.Cell>
                    <DataTable.Cell align="end">
                      <ChevronRight
                        aria-hidden="true"
                        className="inline size-4 text-wax-muted transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      />
                    </DataTable.Cell>
                  </DataTable.Row>,
                ];

                if (isExpanded) {
                  rows.push(
                    ...children.map((child) => {
                      const childPath = `/admin/categories/${child.slug}/edit?p=${category.slug}`;
                      return (
                        <DataTable.Row
                          key={child.id}
                          interactive
                          tone="muted"
                          onClick={() => navigate(childPath)}
                        >
                          <DataTable.Cell className="py-3" />
                          <DataTable.Cell className="py-3 ps-12">
                            <Link
                              to={childPath}
                              onClick={(event) => event.stopPropagation()}
                              className="focus-ring inline-flex items-center gap-3 font-semibold text-wax-ink"
                            >
                              <Tag
                                aria-hidden="true"
                                className="size-4 text-wax-muted"
                              />
                              {child.name}
                            </Link>
                          </DataTable.Cell>
                          <DataTable.Cell className="py-3 text-sm text-wax-muted">
                            {t("admin.categories.child")}
                          </DataTable.Cell>
                          <DataTable.Cell
                            align="end"
                            className="py-3 font-mono text-sm text-wax-muted"
                          >
                            —
                          </DataTable.Cell>
                          <DataTable.Cell align="end" className="py-3">
                            <ChevronRight
                              aria-hidden="true"
                              className="inline size-4 text-wax-muted transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    }),
                  );
                }

                return rows;
              })}
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>
    </div>
  );
}
