// @vitest-environment node

import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  createApiClient,
  getQueryKey,
  resolveQuery,
  type SearchParamsLike,
} from "@tcg/api-contracts";
import { describe, expect, it } from "vitest";

function createRecordingClient(defaultQuery = "q=pokemon&limit=20") {
  const requests: InternalAxiosRequestConfig[] = [];
  const axiosInstance = axios.create({
    adapter: async (config) => {
      requests.push(config);
      return {
        config,
        data: { data: [] },
        headers: {},
        status: 200,
        statusText: "OK",
      };
    },
  });

  return {
    client: createApiClient({
      axiosInstance,
      baseURL: "http://localhost:3333/api/v1",
      getDefaultQuery: () => new URLSearchParams(defaultQuery),
    }),
    requests,
  };
}

function requestQuery(config: InternalAxiosRequestConfig) {
  return config.params instanceof URLSearchParams
    ? config.params.toString()
    : "";
}

describe("API client query resolution", () => {
  it("merges defaults, replaces arrays, removes nulls, and sorts keys", () => {
    const query = resolveQuery(new URLSearchParams("z=last&q=old&type=card"), {
      query: {
        q: null,
        limit: 0,
        published: false,
        type: ["sticker", "parallel"],
        ignored: undefined,
      },
    });

    expect(query.toString()).toBe(
      "limit=0&published=false&type=sticker&type=parallel&z=last",
    );
  });

  it("supports replace mode and empty arrays", () => {
    expect(
      getQueryKey(new URLSearchParams("q=old&limit=20"), {
        queryMode: "replace",
        query: { cursor: "next", type: [] },
      }),
    ).toBe("cursor=next");
  });

  it("accepts structurally compatible read-only search params", () => {
    const nextLike = {
      entries() {
        return [
          ["type", "card"],
          ["type", "sticker"],
          ["q", "world cup"],
        ][Symbol.iterator]() as IterableIterator<readonly [string, string]>;
      },
    } satisfies SearchParamsLike;

    expect(getQueryKey(nextLike)).toBe("q=world+cup&type=card&type=sticker");
  });

  it("inherits defaults for reads but not mutations", async () => {
    const { client, requests } = createRecordingClient();

    await client.getCategories();
    await client.login({ uid: "01000000000", password: "secret" });
    await client.login(
      { uid: "01000000000", password: "secret" },
      { query: { source: "invite" } },
    );

    expect(requestQuery(requests[0]!)).toBe("limit=20&q=pokemon");
    expect(requestQuery(requests[1]!)).toBe("");
    expect(requestQuery(requests[2]!)).toBe("source=invite");
  });

  it("lets endpoint-owned parameters override inherited and per-call values", async () => {
    const { client, requests } = createRecordingClient("page=9&limit=20");

    await client.getMessages("conversation", 2, {
      query: { page: 7, limit: 50 },
    });

    expect(requestQuery(requests[0]!)).toBe("limit=50&page=2");
  });

  it("keeps request-scoped client defaults isolated", () => {
    const first = createApiClient({
      baseURL: "http://api.test",
      getDefaultQuery: () => ({ requestId: "first" }),
    });
    const second = createApiClient({
      baseURL: "http://api.test",
      getDefaultQuery: () => ({ requestId: "second" }),
    });

    expect(first.getQueryKey()).toBe("requestId=first");
    expect(second.getQueryKey()).toBe("requestId=second");
  });
});
