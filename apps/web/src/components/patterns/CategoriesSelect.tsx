import { useCategories } from "@tcg/react-query";
import { Select } from "@tcg/ui-web";
import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { useTranslation } from "react-i18next";

type CategoriesSelectProps = ComponentPropsWithoutRef<typeof Select.Root>;
export const CategoriesSelect = forwardRef<
  ComponentRef<typeof Select.Root>,
  CategoriesSelectProps
>(({ ...props }, ref) => {
  const { data, isLoading } = useCategories();

  const categories = data?.data || [];

  const { t } = useTranslation();
  return (
    <Select.Root disabled={isLoading} {...props}>
      <Select.Trigger>
        <Select.Value
          placeholder={t("admin.collections.category_placeholder")}
        />
      </Select.Trigger>
      <Select.Content>
        {categories.map((category, index, arr) => (
          <React.Fragment key={category.slug}>
            <Select.Group>
              <Select.Item disabled value={category.slug} className="font-bold">
                {category.name}
              </Select.Item>
              {category.children.map((child) => (
                <Select.Group key={child.slug}>
                  <Select.Item value={child.slug}>{child.name}</Select.Item>
                </Select.Group>
              ))}
            </Select.Group>
            {index < arr.length - 1 && <Select.Separator />}
          </React.Fragment>
        ))}
      </Select.Content>
    </Select.Root>
  );
});
