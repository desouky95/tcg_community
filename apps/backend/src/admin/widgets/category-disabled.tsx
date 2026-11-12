import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
    DetailWidgetProps,
    AdminProductCategory
} from "@medusajs/framework/types";
import { Checkbox, Container, Label } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../lib/client";

const ProductWidget = (data: DetailWidgetProps<AdminProductCategory>) => {
  const [disabled, setDisabled] = useState<boolean>(
    !!data.data.metadata?.disabled,
  );
  console.log({ disabled: data.data.metadata?.disabled });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (value: boolean) => {
      return sdk.admin.productCategory.update(data.data.id, {
        metadata: { ...data.data.metadata, disabled: value },
      });
    },
    onMutate() {
      queryClient.invalidateQueries();
    },
  });
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Label htmlFor="controlled-checkbox">Disabled</Label>
        <Checkbox
          id="controlled-checkbox"
          checked={disabled}
          onCheckedChange={(e) => {
            if (typeof e === "string") return;
            setDisabled(e);
            mutate(e);
          }}
        />
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product_category.details.side.before",
});

export default ProductWidget;
