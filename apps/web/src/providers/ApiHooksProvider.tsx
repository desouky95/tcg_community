import type { ReactNode } from "react";
import { TcgApiProvider } from "@tcg/react-query";
import type { Category } from "@tcg/api-contracts";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { mockCategories, mockChecklistDetails, mockChecklists } from "../lib/mockData";
import { useStore } from "../store/useStore";

function findCategory(categories: Category[], idOrSlug: string): Category | undefined {
  for (const category of categories) {
    if (category.id === idOrSlug || category.slug === idOrSlug) return category;
    const child = findCategory(category.children, idOrSlug);
    if (child) return child;
  }
}

export function ApiHooksProvider({ children }: { children: ReactNode }) {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);
  const updateUser = useStore((state) => state.updateUser);

  return (
    <TcgApiProvider
      client={api}
      isAuthenticated={Boolean(user)}
      onAuthenticated={({ user: authenticatedUser, token }) => login(authenticatedUser, token)}
      onProfileUpdated={updateUser}
      notify={{ success: toast.success, error: toast.error }}
      fallbacks={{
        categories: () => mockCategories,
        checklists: () => mockChecklists,
        checklist: (id) => mockChecklistDetails.find((checklist) => checklist.id === id),
        category: (idOrSlug) => {
          const category = findCategory(mockCategories, idOrSlug);
          if (!category) return undefined;
          return {
            ...category,
            checklists: mockChecklists.filter(
              (checklist) => checklist.category?.id === category.id || checklist.subcategory?.id === category.id,
            ),
          };
        },
      }}
    >
      {children}
    </TcgApiProvider>
  );
}
