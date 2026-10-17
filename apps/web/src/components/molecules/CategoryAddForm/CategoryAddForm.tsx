import {
  Button,
  Field,
  Input,
  PageHeading,
  RadioGroup,
  Select,
  Surface,
} from "@tcg/ui-web";
import { useCategoryAddForm } from "./CategoryAddForm.hook";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { DevTool } from "@hookform/devtools";
import { Controller } from "react-hook-form";

export function CategoryAddForm() {
  const {
    t,
    control,
    onSubmit,
    creationType,
    errors,
    saving,
    needsParent,
    parentCategories,
    parentsLoading,
    fields,
    append,
    register,
    remove,
  } = useCategoryAddForm();
  return (
    <div className="grid gap-8">
      <PageHeading
        size="xl"
        title={t("admin.categories.create_title")}
        description={t("admin.categories.create_description")}
        actions={
          <Button asChild variant="outline" tone="primary">
            <Link to="/admin/categories">
              <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              {t("admin.categories.back")}
            </Link>
          </Button>
        }
      />
      <DevTool control={control} />
      <Surface className="rounded-xl p-5 sm:p-7">
        <form onSubmit={onSubmit} className="grid gap-6">
          <fieldset className="grid gap-3">
            <legend className="text-xs font-extrabold text-wax-ink">
              {t("admin.categories.creation_type")}
            </legend>
            <div className="flex flex-wrap gap-3">
              <Controller
                control={control}
                name="creationType"
                render={({ field }) => (
                  <RadioGroup.Root
                    {...field}
                    name="creation-type"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    className="flex flex-wrap gap-3"
                  >
                    {(["parent", "subcategory"] as const).map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-wax-line px-3 py-2 text-sm font-semibold text-wax-ink has-[:checked]:border-primary-500 has-[:checked]:bg-primary-500/10"
                      >
                        <RadioGroup.Item
                          value={type}
                          checked={field.value === type}
                        />
                        {t(
                          type === "parent"
                            ? "admin.categories.creation_parent"
                            : "admin.categories.creation_subcategory",
                        )}
                      </label>
                    ))}
                  </RadioGroup.Root>
                )}
              />
            </div>
          </fieldset>

          {creationType === "parent" && (
            <Field
              label={t(`admin.categories.cat_name`)}
              error={errors.category?.message}
              hint={t("admin.categories.parent_name_hint")}
            >
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Input
                    required
                    {...field}
                    placeholder={t("admin.categories.name_placeholder")}
                  />
                )}
              />
            </Field>
          )}

          {needsParent && (
            <Field
              label={t("admin.categories.parent_selector")}
              htmlFor="parent-category"
              error={
                !parentsLoading && parentCategories.length === 0
                  ? t("admin.categories.errors.no_parents")
                  : undefined
              }
            >
              <Controller
                control={control}
                name="parentId"
                render={({ field }) => (
                  <Select.Root
                    required
                    {...field}
                    value={field.value?.toString() ?? ""}
                    disabled={parentsLoading || parentCategories.length === 0}
                    onValueChange={(e) => field.onChange(e)}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content id="parent-category">
                      <Select.Group>
                        <Select.Item
                          value={t("admin.categories.select_parent")}
                          disabled
                        >
                          {parentsLoading
                            ? t("common.loading")
                            : t("admin.categories.select_parent")}
                        </Select.Item>
                        {parentCategories.map((parent) => (
                          <Select.Item
                            key={parent.id}
                            value={String(parent.id)}
                          >
                            {parent.name}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </Field>
          )}

          <section className="grid gap-3 rounded-lg border border-wax-line bg-wax-input/30 p-4">
            <div>
              <h2 className="font-display text-lg font-bold text-wax-ink">
                {t("admin.categories.initial_subcategories")}
              </h2>
              <p className="text-sm text-wax-muted">
                {t("admin.categories.initial_subcategories_hint")}
              </p>
            </div>
            {fields.map((_child, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  aria-label={`${t("admin.categories.new_sub")} ${index + 1}`}
                  {...register(`subcategories.${index}`)}
                  placeholder={t("admin.categories.subcategory_placeholder")}
                />
                <Button
                  type="button"
                  variant="outline"
                  tone="danger"
                  aria-label={t("admin.categories.remove_subcategory", {
                    index: index + 1,
                  })}
                  onClick={() => remove(index)}
                >
                  <X aria-hidden="true" className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              tone="primary"
              className="justify-self-start"
              onClick={() => append("")}
            >
              <Plus aria-hidden="true" className="size-4" />
              {t("admin.categories.add_initial_subcategory")}
            </Button>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wax-line pt-6">
            <Button
              type="submit"
              loading={saving}
              disabled={needsParent && parentsLoading}
            >
              {t("admin.categories.create")}
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}
