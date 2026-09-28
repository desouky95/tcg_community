import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  LayoutGrid,
  List,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PublicShell from "../components/PublicShell";
import { mockMarketplaceListings } from "../lib/mockData";
import { useStore } from "../store/useStore";

const conditions = [
  "All conditions",
  ...new Set(mockMarketplaceListings.map((listing) => listing.condition)),
];
type SortOption = "relevance" | "price-low" | "price-high" | "title";
type ViewMode = "grid" | "list";
type PriceFilter = "all" | "under-1000" | "1000-2000" | "over-2000";

function MarketplaceShell({ children }: { children: ReactNode }) {
  const user = useStore((state) => state.user);
  return user ? <Layout>{children}</Layout> : <PublicShell>{children}</PublicShell>;
}

function AuthenticatedMarketplace() {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All conditions");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [searchSaved, setSearchSaved] = useState(false);

  const listings = useMemo(() => {
    const query = search.trim().toLowerCase();
    const results = mockMarketplaceListings.filter((listing) => {
      const matchesQuery = !query || [listing.title, listing.set, listing.seller]
        .some((value) => value.toLowerCase().includes(query));
      const matchesCondition = condition === "All conditions" || listing.condition === condition;
      const matchesPrice = price === "all"
        || (price === "under-1000" && listing.price < 1000)
        || (price === "1000-2000" && listing.price >= 1000 && listing.price <= 2000)
        || (price === "over-2000" && listing.price > 2000);
      return matchesQuery && matchesCondition && matchesPrice;
    });

    return [...results].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "title") return a.title.localeCompare(b.title);
      return mockMarketplaceListings.indexOf(a) - mockMarketplaceListings.indexOf(b);
    });
  }, [condition, price, search, sort]);

  const toggleSaved = (listingId: string) => {
    setSavedListings((current) => current.includes(listingId)
      ? current.filter((id) => id !== listingId)
      : [...current, listingId]);
  };

  const resetFilters = () => {
    setSearch("");
    setCondition("All conditions");
    setPrice("all");
  };

  return (
    <MarketplaceShell>
      <div className="wax-market-auth-page">
        <header className="wax-market-auth-header">
          <div>
            <p className="wax-market-auth-kicker">Collector marketplace · Egypt</p>
            <h1>Find the next card<br />for your collection.</h1>
            <p>Compare trusted listings by set, condition, seller, and price before you start a conversation.</p>
          </div>
          <Link to="/dashboard" className="wax-text-link focus-ring">Back to desk <ArrowRight aria-hidden="true" /></Link>
        </header>

        <form className="wax-market-auth-search" onSubmit={(event) => event.preventDefault()}>
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="auth-marketplace-search">Search marketplace</label>
          <input id="auth-marketplace-search" type="search" placeholder="Search cards, sets, or sellers" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit" className="wax-button focus-ring">Search <ArrowRight aria-hidden="true" /></button>
        </form>

        <div className="wax-market-auth-layout">
          <aside className="wax-market-filter-rail" aria-label="Marketplace filters">
            <div className="wax-market-filter-rail-heading"><SlidersHorizontal aria-hidden="true" /><h2>Search filters</h2></div>
            <fieldset>
              <legend>Condition</legend>
              {conditions.map((item) => (
                <label key={item} className="wax-market-check-row">
                  <input type="radio" name="auth-condition" value={item} checked={condition === item} onChange={() => setCondition(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Price in EGP</legend>
              {([['all', 'Any price'], ['under-1000', 'Under EGP 1,000'], ['1000-2000', 'EGP 1,000–2,000'], ['over-2000', 'Over EGP 2,000']] as const).map(([value, label]) => (
                <label key={value} className="wax-market-check-row">
                  <input type="radio" name="auth-price" value={value} checked={price === value} onChange={() => setPrice(value)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <button type="button" className="wax-text-link focus-ring wax-market-reset" onClick={resetFilters}>Clear all filters</button>
          </aside>

          <main className="wax-market-auth-results" aria-labelledby="auth-market-results-heading">
            <div className="wax-market-results-toolbar">
              <div><p className="wax-market-results-count">{listings.length} listings</p><h2 id="auth-market-results-heading">Cards on the trade floor</h2></div>
              <div className="wax-market-results-actions">
                <button type="button" className={`wax-market-save-search ${searchSaved ? "is-saved" : ""}`} aria-pressed={searchSaved} onClick={() => setSearchSaved((value) => !value)}><Bookmark aria-hidden="true" /> {searchSaved ? "Search saved" : "Save this search"}</button>
                <label className="wax-market-sort"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="relevance">Best match</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="title">Card name</option></select></label>
                <div className="wax-market-view-toggle" role="group" aria-label="Listing view"><button type="button" className={viewMode === "list" ? "is-active" : ""} aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}><List aria-hidden="true" /></button><button type="button" className={viewMode === "grid" ? "is-active" : ""} aria-label="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}><LayoutGrid aria-hidden="true" /></button></div>
              </div>
            </div>

            <div className="wax-market-result-note"><ShieldCheck aria-hidden="true" /><span>Demo catalogue listings · Review seller and card details before any exchange.</span></div>

            {listings.length > 0 ? (
              <div className={`wax-market-auth-listings ${viewMode === "grid" ? "is-grid" : ""}`}>
                {listings.map((listing) => {
                  const isSaved = savedListings.includes(listing.id);
                  return (
                    <article key={listing.id} className={`wax-market-result ${isSaved ? "is-saved" : ""}`}>
                      <Link to={`/marketplace/${listing.id}`} className="wax-market-result-image focus-ring"><img src={listing.image} alt={`${listing.title} card`} loading="lazy" /><span>{listing.condition}</span></Link>
                      <div className="wax-market-result-body"><div className="wax-market-result-copy"><span className="wax-market-card-set">{listing.set}</span><Link to={`/marketplace/${listing.id}`} className="focus-ring"><h3>{listing.title}</h3></Link><p>Seller: <strong>{listing.seller}</strong> · Egypt</p><p className="wax-market-result-trust"><ShieldCheck aria-hidden="true" /> Seller details available in chat</p></div><div className="wax-market-result-buy"><strong>EGP {listing.price.toLocaleString("en-EG")}</strong><span>Conversation listing</span><Link to="/chat" className="wax-button wax-button-small focus-ring">Ask seller <ArrowRight aria-hidden="true" /></Link><button type="button" className={`wax-market-save ${isSaved ? "is-active" : ""}`} aria-label={`${isSaved ? "Remove" : "Save"} ${listing.title}`} aria-pressed={isSaved} onClick={() => toggleSaved(listing.id)}><Bookmark aria-hidden="true" /> {isSaved ? "Saved" : "Save"}</button></div></div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="wax-public-empty"><h3>No listings match those filters.</h3><p>Try a broader card search or clear the price and condition filters.</p><button type="button" className="wax-text-link focus-ring" onClick={resetFilters}>Clear filters</button></div>
            )}
          </main>
        </div>
      </div>
    </MarketplaceShell>
  );
}

export default function Marketplace() {
  const { id } = useParams<{ id: string }>();
  const user = useStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All conditions");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    const results = mockMarketplaceListings.filter((listing) => {
      const matchesQuery = !query || [listing.title, listing.set, listing.seller]
        .some((value) => value.toLowerCase().includes(query));
      const matchesCondition = condition === "All conditions" || listing.condition === condition;
      const matchesSaved = !savedOnly || savedListings.includes(listing.id);
      return matchesQuery && matchesCondition && matchesSaved;
    });

    return [...results].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "title") return a.title.localeCompare(b.title);
      return mockMarketplaceListings.indexOf(a) - mockMarketplaceListings.indexOf(b);
    });
  }, [condition, savedListings, savedOnly, search, sort]);

  const toggleSaved = (listingId: string) => {
    setSavedListings((current) => current.includes(listingId)
      ? current.filter((id) => id !== listingId)
      : [...current, listingId]);
  };

  if (user && !id) return <AuthenticatedMarketplace />;

  if (id) {
    const listing = mockMarketplaceListings.find((item) => item.id === id);

    if (!listing) {
      return (
        <MarketplaceShell>
          <section className="wax-public-empty wax-public-empty-page">
            <h1>Listing not found.</h1>
            <p>This card may no longer be on the trade floor.</p>
            <Link to="/marketplace" className="wax-button focus-ring"><ArrowLeft aria-hidden="true" /> Back to marketplace</Link>
          </section>
        </MarketplaceShell>
      );
    }

    return (
      <MarketplaceShell>
        <article className="wax-market-detail">
          <div className="wax-market-detail-nav">
            <Link to="/marketplace" className="wax-text-link focus-ring"><ArrowLeft aria-hidden="true" /> All listings</Link>
            <span>{user ? "Collector marketplace" : "Demo marketplace listing"}</span>
          </div>

          <div className="wax-market-detail-grid">
            <div className="wax-market-detail-image">
              <img src={listing.image} alt={`${listing.title} card`} />
              <span>{listing.condition}</span>
            </div>

            <div className="wax-market-detail-copy">
              <p className="wax-market-set">{listing.set}</p>
              <h1>{listing.title}</h1>
              <p className="wax-market-price">EGP {listing.price.toLocaleString("en-EG")}</p>
              <p className="wax-market-description">
                Review the set, condition, and seller before starting a conversation. This preview does not process payment or delivery; confirm exchange details directly with the seller.
              </p>

              <dl className="wax-market-facts">
                <div><dt>Condition</dt><dd>{listing.condition}</dd></div>
                <div><dt>Seller</dt><dd>{listing.seller}</dd></div>
                <div><dt>Location</dt><dd><MapPin aria-hidden="true" /> Egypt</dd></div>
              </dl>

              <div className="wax-market-actions">
                <Link to={user ? "/chat" : "/login"} className="wax-button focus-ring">
                  {user ? "Ask the seller" : "Sign in to contact seller"}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link to="/checklists" className="wax-text-link focus-ring">Check the catalogue</Link>
              </div>

              <p className="wax-demo-note"><ShieldCheck aria-hidden="true" /> Demonstration listing. Confirm card and seller details before any exchange.</p>
            </div>
          </div>
        </article>
      </MarketplaceShell>
    );
  }

  return (
    <MarketplaceShell>
      <section className={`wax-market-hero ${user ? "wax-market-hero-auth" : ""}`}>
        <div>
          <h1>{user ? <>Shop the<br />trade floor.</> : <>Find the card<br />that completes the page.</>}</h1>
          <p>{user ? "Search trusted listings, compare condition, and save the cards worth a conversation." : "Browse current listings, compare condition, and keep the set context close."}</p>
        </div>
        <div className="wax-market-hero-action">
          <span>{user ? "Collector marketplace · Egypt" : "Marketplace preview · Egypt"}</span>
          <Link to={user ? "/dashboard" : "/signup"} className="wax-button focus-ring">
            {user ? "Back to desk" : "Join to start listing"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={`wax-market-section ${user ? "wax-market-section-auth" : ""}`} aria-labelledby="market-listings-heading">
        <div className="wax-market-toolbar">
          <label className="wax-market-search" htmlFor="marketplace-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search marketplace</span>
            <input id="marketplace-search" type="search" placeholder="Search cards, sets, or sellers" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="wax-market-filter" htmlFor="marketplace-condition">
            <span>Condition</span>
            <select id="marketplace-condition" value={condition} onChange={(event) => setCondition(event.target.value)}>
              {conditions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="wax-market-filter" htmlFor="marketplace-sort">
            <span>Sort by</span>
            <select id="marketplace-sort" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="title">Card name</option>
            </select>
          </label>
        </div>

        <div className="wax-market-command-bar">
          <div className="wax-market-command-copy"><SlidersHorizontal aria-hidden="true" /><strong>{filteredListings.length} listings</strong><span>{savedListings.length} saved</span></div>
          <div className="wax-market-command-actions">
            {user && <button type="button" className={`wax-market-saved-toggle ${savedOnly ? "is-active" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly((value) => !value)}><Bookmark aria-hidden="true" /> Saved only</button>}
            <div className="wax-market-view-toggle" role="group" aria-label="Listing view">
              <button type="button" className={viewMode === "grid" ? "is-active" : ""} aria-label="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}><LayoutGrid aria-hidden="true" /></button>
              <button type="button" className={viewMode === "list" ? "is-active" : ""} aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}><List aria-hidden="true" /></button>
            </div>
          </div>
        </div>

        <div className="wax-public-section-heading">
          <div><h2 id="market-listings-heading">Cards on the trade floor</h2><p>Compare condition, seller, and set context before you open a conversation.</p></div>
          <span className="wax-result-count">{String(filteredListings.length).padStart(2, "0")} results</span>
        </div>

        {filteredListings.length > 0 ? (
          <div className={`wax-market-grid ${viewMode === "list" ? "is-list" : ""}`}>
            {filteredListings.map((listing) => {
              const isSaved = savedListings.includes(listing.id);
              return (
                <article key={listing.id} className={`wax-market-card ${isSaved ? "is-saved" : ""}`}>
                  <Link to={`/marketplace/${listing.id}`} className="wax-market-card-link focus-ring">
                    <div className="wax-market-card-image"><img src={listing.image} alt={`${listing.title} card`} loading="lazy" /><span>{listing.condition}</span></div>
                    <div className="wax-market-card-copy"><span className="wax-market-card-set">{listing.set}</span><div><h2>{listing.title}</h2><ArrowUpRight aria-hidden="true" /></div><div className="wax-market-card-meta"><span>{listing.seller}</span><strong>EGP {listing.price.toLocaleString("en-EG")}</strong></div></div>
                  </Link>
                  <div className="wax-market-card-actions">
                    <button type="button" className={`wax-market-save ${isSaved ? "is-active" : ""}`} aria-label={`${isSaved ? "Remove" : "Save"} ${listing.title}`} aria-pressed={isSaved} onClick={() => toggleSaved(listing.id)}><Bookmark aria-hidden="true" /> {isSaved ? "Saved" : "Save card"}</button>
                    <Link to={user ? "/chat" : "/login"} className="wax-market-ask focus-ring">{user ? "Ask seller" : "Sign in to ask"}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="wax-public-empty"><h3>{savedOnly ? "No saved cards yet." : "No listings match those filters."}</h3><p>{savedOnly ? "Save a card from the trade floor and it will stay close here." : "Try another card name or reset the condition."}</p><button type="button" className="wax-text-link focus-ring" onClick={() => { setSearch(""); setCondition("All conditions"); setSavedOnly(false); }}>Reset filters</button></div>
        )}
      </section>
    </MarketplaceShell>
  );
}
