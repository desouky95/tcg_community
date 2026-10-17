import { Button, DataTable, EmptyState, PageHeading } from "@tcg/ui-web";
import { ArrowRight, Layers, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useChecklists } from "../../../hooks/useChecklists";

export default function AdminCollections() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: checklists = [], isLoading, isError } = useChecklists();

  return (
    <div className="grid gap-8">
      <PageHeading
        size="xl"
        title={t("admin.collections.title")}
        description={t("admin.collections.subtitle")}
        actions={
          <Button asChild>
            <Link to="/admin/collections/new">
              <Plus aria-hidden="true" className="size-4" />
              {t("admin.collections.new")}
            </Link>
          </Button>
        }
      />

      <DataTable.Root>
        <DataTable.Table className="min-w-190">
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head>
                {t("admin.collections.table.checklist")}
              </DataTable.Head>
              <DataTable.Head>{t("admin.collections.category")}</DataTable.Head>
              <DataTable.Head>{t("admin.collections.type")}</DataTable.Head>
              <DataTable.Head>{t("admin.collections.year")}</DataTable.Head>
              <DataTable.Head align="end">
                {t("admin.collections.total")}
              </DataTable.Head>
              <DataTable.Head className="w-14">
                <span className="sr-only">{t("common.edit")}</span>
              </DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body aria-busy={isLoading}>
            {isLoading && (
              <DataTable.LoadingRows columns={6} label={t("common.loading")} />
            )}

            {!isLoading && isError && (
              <DataTable.StateRow colSpan={6}>
                <EmptyState role="alert">
                  <div className="grid justify-items-center gap-3">
                    <Layers
                      aria-hidden="true"
                      className="size-8 text-danger-600"
                    />
                    <div>
                      <p className="font-display text-xl font-bold">
                        {t("admin.collections.error_title")}
                      </p>
                      <p className="mt-1 text-sm text-wax-muted">
                        {t("admin.collections.error_description")}
                      </p>
                    </div>
                  </div>
                </EmptyState>
              </DataTable.StateRow>
            )}

            {!isLoading && !isError && checklists.length === 0 && (
              <DataTable.StateRow colSpan={6}>
                <EmptyState>
                  <div className="grid justify-items-center gap-3">
                    <Layers
                      aria-hidden="true"
                      className="size-8 text-wax-muted"
                    />
                    <div>
                      <p className="font-display text-xl font-bold">
                        {t("admin.collections.empty_title")}
                      </p>
                      <p className="mt-1 text-sm text-wax-muted">
                        {t("admin.collections.empty_description")}
                      </p>
                    </div>
                  </div>
                </EmptyState>
              </DataTable.StateRow>
            )}

            {!isLoading &&
              !isError &&
              checklists.map((checklist) => {
                const editPath = `/admin/collections/${checklist.id}/edit`;
                return (
                  <DataTable.Row
                    key={checklist.id}
                    interactive
                    onClick={() => navigate(editPath)}
                  >
                    <DataTable.Cell>
                      <Link
                        to={editPath}
                        onClick={(event) => event.stopPropagation()}
                        className="focus-ring inline-flex items-center gap-3 font-bold text-wax-ink"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-500/10 text-primary-600">
                          <Layers aria-hidden="true" className="size-4" />
                        </span>
                        {checklist.name}
                      </Link>
                    </DataTable.Cell>
                    <DataTable.Cell className="text-sm text-wax-muted">
                      <span className="block font-semibold text-wax-ink">
                        {checklist.category?.name ??
                          t("admin.collections.uncategorized")}
                      </span>
                      <span>
                        {checklist.category?.parent?.name ??
                          t("admin.collections.no_subcategory")}
                      </span>
                    </DataTable.Cell>
                    <DataTable.Cell className="text-sm font-semibold capitalize text-wax-ink">
                      {t(`admin.collections.${checklist.type}`)}
                    </DataTable.Cell>
                    <DataTable.Cell className="font-mono text-sm tabular-nums text-wax-ink">
                      {checklist.year}
                    </DataTable.Cell>
                    <DataTable.Cell
                      align="end"
                      className="font-mono text-sm tabular-nums text-wax-ink"
                    >
                      {checklist.totalCards}
                    </DataTable.Cell>
                    <DataTable.Cell align="end">
                      <ArrowRight
                        aria-hidden="true"
                        className="inline size-4 text-wax-muted transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>
    </div>
  );
}
