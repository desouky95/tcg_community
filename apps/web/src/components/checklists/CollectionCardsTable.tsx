import type { Checklist } from "@tcg/api-contracts";
import { DataTable } from "@tcg/ui-web";
import { ArrowRight } from "lucide-react";

export const CollectionCardsTable = ({
  checklist,
}: {
  checklist: Checklist;
}) => {
  return (
    <DataTable.Root
      scrollLabel="Checklist cards"
      viewportClassName="max-h-[calc(100vh-18rem)]"
    >
      <DataTable.Table className="min-w-160">
        <DataTable.Header sticky>
          <DataTable.Row>
            <DataTable.Head>Number</DataTable.Head>
            <DataTable.Head>Name</DataTable.Head>
            <DataTable.Head>Section</DataTable.Head>
            <DataTable.Head>Type</DataTable.Head>
            <DataTable.Head className="w-12">
              <span className="sr-only">Details</span>
            </DataTable.Head>
          </DataTable.Row>
        </DataTable.Header>
        <DataTable.Body>
          {checklist.cards?.map((card) => (
            <DataTable.Row key={card.number}>
              <DataTable.Cell>{card.number}</DataTable.Cell>
              <DataTable.Cell>{card.name}</DataTable.Cell>
              <DataTable.Cell>{card.section}</DataTable.Cell>
              <DataTable.Cell>{card.type}</DataTable.Cell>
              <DataTable.Cell align="end">
                <ArrowRight
                  aria-hidden="true"
                  className="inline size-4 text-wax-muted transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable.Table>
    </DataTable.Root>
  );
};
