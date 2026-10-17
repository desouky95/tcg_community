import {
  Button,
  Field,
  Input,
  PageHeading,
  Select,
  Surface,
  Tabs,
} from "@tcg/ui-web";
import { useCollectionEditForm } from "./CollectionEditForm.hook";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileImage, FileSpreadsheet } from "lucide-react";
import { Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import type { Checklist } from "@tcg/api-contracts";
import { useChecklist } from "@tcg/react-query";
import { useTranslation } from "react-i18next";
import { CollectionCardsTable } from "../../checklists/CollectionCardsTable";
import { CategoriesSelect } from "../../patterns/CategoriesSelect";

const EditForm = ({ checklist }: { checklist: Checklist }) => {
  const {
    control,
    handleSubmit,
    saving,
    checklistFile,
    setChecklistFile,
    t,
  } = useCollectionEditForm({ checklist });

  return (
    <div className="grid gap-8">
      <DevTool control={control} />
      <Surface className="rounded-xl p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field
              label={t("admin.collections.xlsx")}
              hint={t("admin.collections.file_edit_hint")}
            >
              <label className="focus-within:ring-ring/20 flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-wax-line bg-wax-input/50 p-5 transition-colors hover:border-ring focus-within:ring-4">
                <FileSpreadsheet
                  aria-hidden="true"
                  className="size-8 shrink-0 text-primary-600"
                />
                <span className="min-w-0">
                  <strong className="block truncate text-sm text-wax-ink">
                    {checklistFile?.name ?? t("admin.collections.upload_help")}
                  </strong>
                  <span className="mt-1 block text-xs text-wax-muted">
                    {checklistFile
                      ? `${(checklistFile.size / 1024).toFixed(1)} KB`
                      : t("admin.collections.file_types")}
                  </span>
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="sr-only"
                  onChange={(event) =>
                    setChecklistFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </Field>
            <Controller
              control={control}
              name="coverImage"
              render={({ field, fieldState }) => (
                <Field
                  label={t("admin.collections.cover_image")}
                  hint={t("admin.collections.cover_image_edit_hint")}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                >
                  <label className="focus-within:ring-ring/20 flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-wax-line bg-wax-input/50 p-5 transition-colors hover:border-ring focus-within:ring-4">
                    {checklist.coverImageUrl && !field.value ? (
                      <img
                        src={checklist.coverImageUrl}
                        alt={checklist.name}
                        className="size-16 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <FileImage
                        aria-hidden="true"
                        className="size-8 shrink-0 text-primary-600"
                      />
                    )}
                    <span className="min-w-0">
                      <strong className="block truncate text-sm text-wax-ink">
                        {field.value?.name ??
                          t("admin.collections.cover_image_upload_help")}
                      </strong>
                      <span className="mt-1 block text-xs text-wax-muted">
                        {field.value
                          ? `${(field.value.size / 1024).toFixed(1)} KB`
                          : t("admin.collections.cover_image_file_types")}
                      </span>
                    </span>
                    <input
                      ref={field.ref}
                      name={field.name}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      aria-label={t("admin.collections.cover_image")}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </Field>
              )}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field
                  label={t("admin.collections.name")}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                >
                  <Input
                    required
                    {...field}
                    placeholder={t("admin.collections.name_placeholder")}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <Field
                  label={t("admin.collections.type")}
                  error={fieldState.error?.message}
                >
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <Select.Trigger>
                      <Select.Value
                        placeholder={t("admin.collections.type_placeholder")}
                      />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        <Select.Item value="sticker" key={"sticker"}>
                          {t("admin.collections.sticker")}
                        </Select.Item>
                        <Select.Item value="card" key={"card"}>
                          {t("admin.collections.card")}
                        </Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Field>
              )}
            />

            <Field label={t("admin.collections.year")}>
              <Controller
                control={control}
                name="year"
                render={({ field }) => (
                  <Input
                    required
                    type="number"
                    min={1800}
                    max={2200}
                    {...field}
                    placeholder={t("admin.collections.year_placeholder")}
                  />
                )}
              />
            </Field>

            <Controller
              control={control}
              name="totalCards"
              render={({ field, fieldState }) => (
                <Field
                  label={t("admin.collections.total")}
                  error={fieldState.error?.message}
                >
                  <Input
                    required
                    type="number"
                    min={0}
                    {...field}
                    placeholder={t("admin.collections.total_placeholder")}
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field
                  label={t("admin.collections.category")}
                  error={fieldState.error?.message}
                >
                  <CategoriesSelect
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </Field>
              )}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wax-line pt-6">
            <Button type="submit" loading={saving}>
              {t("admin.collections.publish")}
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
};

export const CollectionEditForm = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const checklistQuery = useChecklist(id);

  if (checklistQuery.isLoading) {
    return (
      <p role="status" className="text-wax-muted">
        {t("common.loading")}
      </p>
    );
  }

  if (checklistQuery.isError || !checklistQuery.data) {
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
    <>
      <PageHeading
        title={t("admin.collections.edit_title")}
        description={t("admin.collections.edit_description")}
        actions={
          <Button asChild variant="outline" tone="primary">
            <Link to="/admin/collections">
              <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              {t("admin.collections.back")}
            </Link>
          </Button>
        }
      />
      <Tabs.Root defaultValue="form">
        <Tabs.List className="sticky top-0">
          <Tabs.Trigger value="form">
            {t("admin.collections.form")}
          </Tabs.Trigger>
          <Tabs.Trigger value="checklist">
            {t("admin.collections.checklist")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="form">
          <EditForm
            key={checklistQuery.data.id}
            checklist={checklistQuery.data}
          />
        </Tabs.Content>
        <Tabs.Content value="checklist">
          <CollectionCardsTable checklist={checklistQuery.data} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};
