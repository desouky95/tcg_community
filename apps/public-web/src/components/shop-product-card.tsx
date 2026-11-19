import { Badge, ProductCard, type ProductCardProps } from "@tcg/ui-web";
import Link from "next/link";
import { MissingListProductCard } from "./missing-list-product-card";
import type { MissingListVisual } from "../lib/catalog/product-card-visuals.server";

type Props = ProductCardProps & {
  productType?: string;
  isMissingList?: boolean;
  missingListVisuals?: MissingListVisual;
};

export function ShopProductCard({
  productType,
  isMissingList,
  missingListVisuals,
  Link: LinkComponent = Link,
  ...props
}: Props) {
  const label = productType === "Coming Soon" || productType === "Pre-order" ? productType : undefined;
  return (
    <div className="relative h-full">
      {isMissingList ? (
        <MissingListProductCard
          href={props.href}
          title={props.title}
          image={missingListVisuals?.thumbnail ?? props.image}
          stickers={missingListVisuals?.stickers ?? []}
          price={props.price}
          soldOut={!label && props.soldOut}
          imageLoading={props.imageLoading}
        />
      ) : (
        <ProductCard {...props} soldOut={!label && props.soldOut} Link={LinkComponent} />
      )}
      {label && <Badge tone="warning" className="pointer-events-none absolute end-3 top-3 bg-paper-50">{label}</Badge>}
    </div>
  );
}
