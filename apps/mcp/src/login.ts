import { createServer, type Server } from 'node:http'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { spawn } from 'node:child_process'
import { login } from './api.js'

let active: Server | undefined

export async function browserLogin() {
  if (active) throw new Error('A login page is already open. Finish or wait for it to expire.')
  const token = randomBytes(32).toString('hex')
  let busy = false
  const expiry = new AbortController()
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'no-store')
    const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`
    if (req.headers.host !== new URL(origin).host) { res.writeHead(403).end(); return }
    const url = new URL(req.url ?? '/', origin)
    const supplied = url.searchParams.get('token') ?? ''
    const valid = /^[0-9a-f]{64}$/.test(supplied) && timingSafeEqual(Buffer.from(supplied), Buffer.from(token))
    if (!valid || url.pathname !== '/') { res.writeHead(404).end(); return }
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Referrer-Policy': 'no-referrer' }).end(`<!doctype html><title>TCG login</title><h1>TCG login</h1><form method="post" action="/?token=${token}"><label>Email, mobile or username <input name="uid" autocomplete="username" required></label><br><label>Password <input name="password" type="password" autocomplete="current-password" required></label><br><button>Sign in</button></form>`)
      return
    }
    if (req.method !== 'POST' || req.headers.origin !== origin || req.headers['content-type'] !== 'application/x-www-form-urlencoded' || busy) { res.writeHead(403).end(); return }
    busy = true
    try {
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (body.length > 8192) throw new Error('Request too large')
      }
      const form = new URLSearchParams(body)
      const uid = form.get('uid') ?? ''
      const password = form.get('password') ?? ''
      if (!uid || !password) throw new Error('Enter your credentials.')
      await login(uid, password, expiry.signal)
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Signed in. You may close this page.')
      clearTimeout(timeout)
      server.close()
      active = undefined
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Login failed. Check your credentials and API connection, then return to the login page and try again.')
    } finally { busy = false }
  })
  active = server
  server.on('error', () => { active = undefined })
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve()) })
  const timeout = setTimeout(() => { expiry.abort(); server.closeAllConnections(); server.close(); active = undefined }, 5 * 60_000)
  timeout.unref()
  const url = `http://127.0.0.1:${(server.address() as { port: number }).port}/?token=${token}`
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'rundll32' : 'xdg-open'
  const args = process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url]
  const child = spawn(command, args, { detached: true, stdio: 'ignore' })
  try {
    await new Promise<void>((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject) })
    child.unref()
  } catch {
    clearTimeout(timeout)
    server.close()
    active = undefined
    throw new Error('Could not open the browser login page.')
  }
  return 'Login page opened in your browser. Sign in within five minutes, then retry your catalogue request.'
}
