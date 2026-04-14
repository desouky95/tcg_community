import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ExtendedUser, User } from "../store/useStore";
import { useStore } from "../store/useStore";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.getUsers();
      return data.data;
    },
  });
};

export const useProfile = () => {
  return useQuery<{ data: ExtendedUser }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.getProfile();
      return data;
    },
  });
};

export const useUserInfo = (id: string | undefined) => {
  return useQuery<{ data: ExtendedUser }>({
    queryKey: ["users", id],
    queryFn: async () => {
      const { data } = await api.getUserInfo(id!);
      return data;
    },
    enabled: !!id,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      api.blockUser(id, blocked),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUserStore = useStore((state) => (state as any).updateUser);

  return useMutation({
    mutationFn: (data: Partial<User>) => api.updateProfile(data),
    onSuccess: (res) => {
      const updatedUser = res.data.user;
      if (updateUserStore) {
        updateUserStore(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["users", updatedUser.id] });
    },
  });
};
