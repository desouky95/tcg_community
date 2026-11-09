import { createCipheriv, createHash, createHmac, randomBytes } from 'node:crypto'
import { test } from '@japa/runner'
import { verifySocialAssertion } from '#services/social_auth_assertion'

const secret = 'test-secret-with-at-least-32-characters'
const nonce = 'a'.repeat(64)
function signed(payload: object) {
  const iv = randomBytes(12)
  const key = createHash('sha256').update(`social-assertion-encryption:${secret}`).digest()
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()])
  const value = [
    iv.toString('base64url'),
    encrypted.toString('base64url'),
    cipher.getAuthTag().toString('base64url'),
  ].join('.')
  return `${value}.${createHmac('sha256', secret).update(value).digest('base64url')}`
}
test.group('Social assertion validation', () => {
  test('accepts only an intact current identity bound to provider and session', ({ assert }) => {
    const value = {
      nonce,
      provider: 'google',
      subject: 'provider-id',
      email: null,
      exp: Date.now() + 60_000,
    }
    const assertion = signed(value)
    assert.equal(verifySocialAssertion(assertion, secret, nonce, 'google')?.subject, 'provider-id')
    assert.isNull(verifySocialAssertion(assertion, secret, 'b'.repeat(64), 'google'))
    assert.isNull(verifySocialAssertion(assertion, secret, nonce, 'facebook'))
    assert.isNull(verifySocialAssertion(`${assertion}x`, secret, nonce, 'google'))
    assert.isNull(
      verifySocialAssertion(signed({ ...value, exp: Date.now() - 1 }), secret, nonce, 'google')
    )
    assert.isNull(
      verifySocialAssertion(
        signed({ ...value, exp: Date.now() + 500_000 }),
        secret,
        nonce,
        'google'
      )
    )
    assert.isNull(verifySocialAssertion(signed(null as unknown as object), secret, nonce, 'google'))
  })
})
