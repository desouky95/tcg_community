import { test } from '@japa/runner'
import { safeFacebookReturn } from '#services/facebook_identity_service'

test.group('Facebook return destinations', () => {
  test('accepts a local path and rejects origins and browser-normalized redirects', ({ assert }) => {
    assert.equal(safeFacebookReturn('/collection?tab=cards'), '/collection?tab=cards')
    for (const value of ['https://evil.example', '//evil.example', '/\\evil.example', '/\n/evil.example', null, 42]) {
      assert.equal(safeFacebookReturn(value), '/')
    }
  })
})
