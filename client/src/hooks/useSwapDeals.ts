import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useProposeSwapDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      conversation_id: number;
      swap_type: "in_person" | "postal";
      offered_cards: string;
      requested_cards: string;
    }) => api.proposeSwapDeal(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useAcceptSwapDeal = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.acceptSwapDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useUpdatePostalDeal = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      api.updatePostalDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};

export const useMarkDealReceived = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.markDealReceived(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};

export const useScanDealQr = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.scanDealQr(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
};
