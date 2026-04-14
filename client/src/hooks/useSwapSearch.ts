import { useMutation } from "@tanstack/react-query";
import type { Governorate } from "../lib/constants";
import { api } from "../lib/api";
import type { Checklist } from "../store/useStore";

export type LastLogin =
  | "online"
  | "today"
  | "week"
  | "month"
  | "6months"
  | "all";
export type SearchFilters = {
  checklists?: number[];
  regions: Governorate | (string & {});
  lastLogin: LastLogin;
};
export type SwapResultMatch = {
  checklistId: number;
  checklist: Checklist;
  theyOffer: string[];
  theyNeed: string[];
};
export type SwapResult = {
  user: {
    id: number;
    fullName: string;
    username: string;
    governorate: Governorate | null;
    lastLoginAt: string;
  };
  totalMutalTrades: number;
  matches: SwapResultMatch[];
};
export const useSwapSearch = () => {
  return useMutation<SwapResult[], Error, SearchFilters>({
    mutationKey: ["swaps"],
    mutationFn: async (filters: SearchFilters) => {
      const res = await api.searchSwaps(filters);
      return res.data.data;
    },
  });
};
