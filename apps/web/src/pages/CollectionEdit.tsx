import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChecklist } from "../hooks/useChecklists";
import {
  useUserChecklist,
  useUpdateUserChecklist,
} from "../hooks/useUserChecklists";
import Layout from "../components/Layout";
import { Save, FileSpreadsheet } from "lucide-react";
import { BackButton } from "../components/common/BackButton";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import CollectionControls from "../components/collections/CollectionControls";
import {
  Button,
  Checkbox,
  Field,
  PageHeading,
  Skeleton,
  Surface,
  Textarea,
} from "@tcg/ui-web";

export default function CollectionEdit() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { data: checklist, isLoading: checklistLoading } = useChecklist(id);
  const {
    data: userProgress,
    isLoading: progressLoading,
    refetch: refetchProgress,
  } = useUserChecklist(id!);

  const updateMutation = useUpdateUserChecklist();

  const [missingList, setMissingList] = useState(
    userProgress?.data?.missingList,
  );
  const [duplicatesList, setDuplicatesList] = useState(
    userProgress?.data?.duplicatesList,
  );
  const [collectedList, setCollectedList] = useState(
    userProgress?.data?.collectedList,
  );
  const [treatEmptyAsMissing, setTreatEmptyAsMissing] = useState(true);
  const [revision, setRevision] = useState(0);
  const [preview, setPreview] = useState<{
    file: File;
    version: number;
    previewToken: string;
    entries: unknown[];
    issues: { row: number; message: string }[];
    treatEmptyAsMissing: boolean;
  }>();
  const [importPending, setImportPending] = useState(false);

  useEffect(() => {
    setMissingList(userProgress?.data?.missingList);
    setDuplicatesList(userProgress?.data?.duplicatesList);
    setCollectedList(userProgress?.data?.collectedList);
  }, [userProgress?.data]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;
    setImportPending(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("treatEmptyAsMissing", String(treatEmptyAsMissing));
      const response = await api.http.post(
        `/user-checklists/${id}/import/preview`,
        formData,
      );
      setPreview({ file, ...response.data.data, treatEmptyAsMissing });
    } catch {
      toast.error(
        "Could not preview this file. Start the collection first and check the spreadsheet.",
      );
    } finally {
      setImportPending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const commitImport = async () => {
    if (!preview || !id) return;
    setImportPending(true);
    try {
      const formData = new FormData();
      formData.append("file", preview.file);
      formData.append(
        "treatEmptyAsMissing",
        String(preview.treatEmptyAsMissing),
      );
      formData.append("expectedVersion", String(preview.version));
      formData.append("previewToken", preview.previewToken);
      await api.http.post(`/user-checklists/${id}/import/commit`, formData);
      await refetchProgress();
      setPreview(undefined);
      void queryClient.invalidateQueries({
        queryKey: ["collection-summaries"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["checklists", "cards", id],
      });
      setRevision((value) => value + 1);
      toast.success(t("collection_edit.import_success"));
    } catch {
      toast.error(
        "Could not import. The collection may have changed; preview the file again.",
      );
    } finally {
      setImportPending(false);
    }
  };

  const handleSave = async () => {
    if (!id || updateMutation.isPending) return;
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          missingList,
          duplicatesList,
          collectedList,
        },
      });
      void queryClient.invalidateQueries({
        queryKey: ["collection-summaries"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["checklists", "cards", id],
      });
      setRevision((value) => value + 1);
    } catch {
      // The mutation reports the error; preserve the current edits for retry.
    }
  };

  const loading = checklistLoading || progressLoading;

  if (loading) {
    return (
      <Layout>
        <div
          role="status"
          aria-label={t("common.loading")}
          className="grid gap-6"
        >
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </Layout>
    );
  }

  if (!checklist) {
    return (
      <Layout>
        <div className="text-center py-20 text-muted-foreground">
          {t("collection.not_found")}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="wax-workspace-view mx-auto grid w-full max-w-screen-2xl gap-8">
        <div className="flex min-w-0 items-start gap-3 border-b border-wax-line pb-6 sm:gap-4">
          <BackButton />
          <PageHeading
            className="min-w-0 flex-1"
            size="xl"
            title={t("collection_edit.title")}
            description={checklist.name}
            actions={
              <Button
                type="submit"
                form="collection-edit-form"
                loading={updateMutation.isPending}
              >
                <Save className="size-4" aria-hidden="true" />
                {updateMutation.isPending
                  ? t("common.loading")
                  : t("collection_edit.save")}
              </Button>
            }
          />
        </div>

        <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
          <div className="grid min-w-0 gap-6">
            <Surface className="rounded-xl p-4 sm:p-7">
              <form
                id="collection-edit-form"
                className="grid min-w-0 gap-6 sm:gap-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSave();
                }}
              >
                <Field
                  label={t("collection_edit.missing_list")}
                  hint={t("collection_edit.missing_hint")}
                >
                  <Textarea
                    value={missingList ?? ""}
                    onChange={(event) => setMissingList(event.target.value)}
                    placeholder="1, 2(2), 3(4)..."
                    className="min-h-32 text-base leading-relaxed sm:text-sm"
                  />
                </Field>
                <Field
                  label={t("collection_edit.duplicates")}
                  hint={t("collection_edit.duplicates_hint")}
                >
                  <Textarea
                    value={duplicatesList ?? ""}
                    onChange={(event) => setDuplicatesList(event.target.value)}
                    placeholder="10, 15, 22(2), 104..."
                    className="min-h-32 text-base leading-relaxed sm:text-sm"
                  />
                </Field>
                <Field label={t("collection_edit.my_collection")}>
                  <Textarea
                    value={collectedList ?? ""}
                    onChange={(event) => setCollectedList(event.target.value)}
                    placeholder="1, 2, 3, 5, 6, 7, 8..."
                    className="min-h-32 text-base leading-relaxed sm:text-sm"
                  />
                </Field>
              </form>
            </Surface>

            <Surface className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl p-4 sm:p-5">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleExcelImport}
                accept=".xlsx, .xls"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                loading={importPending}
              >
                <FileSpreadsheet className="size-4" aria-hidden="true" />
                {t("collection_edit.import_excel")}
              </Button>
              <label
                htmlFor="treatEmptyAsMissing"
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-wax-ink"
              >
                <Checkbox
                  id="treatEmptyAsMissing"
                  checked={treatEmptyAsMissing}
                  onCheckedChange={(checked) =>
                    setTreatEmptyAsMissing(checked === true)
                  }
                />
                {t("collection_edit.treat_empty_as_missing")}
              </label>
            </Surface>

            {preview && (
              <Surface
                role="region"
                className="grid gap-3 rounded-xl p-5"
                aria-label="Import preview"
              >
                <h2 className="font-display text-lg font-bold">
                  Import preview
                </h2>
                <p className="text-sm text-wax-muted">
                  {preview.entries.length} valid rows; {preview.issues.length}{" "}
                  errors.
                </p>
                {preview.issues.length > 0 && (
                  <ul className="grid gap-1 text-sm">
                    {preview.issues.map((issue, index) => (
                      <li key={`${issue.row}-${index}`}>
                        Row {issue.row}: {issue.message}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    disabled={importPending || preview.issues.length > 0}
                    onClick={commitImport}
                  >
                    Import valid preview
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={importPending}
                    onClick={() => setPreview(undefined)}
                  >
                    Cancel
                  </Button>
                </div>
              </Surface>
            )}
          </div>

          <aside className="min-w-0 wrap-anywhere">
            {id && (
              <CollectionControls
                id={id}
                revision={revision}
                onChanged={() => {
                  void refetchProgress();
                }}
              />
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}
