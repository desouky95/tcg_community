import type { Category } from "@tcg/api-contracts";
import {
  AlertDialog,
  Button,
  EmptyState,
  Field,
  Input,
  PageHeading,
  Surface,
} from "@tcg/ui-web";
import {
  ArrowLeft,
  ChevronRight,
  FolderTree,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { useCategoryEditForm } from "./CategoryEditForm.hook";

export const CategoryEditForm = ({ category }: { category: Category }) => {
  const {
    backTo,
    control,
    data,
    errors,
    handleDelete,
    handleAddSubcategory,
    isParent,
    t,
    hasParentUrl,
    addSubcategory,
    deleteCategory,
    handleUpdate,
    updateCategory,
  } = useCategoryEditForm(category);

  return (
    <div className="grid gap-8">
      <PageHeading
        size="xl"
        title={t("admin.categories.edit_title")}
        description={t("admin.categories.edit_parent_description")}
        actions={
          <Button asChild variant="outline" tone="primary">
            <Link to={backTo()}>
              <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              {hasParentUrl
                ? `${t("common.back")} ${t("common.to")} ${data?.name}`
                : t("admin.categories.back")}
            </Link>
          </Button>
        }
      />
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
          onClick={handleUpdate}
          loading={updateCategory.isPending}
          // disabled={needsParent && parentsLoading}
        >
          {t("common.update")}
        </Button>
      </div>
      {isParent && (
        <Surface className="overflow-hidden rounded-xl">
          <div className="border-b border-wax-line p-5 sm:p-6">
            <h2 className="font-display text-2xl font-bold text-wax-ink">
              {t("admin.categories.subcategories_title")}
            </h2>
            <p className="mt-1 text-sm text-wax-muted">
              {t("admin.categories.subcategories_description")}
            </p>
          </div>
          <form
            onSubmit={handleAddSubcategory}
            className="flex flex-col gap-3 border-b border-wax-line bg-wax-input/30 p-5 sm:flex-row sm:items-end sm:p-6"
          >
            <Field label={t("admin.categories.new_sub")} className="flex-1">
              <Controller
                control={control}
                name="subCategoriesName"
                render={({ field }) => (
                  <Input
                    required
                    {...field}
                    placeholder={t("admin.categories.subcategory_placeholder")}
                  />
                )}
              />
            </Field>
            <Button type="submit" loading={addSubcategory.isPending}>
              <Plus aria-hidden="true" className="size-4" />
              {t("admin.categories.add")}
            </Button>
          </form>
          {category.children?.length ? (
            <ul className="divide-y divide-wax-line">
              {category.children.map((child) => (
                <li key={child.id}>
                  <Link
                    to={`/admin/categories/${child.slug}/edit?p=${category.slug}`}
                    state={{ parent: category }}
                    className="focus-ring group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-primary-500/5 sm:px-6"
                  >
                    <span className="grid size-9 place-items-center rounded-md bg-wax-input text-wax-muted">
                      <Tag aria-hidden="true" className="size-4" />
                    </span>
                    <span className="flex-1 font-semibold text-wax-ink">
                      {child.name}
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 text-wax-muted transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5 sm:p-6">
              <EmptyState>
                <div className="grid justify-items-center gap-2">
                  <FolderTree
                    aria-hidden="true"
                    className="size-7 text-wax-muted"
                  />
                  <p className="font-semibold text-wax-ink">
                    {t("admin.categories.no_subs")}
                  </p>
                </div>
              </EmptyState>
            </div>
          )}
        </Surface>
      )}
    </div>
  );
};
