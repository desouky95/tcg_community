import { CookieJar } from 'tough-cookie'

const apiUrl = new URL(process.env.MCP_TCG_API_URL ?? 'http://localhost:3333/api/v1/')
if (!apiUrl.pathname.endsWith('/')) apiUrl.pathname += '/'
if (apiUrl.protocol !== 'https:' && !(apiUrl.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname))) {
  throw new Error('MCP_TCG_API_URL must use HTTPS unless it points to localhost')
}

let jar = new CookieJar()

async function request(url: URL, options: RequestInit = {}, cookies = jar) {
  const headers = new Headers(options.headers)
  const cookie = await cookies.getCookieString(url.href)
  if (cookie) headers.set('cookie', cookie)
  const response = await fetch(url, { ...options, headers, redirect: 'manual', signal: AbortSignal.timeout(15_000) })
  for (const value of response.headers.getSetCookie()) await cookies.setCookie(value, url.href)
  return response
}

export async function login(uid: string, password: string, signal: AbortSignal) {
  const candidate = new CookieJar()
  const initial = await request(new URL('/', apiUrl), {}, candidate)
  if (!initial.ok) throw new Error('Could not initialize API session')
  const xsrf = (await candidate.getCookies(apiUrl.href)).find(cookie => cookie.key === 'XSRF-TOKEN')
  const headers: Record<string, string> = { 'content-type': 'application/json', accept: 'application/json' }
  if (xsrf) headers['x-xsrf-token'] = decodeURIComponent(xsrf.value)
  const response = await request(new URL('auth/login', apiUrl), {
    method: 'POST', headers, body: JSON.stringify({ uid, password }),
  }, candidate)
  if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Login failed. Check your credentials and account status.' : 'Login failed. Check the API configuration and try again.')
  signal.throwIfAborted()
  jar = candidate
}

export async function apiGet(path: string, query: Record<string, string | undefined> = {}) {
  const url = new URL(path, apiUrl)
  for (const [key, value] of Object.entries(query)) if (value !== undefined) url.searchParams.set(key, value)
  const response = await request(url, { headers: { accept: 'application/json' } })
  if (response.status === 401 || response.status === 403) throw new Error('API session missing or expired. Run browser_login and try again.')
  if (!response.ok) throw new Error(`TCG API request failed (HTTP ${response.status}).`)
  return response.json()
}
