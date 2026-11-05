import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  Skeleton,
  
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

type Collection = { id: string; name: string; year?: number | null };
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

const CardCollectionsPage = () => {
  const [collectionSearch, setCollectionSearch] = useState("");

  const params = new URLSearchParams({
    search: collectionSearch,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections", params.toString()],
    queryFn: () => {
      return request<{
        collections?: Collection[];
        cards?: Card[];
        total: number;
      }>(`/admin/card-collections/catalog?${params}`);
    },
  });

  if (isLoading)
    return (
      <Container>
        <Skeleton />
      </Container>
    );

  return (
    <Container>
      <div>
        <Heading level="h1">Create a card collection</Heading>
        <Text className="text-ui-fg-subtle mt-2">
          Choose a checklist and cards to create a draft product. Cards start
          with no stock.
        </Text>
      </div>
      {error && (
        <div
          role="alert"
          className="bg-ui-bg-subtle text-ui-fg-error rounded-md p-3"
        >
          {error.message}
        </div>
      )}
      <section className="flex flex-col gap-3">
        <label htmlFor="checklist-search">Search checklists</label>
        <Input
          id="checklist-search"
          value={collectionSearch}
          onChange={(e) => {
            setCollectionSearch(e.target.value);
          }}
          placeholder="Checklist name"
        />

        <ul className="divide-y divide-ui-border-base">
          {data?.collections?.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span>
                {item.name}
                {item.year ? ` (${item.year})` : ""}
              </span>
              <Link to={`${item.id}`}>
                <Button variant="secondary">Choose</Button>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
};

export const config = defineRouteConfig({ label: "Card collections" });

export const handle = {
  seo: () => ({
    title: "Card Collections",
  }),
};
export default CardCollectionsPage;
