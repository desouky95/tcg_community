import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useSwapMatch = (id: number | string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user-match", id],
    queryFn: async () => {
      return await api.userSwapMatch(id);
    },
    enabled: !!id && enabled,
  });
};
