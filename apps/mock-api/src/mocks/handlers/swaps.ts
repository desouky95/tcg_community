import { http, HttpResponse } from "msw";

const match = {
  user: { id: 202, username: "trade_partner", fullName: "Trade Partner" },
  theyOffer: [{ checklistId: 101, cards: ["5/102"] }],
  theyNeed: [{ checklistId: 101, cards: ["4/102"] }],
  totalTheyOffer: 1,
  totalMutalTrades: 1,
};

const deal = {
  id: 701,
  conversationId: 401,
  createdByUserId: 101,
  swapType: "postal",
  offeredCards: "4/102",
  requestedCards: "5/102",
  status: "pending",
  user1Received: false,
  user2Received: false,
  user1QrScanned: false,
  user2QrScanned: false,
};

export const swapHandlers = [
  http.post("*/api/v1/swaps/search", () =>
    HttpResponse.json({ data: [match] }),
  ),
  http.get("*/api/v1/swaps/:userId", ({ params }) =>
    HttpResponse.json({
      ...match,
      user: { ...match.user, id: Number(params.userId) },
    }),
  ),
  http.post("*/api/v1/swap-deals", async ({ request }) =>
    HttpResponse.json({
      data: { ...deal, ...((await request.json()) as object) },
    }),
  ),
  http.post("*/api/v1/swap-deals/:id/accept", ({ params }) =>
    HttpResponse.json({
      data: { ...deal, id: Number(params.id), status: "accepted" },
    }),
  ),
  http.post("*/api/v1/swap-deals/:id/postal", ({ params }) =>
    HttpResponse.json({
      data: {
        ...deal,
        id: Number(params.id),
        status: "shipping",
        user1Tracking: "EG123456789",
      },
    }),
  ),
  http.post("*/api/v1/swap-deals/:id/received", ({ params }) =>
    HttpResponse.json({
      data: { ...deal, id: Number(params.id), user1Received: true },
    }),
  ),
  http.post("*/api/v1/swap-deals/:id/scan-qr", ({ params }) =>
    HttpResponse.json({
      data: {
        ...deal,
        id: Number(params.id),
        swapType: "in_person",
        user1QrScanned: true,
      },
    }),
  ),
];
