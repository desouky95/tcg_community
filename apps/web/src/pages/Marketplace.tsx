import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Search, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PublicShell from "../components/PublicShell";
import { mockMarketplaceListings } from "../lib/mockData";
import { useStore } from "../store/useStore";

const conditions = ["All conditions", ...new Set(mockMarketplaceListings.map((listing) => listing.condition))];

export default function Marketplace() {
  const { id } = useParams<{ id: string }>();
  const user = useStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All conditions");

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockMarketplaceListings.filter((listing) => {
      const matchesQuery = !query || [listing.title, listing.set, listing.seller]
        .some((value) => value.toLowerCase().includes(query));
      const matchesCondition = condition === "All conditions" || listing.condition === condition;
      return matchesQuery && matchesCondition;
    });
  }, [condition, search]);

  if (id) {
    const listing = mockMarketplaceListings.find((item) => item.id === id);

    if (!listing) {
      return (
        <PublicShell>
          <section className="wax-public-empty wax-public-empty-page">
            <h1>Listing not found.</h1>
            <p>This card may no longer be on the trade floor.</p>
            <Link to="/marketplace" className="wax-button focus-ring"><ArrowLeft aria-hidden="true" /> Back to marketplace</Link>
          </section>
        </PublicShell>
      );
    }

    return (
      <PublicShell>
        <article className="wax-market-detail">
          <div className="wax-market-detail-nav">
            <Link to="/marketplace" className="wax-text-link focus-ring"><ArrowLeft aria-hidden="true" /> All listings</Link>
            <span>Demo marketplace listing</span>
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
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className="wax-market-hero">
        <div>
          <h1>Find the card<br />that completes the page.</h1>
          <p>Browse current listings, compare condition, and keep the set context close.</p>
        </div>
        <div className="wax-market-hero-action">
          <span>Marketplace preview · Egypt</span>
          <Link to={user ? "/dashboard" : "/signup"} className="wax-button focus-ring">
            {user ? "Collector desk" : "Join to start listing"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="wax-market-section" aria-labelledby="market-listings-heading">
        <div className="wax-market-toolbar">
          <label className="wax-market-search" htmlFor="marketplace-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search marketplace</span>
            <input
              id="marketplace-search"
              type="search"
              placeholder="Search cards, sets, or sellers"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="wax-market-filter" htmlFor="marketplace-condition">
            <span>Condition</span>
            <select id="marketplace-condition" value={condition} onChange={(event) => setCondition(event.target.value)}>
              {conditions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="wax-public-section-heading">
          <div>
            <h2 id="market-listings-heading">Cards on the trade floor</h2>
            <p>Demonstration content from the local development catalogue.</p>
          </div>
          <span className="wax-result-count">{String(filteredListings.length).padStart(2, "0")} listings</span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="wax-market-grid">
            {filteredListings.map((listing) => (
              <Link key={listing.id} to={`/marketplace/${listing.id}`} className="wax-market-card focus-ring">
                <div className="wax-market-card-image">
                  <img src={listing.image} alt={`${listing.title} card`} loading="lazy" />
                  <span>{listing.condition}</span>
                </div>
                <div className="wax-market-card-copy">
                  <span className="wax-market-card-set">{listing.set}</span>
                  <div>
                    <h2>{listing.title}</h2>
                    <ArrowUpRight aria-hidden="true" />
                  </div>
                  <div className="wax-market-card-meta">
                    <span>{listing.seller}</span>
                    <strong>EGP {listing.price.toLocaleString("en-EG")}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="wax-public-empty">
            <h3>No listings match those filters.</h3>
            <p>Try another card name or reset the condition.</p>
            <button type="button" className="wax-text-link focus-ring" onClick={() => { setSearch(""); setCondition("All conditions"); }}>Reset filters</button>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
