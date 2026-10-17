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
  const { data: checklists = [], isLoading } = useChecklists({
    withParams: true,
    query: {
      q: debouncedQuery,
      category: currentCategory,
    },
  });

  const { data: categories } = useCategories({
    withParams: true,
    query: searchParams,
  });

  const handleCategorySelect = (cat: string | null) => {
    console.log({ cat });
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
    isLoading,
    setViewMode,
    viewMode: viewMode || "grid",
    categorySelected,
    handleCategorySelect,
    query,
    setQuery,
    clear,
  };
};
