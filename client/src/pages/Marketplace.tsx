import { ArrowUpRight, MapPin, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { mockMarketplaceListings } from "../lib/mockData";

export default function Marketplace() {
  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-500">The trade floor · Cairo / Egypt</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Find the card<br /><span className="text-primary-500">that completes</span> the page.</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">Browse collector-verified listings, compare condition, and keep every deal in one place.</p>
          </div>
          <Link to="/marketplace/sell" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 font-bold text-white transition hover:bg-primary-600 focus-ring"><Sparkles className="h-4 w-4" /> List a card</Link>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 text-muted-foreground focus-within:border-primary-500"><Search className="h-5 w-5" /><span className="sr-only">Search marketplace</span><input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search cards, sets, or sellers" /></label>
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 font-semibold hover:border-primary-500 focus-ring"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockMarketplaceListings.map((listing) => (
            <Link key={listing.id} to={`/marketplace/${listing.id}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-200 hover:-translate-y-1 hover:border-primary-500/60 hover:shadow-2xl focus-ring">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#202a34]">
                <img src={listing.image} alt={`${listing.title} card`} className="h-full w-full object-cover opacity-80 mix-blend-screen transition duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white">{listing.condition}</span>
                <span className="absolute bottom-4 right-4 rounded-lg px-3 py-1 font-mono text-sm font-bold text-[#0B0F14]" style={{ backgroundColor: listing.accent }}>EGP {listing.price.toLocaleString()}</span>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-xl font-bold">{listing.title}</h2><p className="mt-1 text-sm text-muted-foreground">{listing.set}</p></div><ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-primary-500" /></div>
                <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>{listing.seller}</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Egypt</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
