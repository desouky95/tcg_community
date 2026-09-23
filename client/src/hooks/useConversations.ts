import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useStore } from "../store/useStore";

export type UserSnippet = {
  id: number;
  username: string;
  fullName: string;
};

export type ConversationListDto = {
  id: number;
  otherUser: UserSnippet;
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: number;
    isRead: boolean;
  } | null;
  unreadCount: number;
  updatedAt: string;
};

export type SwapDealDto = {
  id: number;
  conversationId: number;
  createdByUserId: number;
  status:
    | "pending"
    | "accepted"
    | "in_progress"
    | "shipping"
    | "completed"
    | "cancelled";
  swapType: "in_person" | "postal";
  offeredCards: string;
  requestedCards: string;
  user1QrScanned: boolean;
  user2QrScanned: boolean;
  user1PhotoUrl: string | null;
  user2PhotoUrl: string | null;
  user1Tracking: string | null;
  user2Tracking: string | null;
  user1Received: boolean;
  user2Received: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessageDto = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  type: "text" | "deal";
  dealId: number | null;
  deal?: SwapDealDto;
  createdAt: string;
  sender: UserSnippet;
};

export type ConversationMeta = {
  conversationId: number;
  otherUser: UserSnippet & { lastLoginAt: string | null };
  activeDeal: SwapDealDto | null;
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
};

export type ConversationMessagesResponse = {
  meta: ConversationMeta;
  data: MessageDto[];
};

export const useConversations = () => {
  const user = useStore((s) => s.user);
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await api.getConversations();
      return res.data.data as ConversationListDto[];
    },
    refetchInterval: 10000, // Poll every 10s for new message notifications
    enabled: !!user,
  });
};

export const useConversationMessages = (
  conversationId: string | number | undefined,
) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await api.getMessages(conversationId!);
      return res.data as ConversationMessagesResponse;
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Fast polling while looking at a chat
  });
};

export const useFindOrCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: number) => {
      const res = await api.findOrCreateConversation(targetUserId);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: number;
      content: string;
    }) => {
      const res = await api.sendMessage(conversationId, content);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
