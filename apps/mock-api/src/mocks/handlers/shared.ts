import { HttpResponse } from 'msw'

export const meta = (requestId: string) => ({
  requestId,
  serverTimestamp: '2026-09-27T00:00:00.000Z',
})

export const errorResponse = (status: number, code: string, message: string) =>
  HttpResponse.json({ error: { code, message } }, { status })
