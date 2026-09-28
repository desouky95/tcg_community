import { create } from "zustand";
import type { User } from "@tcg/api-contracts";
import { persist } from "zustand/middleware";
export type {
  Card,
  Category,
  Checklist,
  ExtendedCategory,
  ExtendedUser,
  Review,
  User,
  UserChecklist,
} from "@tcg/api-contracts";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>()(
  persist<AppState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user",
    },
  ),
);

export default useStore;
