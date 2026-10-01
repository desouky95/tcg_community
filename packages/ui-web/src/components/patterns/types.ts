import type { ComponentPropsWithoutRef, ComponentType } from "react";

export type LinkComponent = ComponentType<ComponentPropsWithoutRef<"a"> & {
  href: string;
}>;

export type CatalogueChecklist = {
  id: string | number;
  name: string;
  year?: string | number | null;
  type?: string | null;
  totalCards?: number | null;
  cardsCount?: number | null;
  categoryId?: string | number | null;
  category?: { name?: string | null } | null;
  subcategory?: { name?: string | null } | null;
};

export type MarketplaceListing = {
  id: string;
  title: string;
  set: string;
  seller: string;
  price: number;
  condition: string;
  image: string;
};
