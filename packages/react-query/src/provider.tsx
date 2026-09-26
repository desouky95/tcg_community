import { createContext, useContext, type ReactNode } from "react";
import type { ApiClient, AuthSession, Category, Checklist, User } from "@tcg/api-contracts";

export type QueryFallbacks = {
  categories?: () => Category[];
  checklists?: () => Checklist[];
  checklist?: (id: string) => Checklist | undefined;
  category?: (idOrSlug: string) => Category | undefined;
};

export type ApiHooksContextValue = {
  client: ApiClient;
  isAuthenticated: boolean;
  onAuthenticated?: (session: AuthSession) => void;
  onProfileUpdated?: (user: User) => void;
  notify?: { success: (message: string) => void; error: (message: string) => void };
  fallbacks?: QueryFallbacks;
};

const ApiHooksContext = createContext<ApiHooksContextValue | null>(null);

export function TcgApiProvider({ children, ...value }: ApiHooksContextValue & { children: ReactNode }) {
  return <ApiHooksContext.Provider value={value}>{children}</ApiHooksContext.Provider>;
}

export function useApiHooksContext() {
  const context = useContext(ApiHooksContext);
  if (!context) throw new Error("TCG API hooks must be used within TcgApiProvider");
  return context;
}
