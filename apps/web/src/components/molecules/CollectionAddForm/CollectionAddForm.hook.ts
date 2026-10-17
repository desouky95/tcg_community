import { zodResolver } from "@hookform/resolvers/zod";
import { useAddChecklist } from "@tcg/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024;
const COVER_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const useCollectionAddForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addChecklist = useAddChecklist();
  const [checklistFile, setChecklistFile] = useState<File | null>(null);

  const schema = z.object({
    name: z.string().min(3, t("admin.collections.errors.name_min")),
    type: z.enum(["sticker", "card"]),
    year: z
      .string()
      .regex(/^\d{4}$/, t("admin.collections.errors.year_format"))
      .refine((value) => Number(value) >= 1800 && Number(value) <= 2200, {
        message: t("admin.collections.errors.year_range"),
      }),
    totalCards: z
      .string()
      .regex(/^\d+$/, t("admin.collections.errors.total_number")),
    categoryId: z.string().min(1, t("admin.collections.errors.category_required")),
    coverImage: z
      .custom<File | null>(
        (value) => value === null || value instanceof File,
        t("admin.collections.errors.cover_type"),
      )
      .refine(
        (file) => !file || COVER_IMAGE_TYPES.includes(file.type),
        t("admin.collections.errors.cover_type"),
      )
      .refine(
        (file) => !file || file.size <= MAX_COVER_IMAGE_SIZE,
        t("admin.collections.errors.cover_size"),
      ),
  });

  type CollectionFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "sticker",
      year: String(new Date().getFullYear()),
      totalCards: "0",
      categoryId: "",
      coverImage: null,
    },
  });

  const saving = addChecklist.isPending;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = new FormData();
      payload.append("name", data.name.trim());
      payload.append("type", data.type);
      payload.append("year", data.year);
      payload.append("totalCards", data.totalCards);
      payload.append("categoryId", data.categoryId);
      if (checklistFile) payload.append("file", checklistFile);
      if (data.coverImage) payload.append("coverImage", data.coverImage);

      await addChecklist.mutateAsync(payload);
      toast.success(t("admin.collections.created"));

      navigate("/admin/collections");
    } catch {
      toast.error(t("admin.collections.errors.save"));
    }
  });
  return {
    saving,
    handleSubmit: onSubmit,
    control,
    checklistFile,
    setChecklistFile,
    t,
    errors,
  };
};
