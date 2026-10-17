import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiRequestOptions,
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  APIResponse,
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
  Card,
  ImportChecklistPayload,
} from "@tcg/api-contracts";
import { getQueryKey } from "@tcg/api-contracts";
import { useApiHooksContext } from "./provider";
import { queryKeys, withQueryKey } from "./query-keys";
import type { UseCategoryMutationsArgs } from "./models";

export function useAuth() {
  const { client, onAuthenticated, onLoggedOut } = useApiHooksContext();
  const requestOtp = useMutation({
    mutationFn: async (mobile: string) =>
      (await client.requestOtp(mobile)).data,
  });
  const verifyOtp = useMutation({
    mutationFn: async ({ mobile, otp }: { mobile: string; otp: string }) =>
      (await client.verifyOtp(mobile, otp)).data,
    onSuccess: (response) => onAuthenticated?.(response.data),
  });
  const login = useMutation({
    mutationFn: async (credentials: LoginInput) =>
      (await client.login(credentials)).data,
    onSuccess: (response) => onAuthenticated?.(response.data),
  });
  const signup = useMutation({
    mutationFn: async (data: SignupInput) => (await client.signup(data)).data,
  });
  const logout = useMutation({
    mutationFn: async () => await client.logout(),
    onSuccess: () => onLoggedOut?.(),
  });

  return { requestOtp, verifyOtp, login, signup, logout };
}

export function useRequestOtp() {
  // return useQuery({
  // })
}
export function useSession(enabled = true, requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery } = useApiHooksContext();

  const session = useQuery({
    enabled,
    queryFn: async () => (await client.me(requestOptions)).data,
    queryKey: withQueryKey(
      queryKeys.me,
      getQueryKey(defaultQuery, requestOptions),
    ),
  });

  return { session };
}

export function useCategories(requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery({
    queryKey: withQueryKey(
      queryKeys.categories,
      getQueryKey(defaultQuery, requestOptions),
    ),
    queryFn: async () => {
      try {
        return (await client.getCategories(requestOptions)).data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useCategory(
  idOrSlug: string | undefined,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery, fallbacks } = useApiHooksContext();
  return useQuery<Category | null>({
    queryKey: withQueryKey(
      queryKeys.category(idOrSlug),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      try {
        return (await client.getCategory(idOrSlug!, requestOptions)).data.data;
      } catch (error) {
        if (fallbacks?.category) return fallbacks.category(idOrSlug!) ?? null;
        throw error;
      }
    },
  });
}

export function useCategoryMutations(options?: UseCategoryMutationsArgs) {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    void queryClient.invalidateQueries({ queryKey: ["category"] });
  };
  return {
    createCategory: useMutation({
      mutationFn: async (data: CategoryCreatePayload) =>
        (await client.createCategory(data)).data,
      onSuccess: (data, variables, onMutateResult, context) => {
        options?.update?.onSuccess?.(data, variables, onMutateResult, context);
        invalidate();
      },
      ...options?.update,
    }),
    updateCategory: useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: CategoryUpdatePayload;
      }) => (await client.updateCategory(id, data)).data,
      onSuccess: () => invalidate(),
    }),
    addSubcategory: useMutation({
      mutationFn: async ({
        categoryId,
        name,
      }: {
        categoryId: string;
        name: string;
      }) => (await client.addSubcategory(categoryId, name)).data,
      onSuccess: () => invalidate(),
    }),
    deleteCategory: useMutation({
      mutationFn: async (id: string) => (await client.deleteCategory(id)).data,
      onSuccess: () => invalidate(),
    }),
  };
}

export function useChecklists(requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery, fallbacks } = useApiHooksContext();
  return useQuery<Checklist[]>({
    queryKey: withQueryKey(
      queryKeys.checklists,
      getQueryKey(defaultQuery, requestOptions),
    ),
    queryFn: async () => {
      try {
        return (await client.getChecklists(undefined, requestOptions)).data
          .data;
      } catch (error) {
        if (fallbacks?.checklists && requestOptions?.fallback)
          return fallbacks.checklists();
        throw error;
      }
    },
  });
}

export function useChecklist(
  id: string | undefined,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery, fallbacks } = useApiHooksContext();
  return useQuery<Checklist>({
    queryKey: withQueryKey(
      queryKeys.checklist(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(id),
    queryFn: async () => {
      try {
        return (await client.getChecklist(id!, requestOptions)).data.data;
      } catch (error) {
        const fallback = fallbacks?.checklist?.(id!);
        if (fallback) return fallback;
        throw error;
      }
    },
  });
}

export function useChecklistCards(
  id?: string,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<APIResponse<Card[]>>({
    queryKey: withQueryKey(
      queryKeys.checklistCards(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(id),
    queryFn: async () => {
      try {
        return (await client.getChecklistCards(id!, requestOptions)).data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useDownloadChecklist(
  id: string | undefined,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery, fallbacks } = useApiHooksContext();
  return useMutation<Blob>({
    mutationKey: withQueryKey(
      queryKeys.checklist(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    mutationFn: async () => {
      try {
        return (await client.downloadChecklist(id!, requestOptions)).data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export function useAddChecklist() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChecklistWritePayload) =>
      (await client.addChecklist(data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.checklists }),
  });
}

export function useUpdateChecklist() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ChecklistWritePayload;
    }) => (await client.updateChecklist(id, data)).data,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.checklists });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.checklist(String(response.data.id)),
      });
    },
  });
}

export function useDeleteChecklist() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await client.deleteChecklist(id)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.checklists }),
  });
}

export function useUserChecklist(
  id: string,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<APIResponse<UserChecklist>>({
    queryKey: withQueryKey(
      queryKeys.userChecklist(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(id),
    queryFn: async () =>
      (await client.getUserChecklist(id!, requestOptions)).data,
  });
}

export function useUserChecklistMutation(
  id?: string,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useMutation({
    mutationKey: withQueryKey(
      queryKeys.userChecklist(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    mutationFn: async () =>
      id ? (await client.getUserChecklist(id, requestOptions)).data : null,
  });
}

export function useUpdateUserChecklist() {
  const { client, notify } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) =>
      (await client.updateUserChecklist(id, data)).data,
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.checklist(id) });
      notify?.success("Progress saved successfully");
    },
    onError: () => notify?.error("Failed to save progress"),
  });
}

export function useImportUserChecklist() {
  const { client, notify } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) =>
      (await client.importUserChecklist(id, data)).data,
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userChecklist(id),
      });
      notify?.success("Progress saved successfully");
    },
    onError: () => notify?.error("Failed to save progress"),
  });
}

export function useUsers(requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<User[]>({
    queryKey: withQueryKey(
      queryKeys.users,
      getQueryKey(defaultQuery, requestOptions),
    ),
    queryFn: async () => (await client.getUsers(requestOptions)).data.data,
  });
}

export function useProfile(requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<APIResponse<ExtendedUser>>({
    queryKey: withQueryKey(
      queryKeys.profile,
      getQueryKey(defaultQuery, requestOptions),
    ),
    queryFn: async () => (await client.getProfile(requestOptions)).data,
  });
}

export function useUserInfo(
  id: string | undefined,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<APIResponse<ExtendedUser>>({
    queryKey: withQueryKey(
      queryKeys.user(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(id),
    queryFn: async () => (await client.getUserInfo(id!, requestOptions)).data,
  });
}

export function useBlockUser() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) =>
      (await client.blockUser(id, blocked)).data,
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users });
      void queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
    },
  });
}

export function useUpdateProfile() {
  const { client, onProfileUpdated } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) =>
      (await client.updateProfile(data)).data,
    onSuccess: (response) => {
      const user = response.data.user;
      onProfileUpdated?.(user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user(String(user.id)),
      });
    },
  });
}

export function useReviews(
  userId: string | undefined,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<Review[]>({
    queryKey: withQueryKey(
      queryKeys.reviews(userId),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(userId),
    queryFn: async () =>
      (await client.getUserReviews(userId!, requestOptions)).data,
  });
}

export function useAddReview() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      targetUserId,
      type,
      comment,
    }: {
      targetUserId: string;
      type: Review["type"];
      comment: string;
    }) => client.addReview(targetUserId, type, comment),
    onSuccess: (_, { targetUserId }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.reviews(targetUserId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user(targetUserId),
      });
    },
  });
}

export function useConversations(requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery, isAuthenticated } = useApiHooksContext();
  return useQuery<ConversationListDto[]>({
    queryKey: withQueryKey(
      queryKeys.conversations,
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: isAuthenticated,
    refetchInterval: 10_000,
    queryFn: async () =>
      (await client.getConversations(requestOptions)).data.data,
  });
}

export function useConversationMessages(
  conversationId: string | number | undefined,
  page = 1,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<ConversationMessagesResponse>({
    queryKey: withQueryKey(
      queryKeys.messages(conversationId),
      getQueryKey(defaultQuery, requestOptions, { page }),
    ),
    enabled: Boolean(conversationId),
    refetchInterval: 3_000,
    queryFn: async () =>
      (await client.getMessages(conversationId!, page, requestOptions)).data,
  });
}

export function useFindOrCreateConversation() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetUserId: number) =>
      (await client.findOrCreateConversation(targetUserId)).data.data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations }),
  });
}

export function useSendMessage() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: number;
      content: string;
    }) => (await client.sendMessage(conversationId, content)).data.data,
    onSuccess: (_, { conversationId }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages(conversationId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export function useSwapSearch() {
  const { client } = useApiHooksContext();
  return useMutation<SwapResult[], Error, SearchFilters>({
    mutationKey: queryKeys.swaps,
    mutationFn: async (filters) =>
      (await client.searchSwaps(filters)).data.data,
  });
}

export function useSwapMatch(
  id: number | string,
  enabled = true,
  requestOptions?: ApiRequestOptions,
) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery<SwapResult | undefined>({
    queryKey: withQueryKey(
      queryKeys.swapMatch(id),
      getQueryKey(defaultQuery, requestOptions),
    ),
    enabled: Boolean(id) && enabled,
    queryFn: async () => (await client.userSwapMatch(id, requestOptions)).data,
  });
}

export function useProposeSwapDeal() {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProposeSwapDealInput) =>
      (await client.proposeSwapDeal(data)).data,
    onSuccess: (_, data) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages(data.conversation_id),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

function useDealMutation<T>(
  conversationId: number,
  mutation: (
    client: ReturnType<typeof useApiHooksContext>["client"],
    id: number,
  ) => Promise<{ data: APIResponse<T> }>,
) {
  const context = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await mutation(context.client, id)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(conversationId),
      }),
  });
}

export const useAcceptSwapDeal = (conversationId: number) =>
  useDealMutation(conversationId, (client, id) => client.acceptSwapDeal(id));
export const useMarkDealReceived = (conversationId: number) =>
  useDealMutation(conversationId, (client, id) => client.markDealReceived(id));
export const useScanDealQr = (conversationId: number) =>
  useDealMutation(conversationId, (client, id) => client.scanDealQr(id));

export function useUpdatePostalDeal(conversationId: number) {
  const { client } = useApiHooksContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) =>
      (await client.updatePostalDeal(id, data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(conversationId),
      }),
  });
}

export function useDashboardStats(requestOptions?: ApiRequestOptions) {
  const users = useUsers(requestOptions);
  const collections = useChecklists(requestOptions);
  const categories = useCategories(requestOptions);
  return {
    users: users.data,
    collections: collections.data,
    categories: categories.data,
    isLoading: users.isLoading || collections.isLoading || categories.isLoading,
  };
}

export function useScrapperList(requestOptions?: ApiRequestOptions) {
  const { client, defaultQuery } = useApiHooksContext();
  return useQuery({
    queryKey: withQueryKey(
      queryKeys.scrapperList,
      getQueryKey(defaultQuery, requestOptions),
    ),
    queryFn: async () => (await client.getScrapperList(requestOptions)).data,
  });
}
