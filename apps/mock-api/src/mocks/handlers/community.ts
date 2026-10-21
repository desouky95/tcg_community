import { http, HttpResponse } from "msw";

const user = {
  id: 202,
  username: "trade_partner",
  fullName: "Trade Partner",
  governorate: "Cairo",
  isVerified: true,
  status: "active",
};

const collection = {
  id: 301,
  userId: 101,
  checklistId: 101,
  missingList: ["5/102"],
  duplicatesList: ["4/102"],
  collectedList: ["1/102", "4/102"],
  cards: [],
};

const conversation = {
  id: 401,
  user1Id: 101,
  user2Id: 202,
  createdAt: "2026-10-19T10:00:00.000Z",
  updatedAt: "2026-10-19T10:05:00.000Z",
};

const message = {
  id: 501,
  conversationId: 401,
  senderId: 101,
  content: "Ready to trade?",
  isRead: false,
  createdAt: "2026-10-19T10:05:00.000Z",
};

export const communityHandlers = [
  http.get("*/api/v1/users", () => HttpResponse.json([user])),
  http.get("*/api/v1/users/:id", ({ params }) =>
    HttpResponse.json({ ...user, id: Number(params.id) || user.id }),
  ),
  http.get("*/api/v1/users/:id/reviews", ({ params }) =>
    HttpResponse.json([
      {
        id: 601,
        reviewerId: 101,
        targetUserId: Number(params.id),
        type: "positive",
        comment: "Great trader",
        reviewer: {
          id: 101,
          username: "collector_egypt",
          fullName: "Mina Collector",
        },
      },
    ]),
  ),
  http.post(
    "*/api/v1/users/:targetUserId/reviews",
    async ({ request, params }) =>
      HttpResponse.json({
        review: {
          id: 602,
          reviewerId: 101,
          targetUserId: Number(params.targetUserId),
          ...((await request.json()) as object),
        },
        newPoints: 130,
      }),
  ),
  http.post("*/api/v1/admin/users/:id/block", async ({ request, params }) =>
    HttpResponse.json({
      ...user,
      id: Number(params.id) || user.id,
      blocked: Boolean(
        ((await request.json()) as { blocked?: boolean }).blocked,
      ),
    }),
  ),
  http.get("*/api/v1/user-checklists/:id", ({ params }) =>
    HttpResponse.json({
      data: { ...collection, checklistId: Number(params.id) || 101 },
    }),
  ),
  http.post("*/api/v1/user-checklists/:id", async ({ request, params }) =>
    HttpResponse.json({
      ...collection,
      checklistId: Number(params.id) || 101,
      ...((await request.json()) as object),
    }),
  ),
  http.post("*/api/v1/user-checklists/:id/import", ({ params }) =>
    HttpResponse.json({
      data: { ...collection, checklistId: Number(params.id) || 101 },
    }),
  ),
  http.get("*/api/v1/conversations", () =>
    HttpResponse.json({
      data: [
        {
          id: conversation.id,
          otherUser: user,
          lastMessage: message,
          unreadCount: 1,
          updatedAt: conversation.updatedAt,
        },
      ],
    }),
  ),
  http.post("*/api/v1/conversations/find-or-create", async ({ request }) => {
    const body = (await request.json()) as { targetUserId?: number };
    return HttpResponse.json({
      data: { ...conversation, user2Id: body.targetUserId ?? 202 },
    });
  }),
  http.get("*/api/v1/conversations/:id", ({ params }) =>
    HttpResponse.json({
      meta: {
        conversationId: Number(params.id),
        otherUser: user,
        activeDeal: null,
        pagination: { total: 1, perPage: 50, currentPage: 1, lastPage: 1 },
      },
      data: [message],
    }),
  ),
  http.post(
    "*/api/v1/conversations/:id/messages",
    async ({ request, params }) =>
      HttpResponse.json({
        data: {
          ...message,
          conversationId: Number(params.id),
          content:
            ((await request.json()) as { content?: string }).content ??
            message.content,
        },
      }),
  ),
];
