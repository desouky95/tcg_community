import { create } from "zustand";

export type Category = {
  id: string;
  name: string;
  parentId: number;
  children: Category[];
};

export type ExtendedCategory = Omit<Category, "children"> & {
  userChecklists: UserChecklist[];
  children: ExtendedCategory[];
};

export type User = {
  id: number | string;
  fullName: string;
  username: string;
  email: string | null;
  mobile: string;
  role: "admin" | "user" | "super_admin";
  blocked: boolean;
  points: number;
  positiveReviewsCount: number;
  negativeReviewsCount: number;
  lastLoginAt: string | null;
  governorate: string | null;
  notReadyForSwap: boolean;
  isVerified: boolean;
  checklists?: UserChecklist[];
};

export type ExtendedUser = User & {
  categories: ExtendedCategory[];
};

export type UserChecklist = {
  id: string;
  checklistId: string;
  name: string;
  missingList: string | null;
  duplicatesList: string | null;
  collectedList: string | null;
  missingListArray?: string[];
  duplicatesListArray?: string[];
  collectedListArray?: string[];
  updatedAt: string;
  subCategory?: Category[];
  checklist?: Checklist;
};

export type Review = {
  id: string;
  reviewerId: string;
  targetUserId: string;
  type: "positive" | "negative";
  comment: string;
};

export type Card = {
  number: string;
  name: string;
  type: string;
  section: string;
  needCount?: number;
  holdCount?: number;
  offerCount?: number;
  ratio?: string;
};

export type Checklist = {
  id: string;
  type: "card" | "sticker";
  name: string;
  year: number;
  totalCards: number;
  categoryId: number;
  subcategoryId: number | null;
  category?: Category;
  subcategory?: Category;
  cards?: Card[];
  userChecklist?: UserChecklist;
};

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
