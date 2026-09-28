import { queryKeys } from "@tcg/react-query";
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export function useSession() {
  const session = useQuery({
    enabled: false,
    queryFn: async () => (await api.me()).data,
    queryKey: queryKeys.me,
  });

  return { session };
}
