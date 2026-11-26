"use client";

import { sdk } from "#lib/clients/medusa";
import { useEffect } from "react";
import { useRegion } from "../../src/providers/RegionProvider";

export default function Test() {
  const { region } = useRegion();
  useEffect(() => {}, []);
  sdk.store.product
    .list({
      fields: region
        ? "*variants.calculated_price,+variants.inventory_quantity,+metadata,*type"
        : "+variants.inventory_quantity,+metadata,*type",
      region_id: region ? region.id : undefined,
    })
    .then(console.log);
  return <div>Test</div>;
}
