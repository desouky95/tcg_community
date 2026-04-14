import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Checklist } from "../store/useStore";

export const useChecklists = () => {
  return useQuery<Checklist[]>({
    queryKey: ["checklists"],
    queryFn: async () => {
      const { data } = await api.getChecklists();
      return data;
    },
  });
};

export const useChecklist = (id: string | undefined) => {
  return useQuery<Checklist>({
    queryKey: ["checklists", id],
    queryFn: async () => {
      const { data } = await api.getChecklist(id!);
      return data.data;
    },
  });
};

export const useAddChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.addChecklist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
  });
};

export const useUpdateChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: never }) =>
      api.updateChecklist(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({
        queryKey: ["checklists", String(data.data.id)],
      });
    },
  });
};

export const useDeleteChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteChecklist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
  });
};
