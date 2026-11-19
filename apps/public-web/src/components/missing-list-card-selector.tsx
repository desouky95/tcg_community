"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Button, Checkbox } from "@tcg/ui-web";
import { Minus, Plus, Search } from "lucide-react";
import { useCart } from "../providers/CartProvider";

type MissingCard = {
  variantId: string;
  number: string;
  name: string;
  image: string | null;
  price: number | null;
  currencyCode: string;
  availableQuantity: number;
};
type CardPage = { cards: MissingCard[]; total: number; page: number; limit: number };
type SelectedCard = { card: MissingCard; quantity: number };

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}

export function MissingListCardSelector({
  productId,
  title,
  cover,
  description,
}: {
  productId: string;
  title: string;
  cover?: string;
  description?: string;
}) {
  const searchId = useId();
  const { addMany, pending } = useCart();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CardPage | null>(null);
  const [selected, setSelected] = useState<Record<string, SelectedCard>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCards() {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page: String(page), search, limit: "24" });
      try {
        const response = await fetch(
          `/api/missing-lists/${encodeURIComponent(productId)}/cards?${params}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Cards are temporarily unavailable. Please try again.");
        setResult((await response.json()) as CardPage);
      } catch (cause) {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Cards are temporarily unavailable. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadCards();
    return () => controller.abort();
  }, [page, productId, refresh, search]);

  const selectedCards = Object.values(selected);
  const subtotal = useMemo(
    () => selectedCards.reduce((sum, item) => sum + (item.card.price ?? 0) * item.quantity, 0),
    [selectedCards],
  );
  const currencyCode = selectedCards[0]?.card.currencyCode ?? "egp";
  const pageCount = Math.max(1, Math.ceil((result?.total ?? 0) / (result?.limit ?? 24)));

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function setCardSelected(card: MissingCard, checked: boolean) {
    setError("");
    setSelected((current) => {
      const next = { ...current };
      if (checked) next[card.variantId] = { card, quantity: 1 };
      else delete next[card.variantId];
      return next;
    });
  }

  function setQuantity(card: MissingCard, value: number) {
    setError("");
    setSelected((current) => ({
      ...current,
      [card.variantId]: {
        card,
        quantity: Math.max(1, Math.min(card.availableQuantity, 99, value)),
      },
    }));
  }

  async function addSelection() {
    const outcome = await addMany(
      productId,
      selectedCards.map(({ card, quantity }) => ({ variantId: card.variantId, quantity })),
    );
    setSelected((current) => {
      const next = { ...current };
      for (const variantId of outcome.addedVariantIds) delete next[variantId];
      return next;
    });
    const failedNumbers = outcome.failures
      .map(({ variantId }) => selected[variantId]?.card.number || variantId)
      .join(", ");
    setError(
      outcome.failures.length
        ? `${outcome.addedVariantIds.length} added. Couldn’t add ${failedNumbers}; check stock and try again.`
        : "",
    );
  }

  return (
    <div className="mt-8">
      <div className="grid gap-6 border-b border-wax-line pb-8 sm:grid-cols-[minmax(10rem,15rem)_1fr] sm:items-center sm:gap-8">
        {cover && (
          <div className="aspect-square overflow-hidden rounded-xl bg-paper-200 p-5">
            <img src={cover} alt="" className="h-full w-full object-contain" />
          </div>
        )}
        <div>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">{title}</h2>
          <h3 className="mt-5 font-display text-lg font-semibold">Build your missing list</h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-primary-400">
            Select available cards, set quantities, then add them together.
          </p>
          {description && <p className="mt-4 whitespace-pre-line leading-relaxed text-primary-400">{description}</p>}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section aria-labelledby="missing-cards-heading" className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="missing-cards-heading" className="font-display text-xl font-semibold">Cards in this set</h2>
              {result && <p className="mt-1 text-sm text-primary-400">{result.total} cards</p>}
            </div>
            <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
              <label htmlFor={searchId} className="sr-only">Search by card number or name</label>
              <input
                id={searchId}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search number or name"
                className="focus-ring min-h-12 min-w-0 flex-1 rounded-md border border-wax-line bg-white px-3 sm:w-64 sm:flex-none"
              />
              <Button type="submit" variant="outline" aria-label="Search cards">
                <Search aria-hidden="true" className="size-4" />
                <span className="ms-2">Search</span>
              </Button>
            </form>
          </div>

          {loading ? (
            <p role="status" className="mt-6">Loading cards…</p>
          ) : error ? (
            <div role="alert" className="mt-6 rounded-lg border border-wax-line p-5">
              <p>{error}</p>
              <Button className="mt-4" variant="outline" onClick={() => setRefresh((value) => value + 1)}>Try again</Button>
            </div>
          ) : !result?.cards.length ? (
            <p className="mt-6 rounded-lg border border-wax-line p-5">No cards match that search.</p>
          ) : (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {result.cards.map((card) => {
                const choice = selected[card.variantId];
                const inStock = card.availableQuantity > 0;
                const available = inStock && card.price !== null;
                return (
                  <li key={card.variantId}>
                    <article className={`h-full rounded-lg border p-3 ${choice ? "border-primary-500 bg-paper-100" : "border-wax-line bg-white"}`}>
                      <div className="flex gap-3">
                        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-paper-200 text-center font-display text-sm font-semibold tabular-nums">
                          {card.image ? <img src={card.image} alt="" loading="lazy" className="h-full w-full object-contain" /> : card.number || "Card"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">{card.number ? `Card ${card.number}` : "Card"}</p>
                          <h3 className="mt-1 line-clamp-2 font-semibold leading-snug">{card.name || "Untitled card"}</h3>
                          <p className="mt-2 text-sm font-semibold tabular-nums">
                            {card.price !== null ? formatMoney(card.price, card.currencyCode) : "Price unavailable"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex min-h-11 items-center justify-between gap-3 border-t border-wax-line pt-3">
                        {available ? (
                          <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                            <Checkbox checked={!!choice} onCheckedChange={(checked) => setCardSelected(card, checked === true)} aria-label={`Select ${card.number} ${card.name}`} />
                            <span>{choice ? "Selected" : "Select card"}</span>
                          </label>
                        ) : (
                          <span className="text-sm font-semibold text-primary-400">{inStock ? "Price unavailable" : "Out of stock"}</span>
                        )}
                        {choice && (
                          <div className="flex h-10 items-center rounded-md border border-wax-line" aria-label={`Quantity for ${card.number} ${card.name}`}>
                            <button type="button" className="focus-ring grid size-10 place-items-center rounded-s-md disabled:opacity-40" aria-label={`Decrease ${card.name} quantity`} disabled={choice.quantity <= 1} onClick={() => setQuantity(card, choice.quantity - 1)}><Minus aria-hidden="true" className="size-4" /></button>
                            <span className="min-w-7 text-center text-sm tabular-nums">{choice.quantity}</span>
                            <button type="button" className="focus-ring grid size-10 place-items-center rounded-e-md disabled:opacity-40" aria-label={`Increase ${card.name} quantity`} disabled={choice.quantity >= Math.min(card.availableQuantity, 99)} onClick={() => setQuantity(card, choice.quantity + 1)}><Plus aria-hidden="true" className="size-4" /></button>
                          </div>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}

          {result && pageCount > 1 && (
            <nav aria-label="Card pages" className="mt-6 flex items-center justify-between gap-4">
              <Button variant="outline" disabled={loading || page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
              <span aria-live="polite" className="text-sm tabular-nums">Page {page} of {pageCount}</span>
              <Button variant="outline" disabled={loading || page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button>
            </nav>
          )}
        </section>

        <aside aria-labelledby="selection-summary" className="lg:sticky lg:top-6">
          <div className="rounded-xl bg-primary-500 p-5 text-primary-50 sm:p-6">
            <h2 id="selection-summary" className="font-display text-xl font-semibold">Your selection</h2>
            <p className="mt-1 text-sm text-primary-100">{selectedCards.length} card types · {selectedCards.reduce((sum, item) => sum + item.quantity, 0)} total</p>
            {selectedCards.length ? (
              <>
                <ul className="mt-5 max-h-64 space-y-3 overflow-auto border-y border-primary-300/40 py-4">
                  {selectedCards.map(({ card, quantity }) => (
                    <li key={card.variantId} className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0">{card.number} · {card.name} <span className="text-primary-100">× {quantity}</span></span>
                      <span className="shrink-0 tabular-nums">{card.price !== null ? formatMoney(card.price * quantity, card.currencyCode) : "—"}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex justify-between font-display font-semibold"><span>Estimated total</span><span className="tabular-nums">{formatMoney(subtotal, currencyCode)}</span></p>
              </>
            ) : (
              <p className="mt-5 border-y border-primary-300/40 py-4 text-sm text-primary-100">Choose one or more available cards to see your total.</p>
            )}
            {error && <p role="alert" className="mt-4 text-sm font-semibold">{error}</p>}
            <Button
              tone="primary"
              className="mt-5 w-full"
              loading={pending}
              disabled={!selectedCards.length || pending}
              onClick={() => void addSelection()}
            >
              {pending ? "Adding cards…" : "Add selection to cart"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
