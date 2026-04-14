import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Category } from '../store/useStore';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.getCategories();
      return data;
    },
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const addCategory = useMutation({
    mutationFn: (name: string) => api.addCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const addSubcategory = useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) => 
      api.addSubcategory(categoryId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    addCategory,
    addSubcategory,
    deleteCategory,
  };
};
