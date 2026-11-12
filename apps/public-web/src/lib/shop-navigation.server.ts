import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "./sdk";

type MenuCategory = {
  id: string;
  name: string;
  href: string;
  image?: string;
  children: MenuCategory[];
  metadata?: Record<string, unknown> | null; 
};
function toMenuCategory(
  category: HttpTypes.StoreProductCategory,
): MenuCategory | undefined {
  if (!category.handle) return undefined;
  const candidate = category.metadata?.image ?? category.metadata?.thumbnail;
  let image: string | undefined;
  if (typeof candidate === "string") {
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:" || url.protocol === "http:")
        image = url.href;
    } catch {
      /* Ignore malformed image metadata. */
    }
  }
  return {
    id: category.id,
    name: category.name,
    href: `/categories/${encodeURIComponent(category.handle)}`,
    image,
    children: (category.category_children ?? []).flatMap((child) => {
      const mapped = toMenuCategory(child);
      return mapped ? [mapped] : [];
    }),
    metadata: category.metadata,
  };
}

export async function getShopNavigation(): Promise<MenuCategory[]> {
  try {
    const categories: MenuCategory[] = [];
    for (let offset = 0; ;) {
      const result = await sdk.store.category
        .list({
          include_descendants_tree: true,
          fields: "*category_children,+metadata",
          limit: 100,
          offset,
        })
        .catch(() => null);
      if (!result) return [];
      categories.push(
        ...result.product_categories
          .filter((category) => !category.parent_category_id)
          .flatMap((category) => {
            const mapped = toMenuCategory(category);
            return mapped ? [mapped] : [];
          }),
      );
      offset += result.product_categories.length;
      if (!result.product_categories.length || offset >= result.count)
        return categories;
    }
  } catch {
    return [];
  }
}
