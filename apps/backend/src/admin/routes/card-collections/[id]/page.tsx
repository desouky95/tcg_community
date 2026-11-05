import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
} from "@medusajs/ui";

type Collection = {
  id: string;
  name: string;
  year?: number | null;
  description?: string;
};
type Card = {
  id: string;
  number: string;
  name: string;
  section?: string | null;
  variant?: string | null;
};
type Selected = { card: Card; price: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.message || data.error || `Request failed (${response.status})`
    );
  return data as T;
}
const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();

  const [createdId, setCreatedId] = useState("");
  const [selected, setSelected] = useState<Record<string, Selected>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [search, setSearch] = useState("");
  const [params, setParams] = useSearchParams({ search, page: String(1) });

  const pageOptions = useMemo(() => {
    const search = params.get("search");
    const page = Number(params.get("page"));
    return {
      search,
      page,
    };
  }, [params]);

  const { data: collection } = useQuery({
    queryKey: ["collection", id],
    queryFn: () => {
      return request<Collection>(`/admin/card-collections/${id}`);
    },
  });
  const { isLoading, data } = useQuery({
    queryKey: ["collection", "catalog", id, params.toString()],
    queryFn: () => {
      return request<{
        collection: Collection;
        cards?: Card[];
        total: number;
      }>(`/admin/card-collections/catalog/${id}?${params}`);
    },
  });

  const selectedCards = Object.values(selected);

  const { mutate, isPending: saving } = useMutation({
    mutationKey: ["create", "collection", id],
    mutationFn: async () => {
      const result = await request<{ product: { id: string } }>(
        "/admin/card-collections",
        {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            collection_id: String(data?.collection?.id),
            cards: selectAll
              ? (data?.cards || []).map((_) => ({ id: _.id, price: defaultPrice }))
              : selectedCards.map(({ card, price }) => ({
                  id: card.id,
                  price: Number(price),
                })),
          }),
        }
      );
      return result;
    },
  });

  const create = () => {
    mutate(undefined as void, {
      onSuccess(data) {
        setCreatedId(data.product.id);
      },
    });
  };

  const [selectAll, setSelectAll] = useState(false);

  const toggle = (card: Card) =>
    setSelected((previous) => {
      const next = { ...previous };
      if (next[card.id]) delete next[card.id];
      else if (Object.keys(next).length < 100)
        next[card.id] = { card, price: defaultPrice };
      return next;
    });

  if (createdId)
    return (
      <Container className="p-6">
        <Heading level="h1">Draft product created</Heading>
        <Text className="mt-3">
          Each selected card is a separate inventory-managed variant. Add stock
          at a location and complete the product details in Medusa before
          publishing.
        </Text>
        <Link
          className="text-ui-fg-interactive mt-4 inline-block underline"
          to={`/app/products/${createdId}`}
        >
          Open product
        </Link>
      </Container>
    );
  return (
    <Container className="grid gap-2">
      <>
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Heading level="h2">1. {collection?.name}</Heading>
              <Text className="text-ui-fg-subtle">Selected checklist</Text>
            </div>
            <Link to={"/card-collections"}>
              <Button variant="secondary" size="small">
                Go to checklists
              </Button>
            </Link>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <Heading level="h2">2. Product details</Heading>
          <label htmlFor="product-title">Product title</label>
          <Input
            id="product-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="product-description">Description (optional)</label>
          <Textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>
        <section className="flex flex-col gap-3">
          <Heading level="h2">3. Select cards</Heading>
          <Text className="text-ui-fg-subtle">
            Set a default price before selecting cards. You can edit each price
            below. Select up to 100 cards.
          </Text>
          <label htmlFor="default-price">Default price (EGP)</label>
          <Input
            id="default-price"
            type="number"
            min="0.01"
            step="0.01"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
          />
          <label htmlFor="card-search">Search cards</label>
          <Input
            id="card-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setParams({ search: e.target.value, page: "1" });
              //   setCardPage(1);
            }}
            placeholder="Name or number"
          />
          <label
            className="flex items-center gap-3 sticky top-0 bg-ui-bg-base"
            onChange={() => setSelectAll((prev) => !prev)}
          >
            <input type="checkbox" />
            <span>Select All</span>
          </label>
          {isLoading ? (
            <Text>Loading cards…</Text>
          ) : data?.cards?.length === 0 ? (
            <Text>No cards found.</Text>
          ) : (
            <>
              <ul className="divide-y divide-ui-border-base">
                {data?.cards?.map((card) => (
                  <li key={card.id} className="py-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(selected[card.id]) || selectAll}
                        disabled={
                          !selected[card.id] && selectedCards.length >= 100
                        }
                        onChange={() => toggle(card)}
                      />
                      <span>
                        <strong>{card.number}</strong> — {card.name}
                        {card.variant ? ` · ${card.variant}` : ""}
                        {card.section ? ` · ${card.section}` : ""}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
          {/* <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="small"
              disabled={pageOptions.page === 1 || isLoading}
              onClick={() => setParams({ page: String(pageOptions.page - 1) })}
            >
              Previous
            </Button>
            <Text>Page {pageOptions.page}</Text>
            <Button
              variant="secondary"
              size="small"
              disabled={pageOptions.page * 50 >= data?.total! || isLoading}
              onClick={() => setParams({ page: String(pageOptions.page + 1) })}
            >
              Next
            </Button>
          </div> */}
        </section>
        <section className="flex flex-col gap-3">
          <Heading level="h2">
            4. Review prices ({selectedCards.length})
          </Heading>
          {selectedCards.length === 0 ? (
            <Text>No cards selected yet.</Text>
          ) : (
            <ul className="divide-y divide-ui-border-base">
              {selectedCards.map(({ card, price }) => (
                <li
                  key={card.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span>
                    {card.number} — {card.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`price-${card.id}`} className="sr-only">
                      Price for {card.number} {card.name} in EGP
                    </label>
                    <Input
                      id={`price-${card.id}`}
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) =>
                        setSelected((old) => ({
                          ...old,
                          [card.id]: {
                            ...old[card.id],
                            price: e.target.value,
                          },
                        }))
                      }
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => toggle(card)}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="sticky bottom-0 z-50 py-4 flex justify-end bg-body">
          <Button
            disabled={
              saving ||
              !title.trim() ||
              selectedCards.length === 0 ||
              selectedCards.some(
                ({ price }) =>
                  !Number.isFinite(Number(price)) || Number(price) <= 0
              )
            }
            onClick={create}
          >
            {saving ? "Creating draft…" : "Create draft product"}
          </Button>
        </section>
      </>
    </Container>
  );
};

export default CollectionPage;
