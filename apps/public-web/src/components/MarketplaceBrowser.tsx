"use client";

import { SectionHeading } from "@tcg/ui-web";
import { useMemo, useState } from "react";
import {
  EmptyStatePanel,
  FilterSelect,
  MarketplaceCard,
  MarketplaceHeroAction,
  MarketplaceToolbar,
  SearchBox,
  TextLink,
} from "@tcg/ui-web";
import { mockMarketplaceListings } from "../lib/mockData";

export default function MarketplaceBrowser() {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All conditions");
  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState<string[]>([]);
  const conditions = [
    "All conditions",
    ...new Set(mockMarketplaceListings.map((item) => item.condition)),
  ];
  const listings = useMemo(() => {
    const q = search.toLowerCase();
    const result = mockMarketplaceListings.filter(
      (item) =>
        (!q ||
          [item.title, item.set, item.seller].some((value) =>
            value.toLowerCase().includes(q),
          )) &&
        (condition === "All conditions" || item.condition === condition),
    );
    return [...result].sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "title"
            ? a.title.localeCompare(b.title)
            : 0,
    );
  }, [condition, search, sort]);
  const toggle = (id: string) =>
    setSaved((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  return (
    <>
      <section className="wax-market-hero">
        <div>
          <h1>
            Find the card
            <br />
            that completes the page.
          </h1>
          <p>
            Browse current listings, compare condition, and keep the set context
            close.
          </p>
        </div>
        <div className="wax-market-hero-action">
          <span>Marketplace preview · Egypt</span>
          <MarketplaceHeroAction href="/signup">
            Join to start listing
          </MarketplaceHeroAction>
        </div>
      </section>
      <section
        className="wax-market-section"
        aria-labelledby="market-listings-heading"
      >
        <div className="mb-12 grid items-end gap-4 md:mb-16 md:grid-cols-[minmax(0,1fr)_minmax(10rem,0.4fr)_minmax(10rem,0.4fr)]">
          <SearchBox
            id="marketplace-search"
            value={search}
            onChange={setSearch}
          />
          <FilterSelect
            id="marketplace-condition"
            label="Condition"
            value={condition}
            onChange={setCondition}
          >
            {conditions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            id="marketplace-sort"
            label="Sort by"
            value={sort}
            onChange={setSort}
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="title">Card name</option>
          </FilterSelect>
        </div>
        <MarketplaceToolbar
          count={listings.length}
          savedCount={saved.length}
          view={view}
          onViewChange={setView}
        />
        <SectionHeading >
          <div>
            <h2 id="market-listings-heading">Cards on the trade floor</h2>
            <p>
              Compare condition, seller, and set context before you open a
              conversation.
            </p>
          </div>
          <span className="whitespace-nowrap font-mono text-utility uppercase text-wax-red">
            {String(listings.length).padStart(2, "0")} results
          </span>
        </SectionHeading>
        {listings.length ? (
          <div
            className={`wax-market-grid ${view === "list" ? "is-list" : ""}`}
          >
            {listings.map((listing) => (
              <MarketplaceCard
                key={listing.id}
                listing={listing}
                href={`/marketplace/${listing.id}`}
                askHref="/login"
                askLabel="Sign in to ask"
                saved={saved.includes(listing.id)}
                onToggleSaved={() => toggle(listing.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyStatePanel
            title="No listings match those filters."
            description="Try another card name or reset the condition."
            action={
              <TextLink asChild>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCondition("All conditions");
                  }}
                >
                  Reset filters
                </button>
              </TextLink>
            }
          />
        )}
      </section>
    </>
  );
}
