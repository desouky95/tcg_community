import { create } from "zustand";
import type { User } from "@tcg/api-contracts";

export type { Card, Category, Checklist, ExtendedCategory, ExtendedUser, Review, User, UserChecklist } from "@tcg/api-contracts";

interface AppState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  updateUser: (user: User) => void;
}

export const useStore = create<AppState>((set) => ({
  user: JSON.parse(localStorage.getItem("tcg_user") || "null"),
  token: localStorage.getItem("tcg_token"),
  login: (user, token) => {
    localStorage.setItem("tcg_user", JSON.stringify(user));
    localStorage.setItem("tcg_token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("tcg_user");
    localStorage.removeItem("tcg_token");
    set({ user: null, token: null });
  },
  updateUser: (user) => {
    localStorage.setItem("tcg_user", JSON.stringify(user));
    set({ user });
  },
  updatePoints: (points) =>
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, points };
      localStorage.setItem("tcg_user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
}));
