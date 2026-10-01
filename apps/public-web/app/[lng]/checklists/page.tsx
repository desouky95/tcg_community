import { Catalogue } from "./catalogue";
import { Suspense } from "react";
import { LoadingGrid, PublicShell } from "@tcg/ui-web";

export default async function ChecklistsPage() {
  return (
    <Suspense
      fallback={
        <PublicShell currentPath="/checklists">
          <LoadingGrid label="Loading catalogues" className="p-gutter" />
        </PublicShell>
      }
    >
      <Catalogue />
    </Suspense>
  );
}

