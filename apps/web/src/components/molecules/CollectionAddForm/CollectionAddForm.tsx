import {
  Button,
  Field,
  Input,
  PageHeading,
  Select,
  Surface,
} from "@tcg/ui-web";
import { useCollectionAddForm } from "./CollectionAddForm.hook";
import { Link } from "react-router-dom";
import { ArrowLeft, FileImage, FileSpreadsheet } from "lucide-react";
import { Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { CategoriesSelect } from "../../patterns/CategoriesSelect";

export const CollectionAddForm = () => {
  const {
    control,
    handleSubmit,
    saving,
    checklistFile,
    setChecklistFile,
    t,
  } = useCollectionAddForm();

  return (
    <div className="grid gap-8">
      <PageHeading
        title={t("admin.collections.create_title")}
        description={t("admin.collections.create_description")}
        actions={
          <Button asChild variant="outline" tone="primary">
            <Link to="/admin/collections">
              <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              {t("admin.collections.back")}
            </Link>
          </Button>
        }
      />
      <DevTool control={control} />
      <Surface className="rounded-xl p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field
              label={t("admin.collections.xlsx")}
              hint={t("admin.collections.file_create_hint")}
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
                  hint={t("admin.collections.cover_image_create_hint")}
                  invalid={fieldState.invalid}
                  error={fieldState.error?.message}
                >
                  <label className="focus-within:ring-ring/20 flex min-h-28 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-wax-line bg-wax-input/50 p-5 transition-colors hover:border-ring focus-within:ring-4">
                    <FileImage
                      aria-hidden="true"
                      className="size-8 shrink-0 text-primary-600"
                    />
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
