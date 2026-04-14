import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import toast from "react-hot-toast";

export function useUserChecklist(id?: string) {
  return useQuery({
    queryKey: ["user-checklist", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.getUserChecklist(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useUserChecklistMutation(id?: string) {
  return useMutation({
    mutationKey: ["user-checklist", id],
    mutationFn: async () => {
      if (!id) return null;
      const res = await api.getUserChecklist(id);
      return res.data;
    },
  });
}

export function useUpdateUserChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const res = await api.updateUserChecklist(id, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["checklists", id],
      });

      toast.success("Progress saved successfully");
    },
    onError: () => {
      toast.error("Failed to save progress");
    },
  });
}
