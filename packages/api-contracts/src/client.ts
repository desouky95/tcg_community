import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type {
  APIResponse,
  AuthResponse,
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
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
  ScrapperCollection,
  Card,
  ImportChecklistPayload,
} from "./types";

export type ApiClientOptions = {
  baseURL: string;
  baseServerUrl?: string;
  getAccessToken?: () => string | null | undefined;
  getDefaultQuery?: () => QueryInput | undefined;
  axiosInstance?: AxiosInstance;
  withCredentials?: boolean;
  baseClientBlackList?: Partial<
    Record<keyof ReturnType<typeof createApiClient>, true>
  >;
  scrapperToken?: string;
};

export type QueryScalar = string | number | boolean;
export type QueryValue =
  | QueryScalar
  | readonly QueryScalar[]
  | null
  | undefined;
export type QueryRecord = Readonly<Record<string, QueryValue>>;
export type SearchParamsLike = {
  entries(): Iterable<readonly [string, string]>;
};
export type QueryInput = QueryRecord | SearchParamsLike;
export type ApiRequestOptions = {
  query?: QueryInput;
  queryMode?: "merge" | "replace";
  withParams?: boolean;
  fallback?: boolean;
};

function isSearchParamsLike(query: QueryInput): query is SearchParamsLike {
  return "entries" in query && typeof query.entries === "function";
}

function applyQuery(target: URLSearchParams, query?: QueryInput) {
  if (!query) return;

  if (isSearchParamsLike(query)) {
    const grouped = new Map<string, string[]>();
    for (const [key, value] of query.entries()) {
      const values = grouped.get(key) ?? [];
      values.push(value);
      grouped.set(key, values);
    }

    for (const [key, values] of grouped) {
      target.delete(key);
      for (const value of values) target.append(key, value);
    }
    return;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;

    target.delete(key);
    if (value === null) continue;

    const values = Array.isArray(value) ? value : [value];
    for (const item of values) target.append(key, String(item));
  }
}

export function resolveQuery(
  defaultQuery?: QueryInput,
  requestOptions?: ApiRequestOptions,
  endpointQuery?: QueryInput,
) {
  const query = new URLSearchParams();

  if (requestOptions?.queryMode !== "replace") applyQuery(query, defaultQuery);
  applyQuery(query, requestOptions?.query);
  applyQuery(query, endpointQuery);
  query.sort();

  return query;
}

export function getQueryKey(
  defaultQuery?: QueryInput,
  requestOptions?: ApiRequestOptions,
  endpointQuery?: QueryInput,
) {
  return resolveQuery(defaultQuery, requestOptions, endpointQuery).toString();
}

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

  const requestConfig = (
    inheritDefaultQuery: boolean,
    requestOptions?: ApiRequestOptions,
    endpointQuery?: QueryInput,
    config?: AxiosRequestConfig,
  ): AxiosRequestConfig => {
    const params = resolveQuery(
      inheritDefaultQuery ? options.getDefaultQuery?.() : undefined,
      requestOptions,
      endpointQuery,
    );

    return {
      ...config,
      params:
        requestOptions?.withParams && params.size > 0 ? params : undefined,
    };
  };

  return {
    http,
    resolveQuery: (
      requestOptions?: ApiRequestOptions,
      endpointQuery?: QueryInput,
    ) =>
      resolveQuery(options.getDefaultQuery?.(), requestOptions, endpointQuery),
    getQueryKey: (
      requestOptions?: ApiRequestOptions,
      endpointQuery?: QueryInput,
    ) =>
      getQueryKey(options.getDefaultQuery?.(), requestOptions, endpointQuery),
    requestOtp: (mobile: string, requestOptions?: ApiRequestOptions) =>
      http.post<APIResponse<{ challenge: "issued"; expiresInSeconds: number }>>(
        "/auth/request-otp",
        { mobile },
        requestConfig(false, requestOptions),
      ),
    signup: (data: SignupInput, requestOptions?: ApiRequestOptions) =>
      http.post<SignupResponse>(
        "/auth/signup",
        data,
        requestConfig(false, requestOptions),
      ),
    login: (data: LoginInput, requestOptions?: ApiRequestOptions) =>
      http.post<AuthResponse>(
        "/auth/login",
        data,
        requestConfig(false, requestOptions),
      ),
    logout: (requestOptions?: ApiRequestOptions) =>
      http.post<AuthResponse>(
        "/auth/logout",
        undefined,
        requestConfig(false, requestOptions),
      ),
    verifyOtp: (
      mobile: string,
      otp: string,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<AuthResponse>(
        "/auth/verify-otp",
        { mobile, otp },
        requestConfig(false, requestOptions),
      ),
    getCurrentUser: (requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<ExtendedUser>>(
        "/auth/me",
        requestConfig(true, requestOptions),
      ),
    me: (requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<ExtendedUser>>(
        "/auth/me",
        requestConfig(true, requestOptions),
      ),
    getUserChecklist: (id: string, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<UserChecklist>>(
        `/user-checklists/${id}`,
        requestConfig(true, requestOptions),
      ),
    updateUserChecklist: (
      id: string,
      data: unknown,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<UserChecklist>(
        `/user-checklists/${id}`,
        data,
        requestConfig(false, requestOptions),
      ),
    importUserChecklist: (
      id: string,
      data: FormData,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<UserChecklist>>(
        `/user-checklists/${id}/import`,
        data,
        requestConfig(false, requestOptions),
      ),
    getChecklists: (params?: QueryInput, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<Checklist[]>>(
        "/checklists",
        requestConfig(true, requestOptions, params),
      ),
    getChecklist: (id: string, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<Checklist>>(
        `/checklists/${id}`,
        requestConfig(true, requestOptions),
      ),
    getChecklistCards: (id: string, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<Card[]>>(
        `/checklists/${id}/cards`,
        requestConfig(true, requestOptions),
      ),
    downloadChecklist: (id: string, requestOptions?: ApiRequestOptions) =>
      http.get<Blob>(
        `/checklists/${id}/download`,
        requestConfig(false, requestOptions, undefined, {
          responseType: "blob",
        }),
      ),
    getCard: (id: string | number, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<CardDetail>>(
        `/catalogue/cards/${id}`,
        requestConfig(true, requestOptions),
      ),
    addChecklist: (
      data: ChecklistWritePayload,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<Checklist>>(
        "/checklists",
        data,
        requestConfig(false, requestOptions),
      ),
    updateChecklist: (
      id: string,
      data: ChecklistWritePayload,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.put<APIResponse<Checklist>>(
        `/checklists/${id}`,
        data,
        requestConfig(false, requestOptions),
      ),
    deleteChecklist: (id: string, requestOptions?: ApiRequestOptions) =>
      http.delete<APIResponse<Checklist>>(
        `/checklists/${id}`,
        requestConfig(false, requestOptions),
      ),
    getCategories: (requestOptions?: ApiRequestOptions) => {
      return http.get<APIResponse<Category[]>>(
        `/categories`,
        requestConfig(true, requestOptions),
      );
    },
    getCategory: (idOrSlug: string, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<Category>>(
        `/categories/${idOrSlug}`,
        requestConfig(true, requestOptions),
      ),
    createCategory: (
      data: CategoryCreatePayload,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<Category>>(
        "/categories",
        data,
        requestConfig(false, requestOptions),
      ),
    updateCategory: (
      id: string,
      data: CategoryUpdatePayload,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.put<APIResponse<Category>>(
        `/categories/${id}`,
        data,
        requestConfig(false, requestOptions),
      ),
    addSubcategory: (
      categoryId: string,
      name: string,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<Category>>(
        `/categories/${categoryId}/subcategories`,
        { name },
        requestConfig(false, requestOptions),
      ),
    deleteCategory: (id: string, requestOptions?: ApiRequestOptions) =>
      http.delete<APIResponse<Category>>(
        `/categories/${id}`,
        requestConfig(false, requestOptions),
      ),
    getUsers: (requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<User[]>>(
        "/users",
        requestConfig(true, requestOptions),
      ),
    blockUser: (
      id: string,
      blocked: boolean,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post(
        `/admin/users/${id}/block`,
        { blocked },
        requestConfig(false, requestOptions),
      ),
    getUserReviews: (id: string, requestOptions?: ApiRequestOptions) =>
      http.get<Review[]>(
        `/users/${id}/reviews`,
        requestConfig(true, requestOptions),
      ),
    addReview: (
      targetUserId: string,
      type: Review["type"],
      comment: string,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<ReviewMutationResponse>(
        `/users/${targetUserId}/reviews`,
        {
          type,
          comment,
          targetUserId,
        },
        requestConfig(false, requestOptions),
      ),
    getUserInfo: (id: string, requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<ExtendedUser>>(
        `/users/${id}`,
        requestConfig(true, requestOptions),
      ),
    getProfile: (requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<ExtendedUser>>(
        "/account/profile",
        requestConfig(true, requestOptions),
      ),
    updateProfile: (data: Partial<User>, requestOptions?: ApiRequestOptions) =>
      http.put<ProfileUpdateResponse>(
        "/account/profile",
        data,
        requestConfig(false, requestOptions),
      ),
    searchSwaps: (
      filters: SwapSearchInput,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<SwapResult[]>>(
        "/swaps/search",
        filters,
        requestConfig(false, requestOptions),
      ),
    userSwapMatch: (id: string | number, requestOptions?: ApiRequestOptions) =>
      http.get<SwapResult>(`/swaps/${id}`, requestConfig(true, requestOptions)),
    getConversations: (requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<ConversationListDto[]>>(
        "/conversations",
        requestConfig(true, requestOptions),
      ),
    findOrCreateConversation: (
      targetUserId: number,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<ConversationListDto>>(
        "/conversations/find-or-create",
        { targetUserId },
        requestConfig(false, requestOptions),
      ),
    getMessages: (
      conversationId: string | number,
      page = 1,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.get<ConversationMessagesApiResponse>(
        `/conversations/${conversationId}`,
        requestConfig(true, requestOptions, { page }),
      ),
    sendMessage: (
      conversationId: number,
      content: string,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<MessageDto>>(
        `/conversations/${conversationId}/messages`,
        { content },
        requestConfig(false, requestOptions),
      ),
    proposeSwapDeal: (
      data: ProposeSwapDealInput,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<SwapDealDto>>(
        "/swap-deals",
        data,
        requestConfig(false, requestOptions),
      ),
    acceptSwapDeal: (id: number, requestOptions?: ApiRequestOptions) =>
      http.post<APIResponse<SwapDealDto>>(
        `/swap-deals/${id}/accept`,
        undefined,
        requestConfig(false, requestOptions),
      ),
    updatePostalDeal: (
      id: number,
      data: FormData,
      requestOptions?: ApiRequestOptions,
    ) =>
      http.post<APIResponse<SwapDealDto>>(
        `/swap-deals/${id}/postal`,
        data,
        requestConfig(false, requestOptions),
      ),
    markDealReceived: (id: number, requestOptions?: ApiRequestOptions) =>
      http.post<APIResponse<SwapDealDto>>(
        `/swap-deals/${id}/received`,
        undefined,
        requestConfig(false, requestOptions),
      ),
    scanDealQr: (id: number, requestOptions?: ApiRequestOptions) =>
      http.post<APIResponse<SwapDealDto>>(
        `/swap-deals/${id}/scan-qr`,
        undefined,
        requestConfig(false, requestOptions),
      ),
    getScrapperList: (requestOptions?: ApiRequestOptions) =>
      http.get<APIResponse<ScrapperCollection[]>>(
        "/scrapper/done",
        requestConfig(true, requestOptions, undefined, {
          headers: {
            Authorization: `Bearer ${options.scrapperToken}`,
          },
        }),
      ),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
