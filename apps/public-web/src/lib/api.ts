import { createApiClient } from "@tcg/api-contracts";
import "./env.config";

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1",
  withCredentials: true,
});
