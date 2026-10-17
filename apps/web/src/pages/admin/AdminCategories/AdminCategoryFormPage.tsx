import type { Category } from "@tcg/api-contracts";
import {
  AlertDialog,
  Button,
  Field,
  Input,
  PageHeading,
  RadioGroup,
  Select,
  Surface,
} from "@tcg/ui-web";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCategories,
  useCategory,
  useCategoryMutations,
} from "../../../hooks/useCategories";
import { DevTool } from "@hookform/devtools";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryEditForm } from "../../../components";

const createParentSchema = z.object({
  category: z.string().min(3, "Category name must be at least 3 characters"),
  creationType: z.literal("parent"),
  subcategories: z.array(z.string()).optional(),
  parentId: z.number().optional(),
});
const createSubcategoriesSchema = z.object({
  creationType: z.literal("subcategory"),
  category: z.array(
    z.string().min(3, "Category name must be at least 3 characters"),
  ),
  subcategories: z.array(z.string()),
});
const formSchema = z.discriminatedUnion("creationType", [
  createParentSchema,
  createSubcategoriesSchema,
]);

type FormSchema = z.infer<typeof formSchema>;

function CategoryForm({ category }: { category?: Category }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories, isLoading: parentsLoading } = useCategories();
  const { createCategory, deleteCategory, updateCategory } =
    useCategoryMutations();
  const isEditing = Boolean(category);
  const {
    control,
    formState: { errors },
    register,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      creationType: "parent",
      category: isEditing ? category?.name : "",
    },
  });
  const creationType = useWatch({ control, name: "creationType" });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "subcategories" as never,
  });

  const isParent = category?.parentId === -1;
  const parentCategories = categories?.data.filter((item) => item.parentId === -1) || [];
  const saving = createCategory.isPending || updateCategory.isPending;

  const needsParent =
    (!isEditing && creationType === "subcategory") || (isEditing && !isParent);
  const handleSubmit = async () => {};

  const handleDelete = async () => {
    if (!category) return;
    try {
      await deleteCategory.mutateAsync(String(category.id));
      toast.success(t("admin.categories.deleted"));
      navigate("/admin/categories");
    } catch {
      toast.error(t("admin.categories.errors.delete"));
    }
  };

  return (
    <div className="grid gap-8">
      <PageHeading
        size="xl"
        title={t(
          category
            ? "admin.categories.edit_title"
            : "admin.categories.create_title",
        )}
        description={t(
          category
            ? isParent
              ? "admin.categories.edit_parent_description"
              : "admin.categories.edit_child_description"
            : "admin.categories.create_description",
        )}
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
        <form onSubmit={handleSubmit} className="grid gap-6">
          {!isEditing && (
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
          )}

          {creationType === "parent" && (
            <Field
              label={t(`admin.categories.cat_name`)}
              error={errors.category?.message}
              hint={
                isEditing && !isParent
                  ? t("admin.categories.child_name_hint")
                  : t("admin.categories.parent_name_hint")
              }
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

          {!isEditing && (
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
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wax-line pt-6">
            <div>
              {category && (
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <Button type="button" variant="outline" tone="danger">
                      <Trash2 aria-hidden="true" className="size-4" />
                      {t("admin.categories.delete")}
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content>
                    <AlertDialog.Title>
                      {t("admin.categories.delete_title")}
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                      {t("admin.categories.delete_description", {
                        name: category.name,
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
                          loading={deleteCategory.isPending}
                          onClick={handleDelete}
                        >
                          {t("admin.categories.confirm_delete")}
                        </Button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              )}
            </div>
            <Button
              type="submit"
              loading={saving}
              disabled={needsParent && parentsLoading}
            >
              {t(category ? "common.update" : "admin.categories.create")}
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}

export default function AdminCategoryFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const categoryQuery = useCategory(id);
  if (isEditing && categoryQuery.isLoading)
    return (
      <p role="status" className="text-wax-muted">
        {t("common.loading")}
      </p>
    );
  if (isEditing && (categoryQuery.isError || !categoryQuery.data))
    return (
      <Surface className="rounded-xl p-6" role="alert">
        <p className="font-bold text-wax-ink">
          {t("admin.categories.errors.not_found")}
        </p>
        <Button asChild variant="outline" tone="primary" className="mt-4">
          <Link to="/admin/categories">{t("admin.categories.back")}</Link>
        </Button>
      </Surface>
    );
  if (isEditing && categoryQuery.isSuccess && categoryQuery.data)
    return <CategoryEditForm category={categoryQuery.data} />;
  return (
    <CategoryForm
      key={categoryQuery.data?.id ?? "new"}
      category={categoryQuery.data ?? undefined}
    />
  );
}
