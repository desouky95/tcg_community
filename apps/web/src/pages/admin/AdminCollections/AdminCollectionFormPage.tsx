import type { Checklist } from "@tcg/api-contracts";
import {
  AlertDialog,
  Button,
  Field,
  Input,
  PageHeading,
  Surface,
} from "@tcg/ui-web";
import { ArrowLeft, FileSpreadsheet, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAddChecklist,
  useChecklist,
  useDeleteChecklist,
  useUpdateChecklist,
} from "../../../hooks/useChecklists";
import { useCategories } from "../../../hooks/useCategories";

type CollectionFormValues = {
  name: string;
  year: number;
  type: "card" | "sticker";
  totalCards: number;
  categoryId: string;
  subcategoryId: string;
};

function CollectionForm({ checklist }: { checklist?: Checklist }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading: categoriesLoading } = useCategories();
  const addChecklist = useAddChecklist();
  const updateChecklist = useUpdateChecklist();
  const deleteChecklist = useDeleteChecklist();
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<CollectionFormValues>(() => ({
    name: checklist?.name ?? "",
    year: checklist?.year ?? new Date().getFullYear(),
    type: checklist?.type ?? "sticker",
    totalCards: checklist?.totalCards ?? 0,
    categoryId: checklist ? String(checklist.categoryId) : "",
    subcategoryId: checklist?.subcategoryId
      ? String(checklist.subcategoryId)
      : "",
  }));

  const categories = data?.data || [];
  const parentCategories = categories.filter(
    (category) => category.parentId === -1,
  );
  const selectedCategory = parentCategories.find(
    (category) => String(category.id) === values.categoryId,
  );
  const saving = addChecklist.isPending || updateChecklist.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.categoryId) {
      toast.error(t("admin.collections.errors.category_required"));
      return;
    }

    const payload = new FormData();
    payload.append("name", values.name.trim());
    payload.append("year", String(values.year));
    payload.append("type", values.type);
    payload.append("totalCards", String(values.totalCards));
    payload.append("categoryId", values.categoryId);
    if (values.subcategoryId)
      payload.append("subcategoryId", values.subcategoryId);
    if (file) payload.append("file", file);

    try {
      if (checklist) {
        await updateChecklist.mutateAsync({
          id: String(checklist.id),
          data: payload,
        });
        toast.success(t("admin.collections.updated"));
      } else {
        await addChecklist.mutateAsync(payload);
        toast.success(t("admin.collections.created"));
      }
      navigate("/admin/collections");
    } catch {
      toast.error(t("admin.collections.errors.save"));
    }
  };

  const handleDelete = async () => {
    if (!checklist) return;
    try {
      await deleteChecklist.mutateAsync(String(checklist.id));
      toast.success(t("admin.collections.deleted"));
      navigate("/admin/collections");
    } catch {
      toast.error(t("admin.collections.errors.delete"));
    }
  };

  return (
    <div className="grid gap-8">
      <PageHeading
        title={t(
          checklist
            ? "admin.collections.edit_title"
            : "admin.collections.create_title",
        )}
        description={t(
          checklist
            ? "admin.collections.edit_description"
            : "admin.collections.create_description",
        )}
        actions={
          <Button asChild variant="outline" tone="primary">
            <Link to="/admin/collections">
              <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              {t("admin.collections.back")}
            </Link>
          </Button>
        }
      />

      <Surface className="rounded-xl p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <Field
            label={t("admin.collections.xlsx")}
            hint={
              checklist
                ? t("admin.collections.file_edit_hint")
                : t("admin.collections.file_create_hint")
            }
          >
            <label className="focus-within:ring-ring/20 flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-wax-line bg-wax-input/50 p-5 transition-colors hover:border-ring focus-within:ring-4">
              <FileSpreadsheet
                aria-hidden="true"
                className="size-8 shrink-0 text-primary-600"
              />
              <span className="min-w-0">
                <strong className="block truncate text-sm text-wax-ink">
                  {file?.name ?? t("admin.collections.upload_help")}
                </strong>
                <span className="mt-1 block text-xs text-wax-muted">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : t("admin.collections.file_types")}
                </span>
              </span>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="sr-only"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </Field>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label={t("admin.collections.name")}>
              <Input
                required
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder={t("admin.collections.name_placeholder")}
              />
            </Field>

            <Field label={t("admin.collections.type")}>
              <select
                value={values.type}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    type: event.target.value as CollectionFormValues["type"],
                  }))
                }
                className="ui-control min-h-control w-full rounded-md border border-wax-line bg-wax-input px-3.5 text-wax-ink outline-none focus:border-ring focus:ring-4 focus:ring-ring/20"
              >
                <option value="sticker">
                  {t("admin.collections.sticker")}
                </option>
                <option value="card">{t("admin.collections.card")}</option>
              </select>
            </Field>

            <Field label={t("admin.collections.year")}>
              <Input
                required
                type="number"
                min={1800}
                max={2200}
                value={values.year}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    year: Number(event.target.value),
                  }))
                }
              />
            </Field>

            <Field label={t("admin.collections.total")}>
              <Input
                required
                type="number"
                min={0}
                value={values.totalCards}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    totalCards: Number(event.target.value),
                  }))
                }
              />
            </Field>

            <Field label={t("admin.collections.category")}>
              <select
                required
                disabled={categoriesLoading}
                value={values.categoryId}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    categoryId: event.target.value,
                    subcategoryId: "",
                  }))
                }
                className="ui-control min-h-control w-full rounded-md border border-wax-line bg-wax-input px-3.5 text-wax-ink outline-none focus:border-ring focus:ring-4 focus:ring-ring/20 disabled:opacity-50"
              >
                <option value="">
                  {t("admin.collections.select_category")}
                </option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t("admin.collections.sub")}>
              <select
                disabled={!selectedCategory}
                value={values.subcategoryId}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    subcategoryId: event.target.value,
                  }))
                }
                className="ui-control min-h-control w-full rounded-md border border-wax-line bg-wax-input px-3.5 text-wax-ink outline-none focus:border-ring focus:ring-4 focus:ring-ring/20 disabled:opacity-50"
              >
                <option value="">
                  {t("admin.collections.select_subcategory")}
                </option>
                {selectedCategory?.children?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wax-line pt-6">
            <div>
              {checklist && (
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <Button type="button" variant="outline" tone="danger">
                      <Trash2 aria-hidden="true" className="size-4" />
                      {t("admin.collections.delete")}
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content>
                    <AlertDialog.Title>
                      {t("admin.collections.delete_title")}
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                      {t("admin.collections.delete_description", {
                        name: checklist.name,
                      })}
                    </AlertDialog.Description>
                    <div className="mt-6 flex justify-end gap-3">
                      <AlertDialog.Cancel asChild>
                        <Button variant="outline" tone="primary">
                          {t("common.cancel")}
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <Button
                          tone="danger"
                          loading={deleteChecklist.isPending}
                          onClick={handleDelete}
                        >
                          {t("admin.collections.confirm_delete")}
                        </Button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              )}
            </div>
            <Button type="submit" loading={saving}>
              {t(checklist ? "common.update" : "admin.collections.publish")}
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}

export default function AdminCollectionFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const checklistQuery = useChecklist(id);

  if (isEditing && checklistQuery.isLoading) {
    return (
      <p role="status" className="text-wax-muted">
        {t("common.loading")}
      </p>
    );
  }

  if (isEditing && (checklistQuery.isError || !checklistQuery.data)) {
    return (
      <Surface className="rounded-xl p-6" role="alert">
        <p className="font-bold text-wax-ink">
          {t("admin.collections.errors.not_found")}
        </p>
        <Button asChild variant="outline" tone="primary" className="mt-4">
          <Link to="/admin/collections">{t("admin.collections.back")}</Link>
        </Button>
      </Surface>
    );
  }

  return (
    <CollectionForm
      key={checklistQuery.data?.id ?? "new"}
      checklist={checklistQuery.data}
    />
  );
}
