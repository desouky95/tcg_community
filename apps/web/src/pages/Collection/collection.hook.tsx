import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useStore, { type Card } from "../../store/useStore";
import { useMemo, useState } from "react";
import { saveAs } from "file-saver";
import {
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useCollectionPageApis } from "./collection.api";
import { useChecklistCards } from "@tcg/react-query";
import { useCollectionTable } from "./collection.table";
import { useDebounceFn } from "@reactuses/core";

export const useCollectionPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { category, collection, download, isLoading } = useCollectionPageApis(
    id!,
  );
  const currentUser = useStore((state) => state.user);
  const [queryUI, setQueryUI] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { run } = useDebounceFn((value) => {
    setQuery(value);
  }, 500);

  const { data: cardsData, isLoading: isLoadingCards } = useChecklistCards(id, {
    withParams: true,
    query: {
      search: query,
      sort:
        sorting.length == 0
          ? ""
          : `${sorting[0].desc ? "-" : ""}${sorting[0].id}`,
      // query : query[0].value
    },
  });
  const cards = useMemo(() => cardsData?.data ?? [], [cardsData?.data]);

  const table = useCollectionTable({
    data: cardsData?.data ?? [],
    filters,
    sorting,
    onSortingChange: (updater) => {
      setSorting(updater);
    },

    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
    },
    query: queryUI,
    onGlobalFilterChange(updater) {
      setQueryUI(updater);
      run(updater);
    },
  });

  const uniqueValues = (key: keyof Card) =>
    Array.from(new Set(cards.map((card) => String(card[key] ?? ""))))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const filteredAndSortedCards = useMemo(() => {
    const normalizedQuery = "";
    const result = cards.filter((card) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [card.number, card.name, card.type, card.section].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedQuery),
        );

      return matchesQuery;
    });
    return result;
  }, [cards]);

  const stats = useMemo(
    () => ({
      cards: collection?.totalCards ?? 0,
      wanted: collection?.needs ?? 0,
      held: collection?.holds ?? 0,
      offered: collection?.offers ?? 0,
    }),
    [collection],
  );

  const resetFilters = () => {};

  const handleDownloadExcel = () => {
    download(undefined, {
      onSuccess(data) {
        const blob = new Blob([data], { type: "application/vnd.ms-excel" });
        saveAs(blob, `${collection?.slug}.xlsx`);
      },
    });
  };

  const breadcrumb = useMemo(() => {
    if (!category) return [];
    return [category.parent, category].map((_) => ({
      name: _?.name ?? "",
      slug: _?.slug ?? "",
    }));
  }, [category]);

  return {
    t,
    id,
    collection,
    isLoading,
    currentUser,
    query: queryUI,
    filters,
    uniqueValues,
    filteredAndSortedCards,
    stats,
    resetFilters,
    handleDownloadExcel,
    cards,
    breadcrumb,
    table,
    sorting,
    meta: cardsData?.meta,
    isLoadingCards,
  };
};
