import { create } from "zustand";
import type { AuthResponse, ExtendedUser, User } from "@tcg/api-contracts";
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
  setUser: (user: User | ExtendedUser | null) => void;
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
