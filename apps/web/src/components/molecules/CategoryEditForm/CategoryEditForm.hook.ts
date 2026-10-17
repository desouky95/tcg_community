import { AxiosError, type Category } from "@tcg/api-contracts";
import { useCategory, useCategoryMutations } from "@tcg/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const useCategoryEditForm = (category: Category) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { addSubcategory, deleteCategory, updateCategory } =
    useCategoryMutations();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "all",
    resetOptions: {
      keepDirtyValues: false,
    },

    values: {
      subCategoriesName: "",
      creationType: "parent",
      category: category.name,
      subCategories: category.children,
      id: category.id,
    },
  });

  const isParent = category.parentId === -1;
  const { state } = useLocation();
  const [p] = useSearchParams();
  const hasParentUrl = !!state?.parent || !!p?.get("p");
  const parentSlug = state?.parent?.slug || p?.get("p");
  const { data } = useCategory(parentSlug);
  const backTo = () => {
    if (hasParentUrl) {
      return `/admin/categories/${parentSlug}/edit`;
    } else {
      return "/admin/categories";
    }
  };
  const handleAddSubcategory = handleSubmit(async (data) => {
    console.log(data);
    addSubcategory.mutateAsync({
      categoryId: String(category.id),
      name: data.subCategoriesName,
    });
  });

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

  const handleUpdate = handleSubmit(async (data) => {
    updateCategory.mutate(
      {
        id: String(category.slug),
        data: {
          name: data.category,
        },
      },
      {
        onSuccess(data) {
          navigate(
            `/admin/categories/${data.data.slug}/edit?${hasParentUrl ? `p=${parentSlug}` : ""}`,
          );
        },
        onError(error) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.error?.details?.[0]?.message);
          }
        },
      },
    );
  });

  return {
    handleAddSubcategory,
    addSubcategory,
    deleteCategory,
    updateCategory,
    handleDelete,
    isParent,
    backTo,
    control,
    errors,
    data,
    t,
    hasParentUrl,
    handleUpdate,
  };
};
