import {
  columnFilteringFeature,
  createColumnHelper,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import type { Card } from "@tcg/api-contracts";

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  filterFns: {
    includesString: filterFn_includesString,
  },
});
const columnHelper = createColumnHelper<typeof features, Card>();
const columns = columnHelper.columns([
  columnHelper.accessor("number", {
    header: "Number",
    cell: ({ cell, row }) => (
      <span key={cell.id} className="wax-card-number">
        {row.original.number}
      </span>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ cell, row }) => (
      <span key={cell.id} className="font-bold text-wax-ink">
        {row.original.name}
      </span>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("type", {
    header: "Type",
    enableSorting: false,
  }),
  columnHelper.accessor("section", { enableSorting: false }),
  columnHelper.accessor("needCount", {
    header: "Need",
    cell: ({ cell, row }) => (
      <span key={cell.id} className="wax-count wax-count-wanted">
        {row.original.needCount ?? 0}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("holdCount", {
    header: "Need",
    cell: ({ cell, row }) => (
      <span key={cell.id} className="wax-count wax-count-held">
        {row.original.holdCount ?? 0}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("offerCount", {
    header: "Need",
    cell: ({ cell, row }) => (
      <span key={cell.id} className="wax-count wax-count-offered">
        {row.original.offerCount ?? 0}
      </span>
    ),
    enableSorting: true,
  }),
]);

type UseCollectionTableArgs = {
  data: Card[];
  sorting: SortingState;
  filters: ColumnFiltersState;
  query: string;
  onSortingChange: (updater: Updater<SortingState>) => void;
  onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => void;
  onGlobalFilterChange?: (updater: Updater<string>) => void;
};
export const useCollectionTable = ({
  data,
  filters,
  sorting,
  onColumnFiltersChange,
  onSortingChange,
  onGlobalFilterChange,
  query,
}: UseCollectionTableArgs) => {
  const table = useTable({
    key: "cards",
    columns,
    features,
    data,
    manualSorting: true,
    manualFiltering: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableSortingRemoval: true,
    defaultColumn: {
      enableColumnFilter: false,
    },
    state: { sorting, columnFilters: filters, globalFilter: query },
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
  });
  return table;
};
