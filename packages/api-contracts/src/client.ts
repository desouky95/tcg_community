import axios, { type AxiosInstance } from "axios";
import type {
  AuthResponse,
  Category,
  Checklist,
  ChecklistWritePayload,
  ExtendedUser,
  LoginInput,
  ProposeSwapDealInput,
  Review,
  ReviewMutationResponse,
  SignupInput,
  SwapResult,
  SwapSearchInput,
  User,
  UserChecklist,
} from "./types";

export type ApiClientOptions = {
  baseURL: string;
  getAccessToken?: () => string | null | undefined;
  axiosInstance?: AxiosInstance;
};

export function createApiClient(options: ApiClientOptions) {
  const http = options.axiosInstance ?? axios.create({ baseURL: options.baseURL });

  http.interceptors.request.use((config) => {
    const token = options.getAccessToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return {
    http,
    requestOtp: (mobile: string) => http.post("/auth/request-otp", { mobile }),
    signup: (data: SignupInput) => http.post("/auth/signup", data),
    login: (data: LoginInput) => http.post<AuthResponse>("/auth/login", data),
    verifyOtp: (mobile: string, otp: string) => http.post<AuthResponse>("/auth/verify-otp", { mobile, otp }),
    getUserChecklist: (id: string) => http.get<UserChecklist>(`/user-checklists/${id}`),
    updateUserChecklist: (id: string, data: unknown) => http.post<UserChecklist>(`/user-checklists/${id}`, data),
    importUserChecklist: (id: string, data: FormData) => http.post<UserChecklist>(`/user-checklists/${id}/import`, data),
    getChecklists: (params?: Record<string, unknown>) => http.get<Checklist[]>("/checklists", { params }),
    getChecklist: (id: string) => http.get<{ data: Checklist }>(`/checklists/${id}`),
    addChecklist: (data: ChecklistWritePayload) => http.post<Checklist>("/checklists", data),
    updateChecklist: (id: string, data: ChecklistWritePayload) => http.put<Checklist>(`/checklists/${id}`, data),
    deleteChecklist: (id: string) => http.delete(`/checklists/${id}`),
    getCategories: () => http.get<Category[]>("/categories"),
    getCategory: (idOrSlug: string) => http.get<Category>(`/categories/${idOrSlug}`),
    addCategory: (name: string) => http.post<Category>("/categories", { name }),
    addSubcategory: (categoryId: string, name: string) => http.post<Category>(`/categories/${categoryId}/subcategories`, { name }),
    deleteCategory: (id: string) => http.delete(`/categories/${id}`),
    getUsers: () => http.get<{ data: User[] }>("/users"),
    blockUser: (id: string, blocked: boolean) => http.post(`/admin/users/${id}/block`, { blocked }),
    getUserReviews: (id: string) => http.get<Review[]>(`/users/${id}/reviews`),
    addReview: (targetUserId: string, type: Review["type"], comment: string) =>
      http.post<ReviewMutationResponse>(`/users/${targetUserId}/reviews`, { type, comment, targetUserId }),
    getUserInfo: (id: string) => http.get<{ data: ExtendedUser }>(`/users/${id}`),
    getProfile: () => http.get<{ data: ExtendedUser }>("/account/profile"),
    updateProfile: (data: Partial<User>) => http.put<{ user: User }>("/account/profile", data),
    searchSwaps: (filters: SwapSearchInput) => http.post<{ data: SwapResult[] }>("/swaps/search", filters),
    userSwapMatch: (id: string | number) => http.get<SwapResult>(`/swaps/${id}`),
    getConversations: () => http.get("/conversations"),
    findOrCreateConversation: (targetUserId: number) => http.post("/conversations/find-or-create", { targetUserId }),
    getMessages: (conversationId: string | number, page = 1) => http.get(`/conversations/${conversationId}`, { params: { page } }),
    sendMessage: (conversationId: number, content: string) => http.post(`/conversations/${conversationId}/messages`, { content }),
    proposeSwapDeal: (data: ProposeSwapDealInput) => http.post("/swap-deals", data),
    acceptSwapDeal: (id: number) => http.post(`/swap-deals/${id}/accept`),
    updatePostalDeal: (id: number, data: FormData) => http.post(`/swap-deals/${id}/postal`, data),
    markDealReceived: (id: number) => http.post(`/swap-deals/${id}/received`),
    scanDealQr: (id: number) => http.post(`/swap-deals/${id}/scan-qr`),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
