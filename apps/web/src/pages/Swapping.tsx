import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import {
  Repeat,
  MapPin,
  Clock,
  Search,
  ListFilter,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useProfile } from "../hooks/useUsers";
import { EGYPT_GOVERNORATES } from "../lib/constants";
import {
  useSwapSearch,
  type SearchFilters,
  type SwapResult,
  type SwapResultMatch,
} from "../hooks/useSwapSearch";
import { useForm } from "react-hook-form";

export default function Swapping() {
  const { t } = useTranslation();
  const { data: currentUserProfile } = useProfile();

  // Extract unique checklists the current user is active in from their profile categories
  const activeChecklists = currentUserProfile?.data.checklists
    ?.flatMap((cl) => cl?.checklist)
    .filter((_) => !!_);

  // Deduplicate checklists the user has

  const { register, handleSubmit } = useForm<SearchFilters>({
    values: {
      checklists: activeChecklists?.map((_) => Number(_?.id)) || [],
      lastLogin: "all",
      regions: "",
    },
  });
  const {
    data: searchResults,
    isError,
    isPending: isLoading,
    error,
    mutate,
  } = useSwapSearch();

  const handleSearch = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <Layout>
      <div className="wax-workspace-view wax-swap-view max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase sm:text-5xl flex items-center gap-3">
              <div className="p-3 bg-primary-500/10 rounded-2xl">
                <Repeat className="w-8 h-8 text-primary-500" />
              </div>
              {t("nav.swap_search")}
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Find collectors who have the cards you need and need the cards you
              have.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="flex items-center gap-2 border-b border-border pb-4">
                <ListFilter className="w-5 h-5 text-primary-500" />
                <h2 className="font-black uppercase tracking-widest text-sm">
                  Search Filters
                </h2>
              </div>

              {/* Collections Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Your Collections
                </label>
                {activeChecklists?.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    You haven't started any collections yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {activeChecklists?.map((cl) => (
                      <label
                        key={cl!.id}
                        className="flex items-center gap-3 p-2 hover:bg-input/30 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-border"
                      >
                        <input
                          type="checkbox"
                          value={cl.id}
                          {...register("checklists")}
                          // checked={filters.checklists.includes(Number(cl!.id))}
                          // defaultChecked
                          className="w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500/20 bg-input/50"
                        />
                        <span className="text-sm font-bold truncate flex-1">
                          {cl!.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Regions Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Region
                </label>
                <div className="relative group/field">
                  <select
                    {...register("regions")}
                    className="w-full bg-input/20 border border-border/50 group-hover/field:border-primary-500/30 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold appearance-none"
                  >
                    <option value={""}>All Regions</option>
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov}>{gov}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Last Login Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Last Seen
                </label>
                <div className="relative group/field">
                  <select
                    {...register("lastLogin")}
                    className="w-full bg-input/20 border border-border/50 group-hover/field:border-primary-500/30 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold appearance-none"
                  >
                    <option value="all">Any time</option>
                    <option value="online">Online now</option>
                    <option value="today">Today</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="6months">Past 6 Months</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group/search mt-4"
              >
                <Search
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : "group-hover/search:scale-110 transition-transform"}`}
                />
                {isLoading ? "Searching..." : "Find Swaps"}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-3xl p-6 space-y-6 opacity-50 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-2xl" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-muted rounded-full" />
                        <div className="h-3 w-1/4 bg-muted rounded-full" />
                      </div>
                    </div>
                    <div className="h-24 w-full bg-muted rounded-2xl" />
                  </div>
                ))}
              </div>
            )}
            {isError && (
              <div className="bg-danger-500/10 border border-danger-500/20 rounded-3xl p-6 flex items-start gap-4 text-danger-500">
                <AlertCircle className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h3 className="font-black uppercase tracking-wider mb-1">
                    Search Failed
                  </h3>
                  <p className="text-sm opacity-90">
                    {error?.message ||
                      "An error occurred while searching for swaps."}
                  </p>
                </div>
              </div>
            )}
            {searchResults?.length === 0 && (
              <div className="bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest mb-2">
                  No Swaps Found
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  We couldn't find anyone matching your current collections and
                  filters. Try broadening your geographic search or updating
                  your checklists!
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults?.map((result: SwapResult) => (
                <div
                  key={result.user.id}
                  className="bg-card border border-border rounded-3xl p-6 shadow-xl hover:border-primary-500/30 transition-colors group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 font-black text-lg border border-primary-500/20">
                        {result.user.fullName?.charAt(0) ||
                          result.user.username.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-black text-lg">
                          {result.user.fullName || result.user.username}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                          <MapPin className="w-3 h-3" />
                          {result.user.governorate
                            ? t(
                                `common.governorates.${result.user.governorate}`,
                              )
                            : "Unknown Location"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-widest border border-primary-500/20">
                        {result.totalMutalTrades} Mutual
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    {result.matches.map((match: SwapResultMatch) => {
                      return (
                        <div
                          key={match.checklistId}
                          className="bg-input/20 rounded-2xl p-4 border border-border/50"
                        >
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border border-dashed">
                            {match.checklist?.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-success-500 mb-1.5">
                                They Offer You
                              </div>
                              {match.theyOffer?.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {match.theyOffer
                                    .slice(0, 5)
                                    .map((num: string) => (
                                      <span
                                        key={num}
                                        className="px-2 py-0.5 bg-success-500/10 text-success-500 border border-success-500/20 text-xs font-black rounded-lg"
                                      >
                                        {num}
                                      </span>
                                    ))}
                                  {match.theyOffer.length > 5 && (
                                    <span className="px-2 py-0.5 bg-success-500/5 text-success-500/70 border border-success-500/10 text-xs font-black rounded-lg">
                                      +{match.theyOffer.length - 5}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground font-medium">
                                  -
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-primary-500 mb-1.5">
                                They Need
                              </div>
                              {match.theyNeed?.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {match.theyNeed
                                    .slice(0, 5)
                                    .map((num: string) => (
                                      <span
                                        key={num}
                                        className="px-2 py-0.5 bg-primary-500/10 text-primary-500 border border-primary-500/20 text-xs font-black rounded-lg"
                                      >
                                        {num}
                                      </span>
                                    ))}
                                  {match.theyNeed.length > 5 && (
                                    <span className="px-2 py-0.5 bg-primary-500/5 text-primary-500/70 border border-primary-500/10 text-xs font-black rounded-lg">
                                      +{match.theyNeed.length - 5}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground font-medium">
                                  -
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href={`/profile/${result.user.id}`}
                    className="mt-6 w-full py-3 bg-muted hover:bg-input/50 text-foreground text-xs font-black uppercase tracking-widest text-center rounded-xl transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
