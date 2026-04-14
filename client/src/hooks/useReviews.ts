import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Review } from '../store/useStore';

export const useReviews = (userId: string | undefined) => {
  return useQuery<Review[]>({
    queryKey: ['reviews', userId],
    queryFn: async () => {
      const { data } = await api.getUserReviews(userId!);
      return data;
    },
    enabled: !!userId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { targetUserId: string; type: 'positive' | 'negative'; comment: string }) =>
      api.addReview(data.targetUserId, data.type, data.comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.targetUserId] });
    },
  });
};
