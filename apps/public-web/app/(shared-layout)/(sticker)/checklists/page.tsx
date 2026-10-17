import { Catalogue } from "./catalogue";
import { Suspense } from "react";
import { LoadingGrid, PublicShell } from "@tcg/ui-web";

export default async function ChecklistsPage() {
  return (
    <Suspense
      fallback={<LoadingGrid label="Loading catalogues" className="p-gutter" />}
    >
      <Catalogue />
    </Suspense>
  );
}
