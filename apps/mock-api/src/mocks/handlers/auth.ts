import { http, HttpResponse } from 'msw'
import { errorResponse, meta } from './shared.js'

const user = {
  id: 101,
  username: 'collector_egypt',
  fullName: 'Mina Collector',
  mobile: '+201000000001',
  isVerified: true,
  status: 'active',
  version: 3,
}

export const authHandlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { uid?: string; password?: string }
    if (!body.uid || !body.password) return errorResponse(422, 'validation_error', 'Request validation failed')
    if (body.password === 'wrong-password') return errorResponse(401, 'invalid_credentials', 'Invalid credentials')
    return HttpResponse.json({ data: { user, token: 'mock-access-token' }, ...meta('msw-login-request') })
  }),
  http.post('*/api/v1/auth/request-otp', async ({ request }) => {
    const body = (await request.json()) as { mobile?: string }
    if (!body.mobile) return errorResponse(422, 'validation_error', 'Request validation failed')
    return HttpResponse.json({ data: { challenge: 'issued', expiresInSeconds: 600 }, ...meta('msw-otp-request') })
  }),
  http.post('*/api/v1/auth/verify-otp', async ({ request }) => {
    const body = (await request.json()) as { otp?: string }
    if (body.otp !== '123456') return errorResponse(401, 'invalid_otp', 'Invalid or expired verification code')
    return HttpResponse.json({ data: { user: { ...user, isVerified: true }, token: 'mock-access-token' }, ...meta('msw-verify-request') })
  }),
  http.post('*/api/v1/auth/otp-login', () =>
    HttpResponse.json({ data: { user, token: 'mock-access-token' }, ...meta('msw-otp-login-request') })),
  http.post('*/api/v1/auth/logout', () => HttpResponse.json({ data: { loggedOut: true }, ...meta('msw-logout-request') })),
]
