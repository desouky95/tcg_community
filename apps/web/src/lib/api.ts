import { createApiClient } from "@tcg/api-contracts";
import { getDefaultApiQuery } from "./request-query";

export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1",
  getDefaultQuery: getDefaultApiQuery,
  withCredentials: true,
  scrapperToken: import.meta.env.VITE_SCRAPPER_API_KEY,
});
