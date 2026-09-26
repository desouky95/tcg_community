import { createApiClient } from "@tcg/api-contracts";
import { useStore } from "../store/useStore";

export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1",
  getAccessToken: () => useStore.getState().token,
});
