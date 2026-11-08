import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useCategories, useChecklists } from "@tcg/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { useDebounce } from "use-debounce";

export const useDashboard = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">(
    "viewMode",
    "grid",
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const currentCategory = useMemo(() => {
    return searchParams.get("category");
  }, [searchParams]);
  const [debouncedQuery] = useDebounce(query, 400);
  const { data: checklists = [], isLoading, isError: catalogueError } = useChecklists({
    withParams: true,
    query: {
      q: debouncedQuery,
      category: currentCategory,
    },
  });

  const { data: summaries = [], isLoading: summariesLoading, isError: summariesError } = useQuery<{ id: number; slug: string; name: string; totalCards: number; owned: number; wanted: number; offered: number }[]>({ queryKey: ["collection-summaries"], queryFn: async () => (await api.http.get("/account/collections")).data.data });

  const { data: categories } = useCategories({
    withParams: true,
    query: searchParams,
  });

  const handleCategorySelect = (cat: string | null) => {
    if (!cat) {
      searchParams.delete("category");
      setSearchParams({ category: "" });
      return;
    }
    searchParams.set("category", cat);
    setSearchParams({ category: cat }, { preventScrollReset: true,replace: true });
  };

  const categorySelected = useMemo(() => {
    const flatCategories = categories?.data.flatMap((c) => [
      c,
      ...c.children.map((_) => ({ ..._, parent: c })),
    ]);
    const cat = flatCategories?.find((c) => c.slug === currentCategory);
    if (!cat) return;
    return {
      category: cat?.slug,
      parent: cat.parent?.slug,
    };
  }, [categories?.data, currentCategory]);

  const clear = () => {
    setQuery("");
    setSearchParams("");
  };

  return {
    t,
    categories,
    checklists,
    summaries,
    summariesLoading,
    summariesError,
    isLoading,
    catalogueError,
    setViewMode,
    viewMode: viewMode || "grid",
    categorySelected,
    handleCategorySelect,
    query,
    setQuery,
    clear,
  };
};
