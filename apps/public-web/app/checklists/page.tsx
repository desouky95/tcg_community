"use client";
import { ArrowRight, ArrowUpRight, Layers, Search } from "lucide-react";
import { PublicShell } from "@tcg/ui-web";
import { mockCategories, mockChecklists } from "../../src/lib/mockData";
import { QueryClient } from "@tanstack/react-query";
import { useCategories, useChecklists } from "@tcg/react-query";
import { Searchbar } from "./_search";
import { Checklist } from "@tcg/api-contracts";
function ChecklistCard({ checklist }: { checklist: Checklist }) {
  return (
    <a
      href={`/collection/${checklist.id}`}
      className="wax-checklist-card focus-ring"
    >
      <div className="wax-checklist-card-meta">
        <span>{checklist.year}</span>
        <span>Card set</span>
      </div>
      <div className="wax-checklist-card-body">
        <Layers aria-hidden="true" />
        <h3>{checklist.name}</h3>
        <p>
          {checklist.category?.name} · {checklist.subcategory?.name}
        </p>
      </div>
      <div className="wax-checklist-card-foot">
        <span>
          <strong>{checklist.totalCards}</strong> cards
        </span>
        <ArrowUpRight aria-hidden="true" />
      </div>
    </a>
  );
}

export default function ChecklistsPage() {
  const { data = [] } = useChecklists();
  const { data: categories = [] } = useCategories();

  return (
    <PublicShell currentPath="/checklists">
      <section className="wax-public-hero wax-public-hero-catalogue">
        <div>
          <h1>
            Find the set.
            <br />
            Know the card.
          </h1>
          <p>
            Explore catalogues by game, season, and set. Keep card numbers and
            collection context close before you trade.
          </p>
        </div>
        <Searchbar />
      </section>
      <section
        className="wax-public-section"
        aria-labelledby="catalogue-results-heading"
      >
        <div className="wax-public-section-heading">
          <div>
            {/* <h2 id="catalogue-results-heading">
              {search ? "Search results" : "Featured collections"}
            </h2>
            <p>
              {search
                ? `${data.length} catalogues match your search.`
                : "A useful place to start browsing."}
            </p> */}
          </div>
          <span className="wax-result-count">
            {String(data.length).padStart(2, "0")} sets
          </span>
        </div>
        {data.length ? (
          <div className="wax-checklist-grid">
            {data.map((item) => (
              <ChecklistCard key={item.id} checklist={item} />
            ))}
          </div>
        ) : (
          <div className="wax-public-empty">
            {/* <h3>No catalogue matches “{search}”.</h3>
            <p>Try a set name, release year, or category.</p>
            <button
              type="button"
              className="wax-text-link focus-ring"
              onClick={() => setSearch("")}
            >
              Clear search
            </button> */}
          </div>
        )}
      </section>
      <section
        className="wax-category-index"
        aria-labelledby="category-index-heading"
      >
        <div className="wax-category-index-heading">
          <h2 id="category-index-heading">Browse every category</h2>
          <p>Start broad, then narrow the shelf by series or era.</p>
        </div>
        <div className="wax-category-columns">
          {categories.map((category, index) => (
            <article key={category.id} className="wax-category-column">
              <span className="wax-category-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <a
                href={`/s/${category.id}`}
                className="wax-category-parent focus-ring"
              >
                <span>{category.name}</span>
                <ArrowRight aria-hidden="true" />
              </a>
              {category.children.length > 0 && (
                <ul>
                  {category.children.map((child) => (
                    <li key={child.id}>
                      <a href={`/s/${child.id}`} className="focus-ring">
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
