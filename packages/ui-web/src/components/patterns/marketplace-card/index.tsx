"use client";

import { ArrowUpRight, Bookmark } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { LinkComponent, MarketplaceListing } from "../types";

export function MarketplaceCard({ listing, href, askHref, askLabel, saved, onToggleSaved, Link }: { listing: MarketplaceListing; href: string; askHref: string; askLabel: string; saved?: boolean; onToggleSaved?: () => void; Link?: LinkComponent }) {
  const content = <><div className="wax-market-card-image"><img src={listing.image} alt={`${listing.title} card`} loading="lazy" /><span>{listing.condition}</span></div><div className="wax-market-card-copy"><span className="wax-market-card-set">{listing.set}</span><div><h2>{listing.title}</h2><ArrowUpRight aria-hidden="true" /></div><div className="wax-market-card-meta"><span>{listing.seller}</span><strong>EGP {listing.price.toLocaleString("en-EG")}</strong></div></div></>;
  return (
    <article className={cn("wax-market-card", saved && "is-saved")}>
      {Link ? <Link href={href} className="wax-market-card-link focus-ring">{content}</Link> : <a href={href} className="wax-market-card-link focus-ring">{content}</a>}
      <div className="wax-market-card-actions">
        <button type="button" className={cn("wax-market-save", saved && "is-active")} aria-label={`${saved ? "Remove" : "Save"} ${listing.title}`} aria-pressed={Boolean(saved)} onClick={onToggleSaved}><Bookmark aria-hidden="true" /> {saved ? "Saved" : "Save card"}</button>
        {Link ? <Link href={askHref} className="wax-market-ask focus-ring">{askLabel}</Link> : <a href={askHref} className="wax-market-ask focus-ring">{askLabel}</a>}
      </div>
    </article>
  );
}
