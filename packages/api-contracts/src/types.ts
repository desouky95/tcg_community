export type Id = string | number;

export type Category = {
  id: string;
  name: string;
  slug?: string;
  parentId: number;
  children: Category[];
  parent?: Category;
  checklists?: Checklist[];
};

export type ExtendedCategory = Omit<Category, "children"> & {
  userChecklists: UserChecklist[];
  children: ExtendedCategory[];
  slug?: string;
  parent?: Category;
  checklists?: Checklist[];
};

export type User = {
  id: Id;
  fullName: string;
  username: string;
  email: string | null;
  mobile: string;
  role: "admin" | "user" | "super_admin";
  blocked: boolean;
  points: number;
  positiveReviewsCount: number;
  negativeReviewsCount: number;
  lastLoginAt: string | null;
  governorate: string | null;
  notReadyForSwap: boolean;
  isVerified: boolean;
  checklists?: UserChecklist[];
};

export type ExtendedUser = User & { categories: ExtendedCategory[] };

export type UserChecklist = {
  id: string;
  checklistId: string;
  name: string;
  missingList: string | null;
  duplicatesList: string | null;
  collectedList: string | null;
  missingListArray?: string[];
  duplicatesListArray?: string[];
  collectedListArray?: string[];
  updatedAt: string;
  subCategory?: Category[];
  checklist?: Checklist;
};

export type Review = {
  id: string;
  reviewerId: string;
  targetUserId: string;
  type: "positive" | "negative";
  comment: string;
};

export type ReviewMutationResponse = { review: Review; newPoints: number };

export type Card = {
  number: string;
  name: string;
  type: string;
  section: string;
  needCount?: number;
  holdCount?: number;
  offerCount?: number;
  ratio?: string;
};

export type Checklist = {
  id: string;
  type: "card" | "sticker";
  name: string;
  year: number;
  totalCards: number;
  categoryId: number;
  subcategoryId: number | null;
  category?: Category;
  subcategory?: Category;
  cards?: Card[];
  userChecklist?: UserChecklist;
};

export type UserSnippet = { id: number; username: string; fullName: string };

export type ConversationListDto = {
  id: number;
  otherUser: UserSnippet;
  lastMessage: { content: string; createdAt: string; senderId: number; isRead: boolean } | null;
  unreadCount: number;
  updatedAt: string;
};

export type SwapDealStatus = "pending" | "accepted" | "in_progress" | "shipping" | "completed" | "cancelled";
export type SwapType = "in_person" | "postal";

export type SwapDealDto = {
  id: number;
  conversationId: number;
  createdByUserId: number;
  status: SwapDealStatus;
  swapType: SwapType;
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
  pagination: { total: number; perPage: number; currentPage: number; lastPage: number };
};

export type ConversationMessagesResponse = { meta: ConversationMeta; data: MessageDto[] };

export type LastLogin = "online" | "today" | "week" | "month" | "6months" | "all";
export type SearchFilters = { checklists?: number[]; regions: string; lastLogin: LastLogin };
export type SwapResultMatch = { checklistId: number; checklist: Checklist; theyOffer: string[]; theyNeed: string[] };
export type SwapResult = {
  user: { id: number; fullName: string; username: string; governorate: string | null; lastLoginAt: string };
  totalMutalTrades: number;
  matches: SwapResultMatch[];
};

export type SignupInput = { mobile: string; fullName: string; username: string; email: string; password?: string };
export type LoginInput = { uid: string; password: string };
export type AuthSession = { user: User; token: string };
export type AuthResponse = { data: AuthSession };
export type SwapSearchInput = { checklists?: number[]; regions?: string; lastLogin?: LastLogin };
export type ProposeSwapDealInput = {
  conversation_id: number;
  swap_type: SwapType;
  offered_cards: string;
  requested_cards: string;
};

export type ChecklistWriteInput = Partial<Pick<Checklist, "name" | "year" | "type" | "totalCards" | "categoryId" | "subcategoryId">>;
export type ChecklistWritePayload = ChecklistWriteInput | FormData;
