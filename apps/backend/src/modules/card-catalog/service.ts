import { logger } from "@medusajs/framework";

export default class CardCatalogService {
  constructor(
    {},
    private options: {
      baseUrl: string;
      apiKey?: string;
    }
  ) {}

  async getCollection(id: string) {
    const result = await this.request<{
      collection: import("./types").ExternalCollection;
    }>(`/collections/${encodeURIComponent(id)}`);
    return result.collection;
  }

  async retrieveCollection(id: string) {
    return this.getCollection(id);
  }

  async getCollectionCards(
    collectionId: string,
    query?: {
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const params = new URLSearchParams();

    if (query?.search) {
      params.set("search", query.search);
    }

    if (query?.page) {
      params.set("page", String(query.page));
    }

    if (query?.limit) {
      params.set("limit", String(query.limit));
    }

    return this.request<{
      collection: import("./types").ExternalCollection;
      cards: import("./types").ExternalCard[];
      total: number;
      page: number;
      limit: number;
    }>(`/collections/${encodeURIComponent(collectionId)}/cards?${params}`);
  }

  async getCards(ids: string[]) {
    return this.request<import("./types").BatchCardsResponse>("/cards/batch", {
      method: "POST",
      body: JSON.stringify({
        ids,
      }),
    });
  }

  async retrieveCards(ids: string[]) {
    const cards: import("./types").ExternalCard[] = [];
    for (let i = 0; i < ids.length; i += 100) {
      const result = await this.getCards(ids.slice(i, i + 100));
      cards.push(...result.cards);
    }
    return cards;
  }

  async listCollections(search = "", page = 1) {
    const params = new URLSearchParams({
      search,
      page: String(page),
      limit: "50",
    });
    return this.request<{
      collections: import("./types").ExternalCollection[];
      total: number;
    }>(`/collections?${params}`);
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(
      `${this.options.baseUrl.replace(/\/$/, "")}${path}`,
      {
        ...init,
        headers: {
          "Content-Type": "application/json",

          ...(this.options.apiKey
            ? {
                Authorization: `Bearer ${this.options.apiKey}`,
              }
            : {}),

          ...init?.headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Catalog API error ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
