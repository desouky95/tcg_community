import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Text,
  toast,
} from "@medusajs/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../../../lib/client";
import { CardEditor } from "./card-editor";
import { cardErrors, parseCsv, type DraftCard } from "./csv";

type Collection = { id: string; name: string; year?: number };
type CatalogCard = { id: string; number: string; name: string };
export function CreateForm({ source }: { source: "external" | "csv" }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [cards, setCards] = useState<DraftCard[]>([]);
  const [selected, setSelected] = useState("");
  const [loaded, setLoaded] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [fileError, setFileError] = useState("");
  const [created, setCreated] = useState("");
  const locations = useQuery({
    queryKey: ["missing-list-locations"],
    queryFn: () => sdk.admin.stockLocation.list({ limit: 100 }),
  });
  const collections = useQuery({
    queryKey: ["missing-list-catalog", search, page],
    enabled: source === "external",
    queryFn: () =>
      sdk.client.fetch<{ collections: Collection[]; total: number }>(
        `/admin/card-collections/catalog?${new URLSearchParams({ search, page: String(page) })}`,
      ),
  });
  const loadCards = useMutation({
    mutationFn: async (id: string) => {
      const all: CatalogCard[] = [];
      let current = 1;
      let total = Infinity;
      while (all.length < total) {
        const result = await sdk.client.fetch<{
          cards: CatalogCard[];
          total: number;
        }>(
          `/admin/card-collections/catalog/${encodeURIComponent(id)}?page=${current}&limit=100`,
        );
        if (!result.cards.length) break;
        all.push(...result.cards);
        total = result.total;
        current++;
      }
      if (all.length !== total)
        throw new Error("Could not load every card in the collection");
      return all;
    },
    onSuccess: (data, id) => {
      setLoaded(id);
      setCards(
        data.map((c) => ({
          ...c,
          key: c.id,
          price: "",
          quantity: "0",
          active: false,
        })),
      );
    },
    onError: (e) => toast.error(e.message),
  });
  const errors = cardErrors(cards, defaultPrice, source === "external");
  const create = useMutation({
    mutationFn: () =>
      sdk.client.fetch<{ product: { id: string } }>("/admin/missing-lists", {
        method: "POST",
        body: {
          title: title.trim(),
          location_id: location,
          ...(source === "external" ? { collection_id: loaded } : {}),
          cards: cards.map((c) => ({
            ...(c.id ? { id: c.id } : {}),
            number: c.number,
            name: c.name,
            price: Number(c.price.trim() || defaultPrice),
            quantity: Number(c.quantity),
            active: c.active,
          })),
        },
      }),
    onSuccess: (result) => setCreated(result.product.id),
    onError: (e) => toast.error(e.message),
  });
  if (created)
    return (
      <Container className="grid gap-3">
        <Heading>Draft product created</Heading>
        <Link
          className="text-ui-fg-interactive"
          to={`/missing-list/${created}`}
        >
          Manage cards
        </Link>
        <Link className="text-ui-fg-interactive" to={`/products/${created}`}>
          Open product
        </Link>
      </Container>
    );
  const download = () => {
    const url = URL.createObjectURL(
      new Blob(["number,name,price,quantity\n1,Example card,10.00,1\n"], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "missing-list-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Container className="grid gap-4 p-6">
      <Link to="/missing-list">← Missing List</Link>
      <Heading level="h1">
        {source === "external" ? "Create from collection" : "Import CSV"}
      </Heading>
      {source === "external" ? (
        <section className="grid gap-3">
          <Label htmlFor="search">Search collections</Label>
          <Input
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {collections.isLoading ? (
            <Text>Loading collections…</Text>
          ) : collections.error ? (
            <Text role="alert">{collections.error.message}</Text>
          ) : (
            <>
              <Select
                value={selected}
                onValueChange={(value) => {
                  setSelected(value);
                  setLoaded("");
                  setCards([]);
                }}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Choose a collection" />
                </Select.Trigger>
                <Select.Content>
                  {collections.data?.collections.map((c) => (
                    <Select.Item key={c.id} value={c.id}>
                      {c.name}
                      {c.year ? ` (${c.year})` : ""}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Text>Page {page}</Text>
                <Button
                  size="small"
                  variant="secondary"
                  disabled={page * 50 >= (collections.data?.total || 0)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
              <Button
                size="small"
                disabled={!selected || loadCards.isPending}
                isLoading={loadCards.isPending}
                onClick={() => loadCards.mutate(selected)}
              >
                Load cards
              </Button>
            </>
          )}
        </section>
      ) : (
        <section className="grid gap-3">
          <Button size="small" variant="secondary" onClick={download}>
            Download CSV template
          </Button>
          <Label htmlFor="csv">CSV file</Label>
          <Input
            id="csv"
            type="file"
            accept=".csv,text/csv"
            onChange={async (e) => {
              setFileError("");
              setCards([]);
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const parsed = parseCsv(await file.text());
                console.log(parsed);
                setCards(parsed);
              } catch (error) {
                setFileError(
                  error instanceof Error
                    ? error.message
                    : "Unable to read file",
                );
              }
            }}
          />
          {fileError && (
            <Text role="alert" className="text-ui-fg-error">
              {fileError}
            </Text>
          )}
        </section>
      )}
      <Label htmlFor="title">Product title</Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Label>Stock location</Label>
      {locations.isLoading ? (
        <Text>Loading locations…</Text>
      ) : locations.error ? (
        <Text role="alert">{locations.error.message}</Text>
      ) : (
        <Select value={location} onValueChange={setLocation}>
          <Select.Trigger>
            <Select.Value placeholder="Choose a location" />
          </Select.Trigger>
          <Select.Content>
            {locations.data?.stock_locations.map((l) => (
              <Select.Item key={l.id} value={l.id}>
                {l.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )}
      {source === "external" && (
        <>
          <Label htmlFor="default-price">Default price (EGP)</Label>
          <Input
            id="default-price"
            type="number"
            min="0.01"
            step="0.01"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
          />
          <Text size="small">A blank card price uses this value.</Text>
        </>
      )}
      <Heading level="h2">Cards ({cards.length})</Heading>
      <CardEditor
        cards={cards}
        errors={errors}
        onChange={setCards}
        editableIdentity={source === "csv"}
      />
      <Button
        disabled={
          create.isPending ||
          !title.trim() ||
          !location ||
          !cards.length ||
          errors.some(Boolean) ||
          (source === "external" && !loaded)
        }
        isLoading={create.isPending}
        onClick={() => create.mutate()}
      >
        Create draft product
      </Button>
    </Container>
  );
}
