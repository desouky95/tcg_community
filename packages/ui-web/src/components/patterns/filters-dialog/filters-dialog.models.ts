type FilterItem = {
  name: string;
  display: string;
  value: string | number;
  options: Array<FilterOption>;
};
type FilterOption = {
  display: string;
  value: string | number;
};

type FiltersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters?: Array<FilterItem>;
  onApply?: (filters: Record<string, string | number>) => void;
  onReset?: () => void;
};

export type { FilterItem, FilterOption, FiltersDialogProps };
