import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories, useCategoryMutations } from "@tcg/react-query";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

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
  parentId: z.number(),
});
const formSchema = z.discriminatedUnion("creationType", [
  createSubcategoriesSchema,
  createParentSchema,
]);

type FormSchema = z.infer<typeof formSchema>;

export const useCategoryAddForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories, isLoading: parentsLoading } = useCategories();
  const { createCategory } = useCategoryMutations();

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
  });

  const creationType = useWatch({ control, name: "creationType" });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "subcategories" as never,
  });

  const isParent = creationType === "parent";
  const parentCategories =
    categories?.data.filter((item) => item.parentId === -1) || [];
  const saving = createCategory.isPending;

  const needsParent = creationType === "subcategory" || !isParent;
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.creationType === "parent") {
        createCategory.mutate({
          name: data.category,
          parentId: data.parentId?.toString(),
          subcategories: data.subcategories,
        });
      } else {
        createCategory.mutate({
          name: data.category,
          parentId: data.parentId?.toString(),
          subcategories: data.subcategories,
        });
      }
      navigate("/admin/categories");
    } catch (error) {
      console.error(error);
    }
  });

  return {
    t,
    control,
    onSubmit,
    creationType,
    errors,
    isParent,
    needsParent,
    parentsLoading,
    parentCategories,
    saving,
    fields,
    register,
    append,
    remove,
  };
};
