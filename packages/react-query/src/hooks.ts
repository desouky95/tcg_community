import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  Checklist,
  ChecklistWritePayload,
  ConversationListDto,
  ConversationMessagesResponse,
  ExtendedUser,
  LoginInput,
  ProposeSwapDealInput,
  Review,
  SearchFilters,
  SignupInput,
  SwapResult,
  User,
  UserChecklist,
} from "@tcg/api-contracts";
import { useApiHooksContext } from "./provider";
import { queryKeys } from "./query-keys";

export function useAuth() {
  const { client, onAuthenticated } = useApiHooksContext();
  const requestOtp = useMutation({ mutationFn: (mobile: string) => client.requestOtp(mobile) });
  const verifyOtp = useMutation({
    mutationFn: async ({ mobile, otp }: { mobile: string; otp: string }) => (await client.verifyOtp(mobile, otp)).data,
    onSuccess: (response) => onAuthenticated?.(response.data),
  });
  const login = useMutation({
    mutationFn: async (credentials: LoginInput) => (await client.login(credentials)).data,
    onSuccess: (response) => onAuthenticated?.(response.data),
  });
  const signup = useMutation({ mutationFn: (data: SignupInput) => client.signup(data) });
  return { requestOtp, verifyOtp, login, signup };
}

export function useCategories() {
  const { client, fallbacks } = useApiHooksContext();
  return useQuery<Category[]>({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      try { return (await client.getCategories()).data; }
      catch (error) { if (fallbacks?.categories) return fallbacks.categories(); throw error; }
    },
  });
}

export function useCategory(idOrSlug: string | undefined) {
  const { client, fallbacks } = useApiHooksContext();
  return useQuery<Category | null>({
    queryKey: queryKeys.category(idOrSlug),
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      try { return (await client.getCategory(idOrSlug!)).data; }
      catch (error) { if (fallbacks?.category) return fallbacks.category(idOrSlug!) ?? null; throw error; }
    },
  });
}

export function useCategoryMutations() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.categories });
  return {
    addCategory: useMutation({ mutationFn: (name: string) => client.addCategory(name), onSuccess: invalidate }),
    addSubcategory: useMutation({ mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) => client.addSubcategory(categoryId, name), onSuccess: invalidate }),
    deleteCategory: useMutation({ mutationFn: (id: string) => client.deleteCategory(id), onSuccess: invalidate }),
  };
}

export function useChecklists() {
  const { client, fallbacks } = useApiHooksContext();
  return useQuery<Checklist[]>({
    queryKey: queryKeys.checklists,
    queryFn: async () => {
      try { return (await client.getChecklists()).data; }
      catch (error) { if (fallbacks?.checklists) return fallbacks.checklists(); throw error; }
    },
  });
}

export function useChecklist(id: string | undefined) {
  const { client, fallbacks } = useApiHooksContext();
  return useQuery<Checklist>({
    queryKey: queryKeys.checklist(id),
    enabled: Boolean(id),
    queryFn: async () => {
      try { return (await client.getChecklist(id!)).data.data; }
      catch (error) {
        const fallback = fallbacks?.checklist?.(id!);
        if (fallback) return fallback;
        throw error;
      }
    },
  });
}

export function useAddChecklist() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (data: ChecklistWritePayload) => client.addChecklist(data), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.checklists }) });
}

export function useUpdateChecklist() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChecklistWritePayload }) => client.updateChecklist(id, data),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.checklists });
      void queryClient.invalidateQueries({ queryKey: queryKeys.checklist(String(response.data.id)) });
    },
  });
}

export function useDeleteChecklist() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: string) => client.deleteChecklist(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.checklists }) });
}

export function useUserChecklist(id?: string) {
  const { client } = useApiHooksContext();
  return useQuery<UserChecklist | null>({ queryKey: queryKeys.userChecklist(id), enabled: Boolean(id), queryFn: async () => id ? (await client.getUserChecklist(id)).data : null });
}

export function useUserChecklistMutation(id?: string) {
  const { client } = useApiHooksContext();
  return useMutation({ mutationKey: queryKeys.userChecklist(id), mutationFn: async () => id ? (await client.getUserChecklist(id)).data : null });
}

export function useUpdateUserChecklist() {
  const { client, notify } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => (await client.updateUserChecklist(id, data)).data,
    onSuccess: (_, { id }) => { void queryClient.invalidateQueries({ queryKey: queryKeys.checklist(id) }); notify?.success("Progress saved successfully"); },
    onError: () => notify?.error("Failed to save progress"),
  });
}

export function useUsers() {
  const { client } = useApiHooksContext();
  return useQuery<User[]>({ queryKey: queryKeys.users, queryFn: async () => (await client.getUsers()).data.data });
}

export function useProfile() {
  const { client } = useApiHooksContext();
  return useQuery<{ data: ExtendedUser }>({ queryKey: queryKeys.profile, queryFn: async () => (await client.getProfile()).data });
}

export function useUserInfo(id: string | undefined) {
  const { client } = useApiHooksContext();
  return useQuery<{ data: ExtendedUser }>({ queryKey: queryKeys.user(id), enabled: Boolean(id), queryFn: async () => (await client.getUserInfo(id!)).data });
}

export function useBlockUser() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => client.blockUser(id, blocked),
    onSuccess: (_, { id }) => { void queryClient.invalidateQueries({ queryKey: queryKeys.users }); void queryClient.invalidateQueries({ queryKey: queryKeys.user(id) }); },
  });
}

export function useUpdateProfile() {
  const { client, onProfileUpdated } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => client.updateProfile(data),
    onSuccess: (response) => {
      const user = response.data.user;
      onProfileUpdated?.(user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      void queryClient.invalidateQueries({ queryKey: queryKeys.user(String(user.id)) });
    },
  });
}

export function useReviews(userId: string | undefined) {
  const { client } = useApiHooksContext();
  return useQuery<Review[]>({ queryKey: queryKeys.reviews(userId), enabled: Boolean(userId), queryFn: async () => (await client.getUserReviews(userId!)).data });
}

export function useAddReview() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetUserId, type, comment }: { targetUserId: string; type: Review["type"]; comment: string }) => client.addReview(targetUserId, type, comment),
    onSuccess: (_, { targetUserId }) => { void queryClient.invalidateQueries({ queryKey: queryKeys.reviews(targetUserId) }); void queryClient.invalidateQueries({ queryKey: queryKeys.user(targetUserId) }); },
  });
}

export function useConversations() {
  const { client, isAuthenticated } = useApiHooksContext();
  return useQuery<ConversationListDto[]>({ queryKey: queryKeys.conversations, enabled: isAuthenticated, refetchInterval: 10_000, queryFn: async () => (await client.getConversations()).data.data as ConversationListDto[] });
}

export function useConversationMessages(conversationId: string | number | undefined) {
  const { client } = useApiHooksContext();
  return useQuery<ConversationMessagesResponse>({ queryKey: queryKeys.messages(conversationId), enabled: Boolean(conversationId), refetchInterval: 3_000, queryFn: async () => (await client.getMessages(conversationId!)).data as ConversationMessagesResponse });
}

export function useFindOrCreateConversation() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: async (targetUserId: number) => (await client.findOrCreateConversation(targetUserId)).data.data, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.conversations }) });
}

export function useSendMessage() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => (await client.sendMessage(conversationId, content)).data.data,
    onSuccess: (_, { conversationId }) => { void queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) }); void queryClient.invalidateQueries({ queryKey: queryKeys.conversations }); },
  });
}

export function useSwapSearch() {
  const { client } = useApiHooksContext();
  return useMutation<SwapResult[], Error, SearchFilters>({ mutationKey: queryKeys.swaps, mutationFn: async (filters) => (await client.searchSwaps(filters)).data.data });
}

export function useSwapMatch(id: number | string, enabled = true) {
  const { client } = useApiHooksContext();
  return useQuery<SwapResult | undefined>({ queryKey: queryKeys.swapMatch(id), enabled: Boolean(id) && enabled, queryFn: async () => (await client.userSwapMatch(id)).data });
}

export function useProposeSwapDeal() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProposeSwapDealInput) => client.proposeSwapDeal(data),
    onSuccess: (_, data) => { void queryClient.invalidateQueries({ queryKey: queryKeys.messages(data.conversation_id) }); void queryClient.invalidateQueries({ queryKey: queryKeys.conversations }); },
  });
}

function useDealMutation(conversationId: number, mutation: (client: ReturnType<typeof useApiHooksContext>["client"], id: number) => Promise<unknown>) {
  const context = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: number) => mutation(context.client, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) }) });
}

export const useAcceptSwapDeal = (conversationId: number) => useDealMutation(conversationId, (client, id) => client.acceptSwapDeal(id));
export const useMarkDealReceived = (conversationId: number) => useDealMutation(conversationId, (client, id) => client.markDealReceived(id));
export const useScanDealQr = (conversationId: number) => useDealMutation(conversationId, (client, id) => client.scanDealQr(id));

export function useUpdatePostalDeal(conversationId: number) {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: FormData }) => client.updatePostalDeal(id, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) }) });
}

export function useDashboardStats() {
  const users = useUsers();
  const collections = useChecklists();
  const categories = useCategories();
  return { users: users.data, collections: collections.data, categories: categories.data, isLoading: users.isLoading || collections.isLoading || categories.isLoading };
}
