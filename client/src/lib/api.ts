/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useStore, type User } from "../store/useStore";

const instance = axios.create({
  baseURL: "http://localhost:3333/api/v1",
});

instance.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  requestOtp: (mobile: string) =>
    instance.post("/auth/request-otp", { mobile }),
  signup: (data: {
    mobile: string;
    fullName: string;
    username: string;
    email: string;
    password?: string;
  }) => instance.post("/auth/signup", data),
  login: (data: { uid: string; password: string }) =>
    instance.post("/auth/login", data),
  verifyOtp: (mobile: string, otp: string) =>
    instance.post("/auth/verify-otp", { mobile, otp }),
  getUserChecklist: (id: string) => instance.get(`/user-checklists/${id}`),
  updateUserChecklist: (id: string, data: any) =>
    instance.post(`/user-checklists/${id}`, data),
  getChecklists: () => instance.get("/checklists"),
  getChecklist: (id: string) => instance.get(`/checklists/${id}`),
  addChecklist: (data: any) => {
    if (data instanceof FormData) {
      return instance.post("/checklists", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return instance.post("/checklists", data);
  },
  updateChecklist: (id: string, data: any) => {
    if (data instanceof FormData) {
      return instance.put(`/checklists/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return instance.put(`/checklists/${id}`, data);
  },

  // Category Management
  getCategories: () => instance.get("/categories"),
  addCategory: (name: string) => instance.post("/categories", { name }),
  addSubcategory: (categoryId: string, name: string) =>
    instance.post(`/categories/${categoryId}/subcategories`, { name }),
  deleteCategory: (id: string) => instance.delete(`/categories/${id}`),

  getUsers: () => instance.get("/users"),
  blockUser: (id: string, blocked: boolean) =>
    instance.post(`/admin/users/${id}/block`, { blocked }),
  getUserReviews: (id: string) => instance.get(`/users/${id}/reviews`),
  addReview: (
    targetUserId: string,
    type: "positive" | "negative",
    comment: string,
  ) =>
    instance.post(`/users/${targetUserId}/reviews`, {
      type,
      comment,
      targetUserId,
    }),
  getUserInfo: (id: string) => instance.get(`/users/${id}`),
  getProfile: () => instance.get(`/account/profile`),
  updateProfile: (data: Partial<User>) =>
    instance.put(`/account/profile`, data),
  deleteChecklist: (id: string) => instance.delete(`/checklists/${id}`),
  importUserChecklist: (
    id: string,
    file: File,
    treatEmptyAsMissing: boolean,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("treatEmptyAsMissing", String(treatEmptyAsMissing));
    return instance.post(`/user-checklists/${id}/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  searchSwaps: (filters: {
    checklists?: number[];
    regions?: string;
    lastLogin?: "online" | "today" | "week" | "month" | "6months" | "all";
  }) => instance.post("/swaps/search", filters),
  userSwapMatch: (id: number | string) => instance.get(`/swaps/${id}`),

  // Conversations
  getConversations: () => instance.get("/conversations"),
  findOrCreateConversation: (targetUserId: number) =>
    instance.post("/conversations/find-or-create", { targetUserId }),
  getMessages: (conversationId: number | string, page = 1) =>
    instance.get(`/conversations/${conversationId}?page=${page}`),
  sendMessage: (conversationId: number, content: string) =>
    instance.post(`/conversations/${conversationId}/messages`, { content }),

  // Swap Deals
  proposeSwapDeal: (data: {
    conversation_id: number;
    swap_type: "in_person" | "postal";
    offered_cards: string;
    requested_cards: string;
  }) => instance.post("/swap-deals", data),
  acceptSwapDeal: (id: number) => instance.post(`/swap-deals/${id}/accept`),
  updatePostalDeal: (id: number, data: FormData) =>
    instance.post(`/swap-deals/${id}/postal`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  markDealReceived: (id: number) => instance.post(`/swap-deals/${id}/received`),
  scanDealQr: (id: number) => instance.post(`/swap-deals/${id}/scan-qr`),
};
