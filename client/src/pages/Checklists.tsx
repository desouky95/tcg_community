import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import Layout from "../components/Layout";
import { useState } from "react";
import { SectionHeading } from "../components/layout/SectionHeading";
import { MinimalChecklistCard } from "../components/checklists/MinimalChecklistCard";
import { useCategories } from "../hooks/useCategories";
import { useTranslation } from "react-i18next";
import { Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Checklist, Category } from "../store/useStore";

export default function Checklists() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const { data: relevantChecklists, isLoading: loadingRelevant } = useQuery({
    queryKey: ["checklists-relevant"],
    queryFn: async () => {
      const { data } = await api.getChecklists({ limit: 9 });
      return data as Checklist[];
    },
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8">
          {/* Search Section */}
          <div className="relative max-w-2xl mx-auto w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder={t("checklists.search_placeholder") || "Search all collections and cards..."}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Relevant Collections Grid */}
          <section className="mt-8">
            <SectionHeading
              title={t("checklists.relevant_collections") || "Relevant Collections"}
              subtitle={t("checklists.relevant_subtitle") || "Top collections picked for you"}
              align="left"
              className="px-0"
            />
            {loadingRelevant ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {relevantChecklists?.map((checklist) => (
                  <MinimalChecklistCard key={checklist.id} checklist={checklist} />
                ))}
              </div>
            )}
          </section>

          {/* Categories Hierarchy */}
          <section className="mt-12 bg-card/50 rounded-3xl p-8 border backdrop-blur-sm">
            <SectionHeading
              title={t("checklists.all_categories") || "Browse by Category"}
              align="left"
              className="px-0 mb-8"
            />
            
            {loadingCategories ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="space-y-4 animate-pulse">
                     <div className="h-6 w-32 bg-muted rounded" />
                     <div className="space-y-2 ml-4">
                       <div className="h-4 w-48 bg-muted/60 rounded" />
                       <div className="h-4 w-40 bg-muted/60 rounded" />
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {categories?.filter(c => c.parentId === -1 || !c.parentId).map((parent) => (
                  <div key={parent.id} className="flex flex-col gap-4">
                    <Link 
                      to={`/s/${parent.slug || parent.id}`}
                      className="group flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors"
                    >
                      {parent.name}
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                    </Link>

                    {parent.children && parent.children.length > 0 && (
                      <ul className="space-y-2 ml-4">
                        {parent.children.map((child: Category) => (
                          <li key={child.id}>
                            <Link 
                              to={`/s/${child.slug || child.id}`}
                              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-1 group"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
