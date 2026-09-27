import { http, HttpResponse } from 'msw'
import { meta } from './shared.js'

export const accountHandlers = [
  http.get('*/api/v1/account/profile', () => HttpResponse.json({
    data: {
      id: 101,
      username: 'collector_egypt',
      fullName: 'Mina Collector',
      email: 'mina@example.test',
      mobile: '+201000000001',
      governorate: 'Cairo',
      isVerified: true,
      status: 'active',
      version: 4,
    },
    ...meta('msw-profile-request'),
  })),
  http.put('*/api/v1/account/profile', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ data: { ...body, id: 101, username: 'collector_egypt', version: 5 }, ...meta('msw-profile-update-request') })
  }),
  http.put('*/api/v1/account/preferences', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ data: body, ...meta('msw-preferences-request') })
  }),
  http.post('*/api/v1/account/deactivate', () => HttpResponse.json({ data: { status: 'deactivated' }, ...meta('msw-deactivate-request') })),
  http.post('*/api/v1/account/privacy-exports', () => HttpResponse.json({ data: { id: 501, status: 'queued' }, ...meta('msw-export-request') }, { status: 202 })),
  http.post('*/api/v1/account/privacy-deletions', () => HttpResponse.json({ data: { status: 'anonymized' }, ...meta('msw-delete-request') })),
]
