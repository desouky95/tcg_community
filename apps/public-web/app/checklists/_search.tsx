import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const Searchbar = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const router = useRouter()
  return (
    <label className="wax-catalogue-search" htmlFor="catalogue-search">
      <Search aria-hidden="true" />
      <span className="sr-only">Search catalogues</span>
      <input
        id="catalogue-search"
        type="search"
        placeholder="Search sets, years, or categories"
        value={search}
        onChange={(event) => {
          const v = event.target.value;
          const searchParams = new URLSearchParams();
          searchParams.set("q", v);
          router.push(`/checklists?${searchParams.toString()}`)

        }}
      />
      <span className="wax-search-hint">SET / YEAR</span>
    </label>
  );
};
