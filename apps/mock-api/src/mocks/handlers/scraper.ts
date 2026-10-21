import { http, HttpResponse } from "msw";

const job = {
  id: "scrape-job-1",
  status: "queued",
  collections: ["panini-world-cup-2026"],
  createdAt: "2026-10-19T10:00:00.000Z",
  progress: { completed: 0, total: 1 },
};

export const scraperHandlers = [
  http.get("*/api/v1/scrapper/collections", () =>
    HttpResponse.json({
      data: [
        {
          key: "panini-world-cup-2026",
          source: "laststicker",
          url: "https://www.laststicker.com/",
          enabled: true,
          type: "checklist",
        },
      ],
    }),
  ),
  http.get("*/api/v1/scrapper/done", () => HttpResponse.json({ data: [] })),
  http.post("*/api/v1/scrapper/jobs", async ({ request }) => {
    const body = (await request.json()) as { collections?: string[] };
    return HttpResponse.json(
      { data: { ...job, collections: body.collections ?? job.collections } },
      { status: 202 },
    );
  }),
  http.get("*/api/v1/scrapper/jobs/:jobId", ({ params }) =>
    HttpResponse.json({ data: { ...job, id: String(params.jobId) } }),
  ),
];
