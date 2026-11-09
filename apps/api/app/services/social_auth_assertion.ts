import { createDecipheriv, createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { SocialProvider } from '#services/facebook_identity_service'

type SocialAssertion = {
  nonce: string
  provider: SocialProvider
  subject: string
  email: string | null
  exp: number
}

export function verifySocialAssertion(
  assertion: unknown,
  secret: string | undefined,
  nonce: unknown,
  provider: SocialProvider
): SocialAssertion | null {
  if (
    !secret ||
    secret.length < 32 ||
    typeof assertion !== 'string' ||
    assertion.length > 8192 ||
    typeof nonce !== 'string'
  )
    return null
  const parts = assertion.split('.')
  if (parts.length !== 4 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) return null
  const signed = parts.slice(0, 3).join('.')
  const expected = createHmac('sha256', secret).update(signed).digest()
  const supplied = Buffer.from(parts[3], 'base64url')
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null
  let payload: Record<string, unknown>
  try {
    const key = createHash('sha256').update(`social-assertion-encryption:${secret}`).digest()
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(parts[0], 'base64url'))
    decipher.setAuthTag(Buffer.from(parts[2], 'base64url'))
    payload = JSON.parse(
      Buffer.concat([
        decipher.update(Buffer.from(parts[1], 'base64url')),
        decipher.final(),
      ]).toString('utf8')
    )
  } catch {
    return null
  }
  if (
    !payload ||
    typeof payload !== 'object' ||
    payload.nonce !== nonce ||
    payload.provider !== provider ||
    typeof payload.subject !== 'string' ||
    !payload.subject ||
    payload.subject.length > 255 ||
    (payload.email !== null && (typeof payload.email !== 'string' || payload.email.length > 254)) ||
    typeof payload.exp !== 'number' ||
    payload.exp < Date.now() ||
    payload.exp > Date.now() + 120_000
  )
    return null
  return payload as SocialAssertion
}
