import { type ReactNode } from "react";
import {
  TcgApiProvider,
  TcgSessionProvider,
  useTcgSession,
} from "@tcg/react-query";
import type { Category } from "@tcg/api-contracts";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import {
  mockCategories,
  mockChecklistDetails,
  mockChecklists,
} from "../lib/mockData";
import { useStore } from "../store/useStore";

function findCategory(
  categories: Category[],
  idOrSlug: string,
): Category | undefined {
  for (const category of categories) {
    if (category.id === idOrSlug || category.slug === idOrSlug) return category;
    const child = findCategory(category.children, idOrSlug);
    if (child) return child;
  }
}

export const SessionWrapper = ({ children }: { children: ReactNode }) => {
  const setUser = useStore((state) => state.setUser);
  return (
    <TcgSessionProvider
      onSessionChange={(session) => {
        setUser(session.data);
      }}
      client={api}
    >
      {children}
    </TcgSessionProvider>
  );
};
export function ApiHooksProvider({ children }: { children: ReactNode }) {
  const { client, status } = useTcgSession();

  return (
    <TcgApiProvider
      client={client}
      isAuthenticated={status === "authenticated"}
      notify={{ success: toast.success, error: toast.error }}
      fallbacks={{
        categories: () => mockCategories,
        checklists: () => mockChecklists,
        checklist: (id) =>
          mockChecklistDetails.find((checklist) => checklist.id === id),
        category: (idOrSlug) => {
          const category = findCategory(mockCategories, idOrSlug);
          if (!category) return undefined;
          return {
            ...category,
            checklists: mockChecklists.filter(
              (checklist) =>
                checklist.category?.id === category.id ||
                checklist.subcategory?.id === category.id,
            ),
          };
        },
      }}
    >
      {children}
    </TcgApiProvider>
  );
}
