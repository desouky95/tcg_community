import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { SwapResult } from "./useSwapSearch";

export const useSwapMatch = (id: number | string, enabled: boolean = true) => {
  return useQuery<SwapResult | undefined>({
    queryKey: ["user-match", id],
    queryFn: async () => {
      const res = await api.userSwapMatch(id);
      return res.data;
    },
    enabled: !!id && enabled,
  });
};
