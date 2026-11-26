import { createApiClient } from "@tcg/api-contracts";

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1",
  // getDefaultQuery: getDefaultApiQuery,
  withCredentials: true,
  
});

let csrfRequest: Promise<unknown> | undefined;

api.http.interceptors.request.use(async (config) => {
  if (
    typeof window !== "undefined" &&
    config.url?.startsWith("/auth/") &&
    ["post", "put", "patch", "delete"].includes(config.method ?? "")
  ) {
    // Await browser cookie delivery before Axios reads the XSRF token.
    csrfRequest ??= api.http.get("/auth/csrf").finally(() => {
      csrfRequest = undefined;
    });
    await csrfRequest;
  }
  return config;
});
