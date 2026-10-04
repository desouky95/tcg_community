import axios, { type AxiosInstance } from "axios";
import type {
  APIResponse,
  AuthResponse,
  Category,
  CardDetail,
  Checklist,
  ChecklistWritePayload,
  ConversationListDto,
  ConversationMessagesApiResponse,
  MessageDto,
  ExtendedUser,
  LoginInput,
  ProposeSwapDealInput,
  Review,
  ReviewMutationResponse,
  ProfileUpdateResponse,
  SignupInput,
  SignupResponse,
  SwapDealDto,
  SwapResult,
  SwapSearchInput,
  User,
  UserChecklist,
} from "./types";

export type ApiClientOptions = {
  baseURL: string;
  getAccessToken?: () => string | null | undefined;
  axiosInstance?: AxiosInstance;
  withCredentials?: boolean;
};

export function createApiClient(options: ApiClientOptions) {
  const http =
    options.axiosInstance ??
    axios.create({
      baseURL: options.baseURL,
      withCredentials: options.withCredentials,
      withXSRFToken: true,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
    });

  return {
    http,
    requestOtp: (mobile: string) =>
      http.post<APIResponse<{ challenge: "issued"; expiresInSeconds: number }>>(
        "/auth/request-otp",
        { mobile },
      ),
    signup: (data: SignupInput) =>
      http.post<SignupResponse>("/auth/signup", data),
    login: (data: LoginInput) => http.post<AuthResponse>("/auth/login", data),
    logout: () => http.post<AuthResponse>("/auth/logout"),
    verifyOtp: (mobile: string, otp: string) =>
      http.post<AuthResponse>("/auth/verify-otp", { mobile, otp }),
    getCurrentUser: () => http.get<APIResponse<ExtendedUser>>("/auth/me"),
    me: () => http.get<APIResponse<ExtendedUser>>("/auth/me"),
    getUserChecklist: (id: string) =>
      http.get<UserChecklist>(`/user-checklists/${id}`),
    updateUserChecklist: (id: string, data: unknown) =>
      http.post<UserChecklist>(`/user-checklists/${id}`, data),
    importUserChecklist: (id: string, data: FormData) =>
      http.post<UserChecklist>(`/user-checklists/${id}/import`, data),
    getChecklists: (params?: Record<string, unknown>) =>
      http.get<APIResponse<Checklist[]>>("/checklists", { params }),
    getChecklist: (id: string) =>
      http.get<APIResponse<Checklist>>(`/checklists/${id}`),
    getCard: (id: string | number) =>
      http.get<APIResponse<CardDetail>>(`/catalogue/cards/${id}`),
    addChecklist: (data: ChecklistWritePayload) =>
      http.post<APIResponse<Checklist>>("/checklists", data),
    updateChecklist: (id: string, data: ChecklistWritePayload) =>
      http.put<APIResponse<Checklist>>(`/checklists/${id}`, data),
    deleteChecklist: (id: string) =>
      http.delete<APIResponse<Checklist>>(`/checklists/${id}`),
    getCategories: () => http.get<APIResponse<Category[]>>("/categories"),
    getCategory: (idOrSlug: string) =>
      http.get<APIResponse<Category>>(`/categories/${idOrSlug}`),
    addCategory: (name: string) =>
      http.post<APIResponse<Category>>("/categories", { name }),
    addSubcategory: (categoryId: string, name: string) =>
      http.post<APIResponse<Category>>(
        `/categories/${categoryId}/subcategories`,
        { name },
      ),
    deleteCategory: (id: string) =>
      http.delete<APIResponse<Category>>(`/categories/${id}`),
    getUsers: () => http.get<APIResponse<User[]>>("/users"),
    blockUser: (id: string, blocked: boolean) =>
      http.post(`/admin/users/${id}/block`, { blocked }),
    getUserReviews: (id: string) => http.get<Review[]>(`/users/${id}/reviews`),
    addReview: (targetUserId: string, type: Review["type"], comment: string) =>
      http.post<ReviewMutationResponse>(`/users/${targetUserId}/reviews`, {
        type,
        comment,
        targetUserId,
      }),
    getUserInfo: (id: string) =>
      http.get<APIResponse<ExtendedUser>>(`/users/${id}`),
    getProfile: () => http.get<APIResponse<ExtendedUser>>("/account/profile"),
    updateProfile: (data: Partial<User>) =>
      http.put<ProfileUpdateResponse>("/account/profile", data),
    searchSwaps: (filters: SwapSearchInput) =>
      http.post<APIResponse<SwapResult[]>>("/swaps/search", filters),
    userSwapMatch: (id: string | number) =>
      http.get<SwapResult>(`/swaps/${id}`),
    getConversations: () =>
      http.get<APIResponse<ConversationListDto[]>>("/conversations"),
    findOrCreateConversation: (targetUserId: number) =>
      http.post<APIResponse<ConversationListDto>>(
        "/conversations/find-or-create",
        { targetUserId },
      ),
    getMessages: (conversationId: string | number, page = 1) =>
      http.get<ConversationMessagesApiResponse>(
        `/conversations/${conversationId}`,
        { params: { page } },
      ),
    sendMessage: (conversationId: number, content: string) =>
      http.post<APIResponse<MessageDto>>(
        `/conversations/${conversationId}/messages`,
        { content },
      ),
    proposeSwapDeal: (data: ProposeSwapDealInput) =>
      http.post<APIResponse<SwapDealDto>>("/swap-deals", data),
    acceptSwapDeal: (id: number) =>
      http.post<APIResponse<SwapDealDto>>(`/swap-deals/${id}/accept`),
    updatePostalDeal: (id: number, data: FormData) =>
      http.post<APIResponse<SwapDealDto>>(`/swap-deals/${id}/postal`, data),
    markDealReceived: (id: number) =>
      http.post<APIResponse<SwapDealDto>>(`/swap-deals/${id}/received`),
    scanDealQr: (id: number) =>
      http.post<APIResponse<SwapDealDto>>(`/swap-deals/${id}/scan-qr`),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
