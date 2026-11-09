import { createHash, randomBytes } from 'node:crypto'
import { verifySocialAssertion } from '#services/social_auth_assertion'
import db from '@adonisjs/lucid/services/db'
import SocialAuthAttempt from '#models/social_auth_attempt'
import type { HttpContext } from '@adonisjs/core/http'
import PendingExternalIdentity from '#models/pending_external_identity'
import ExternalIdentity from '#models/external_identity'
import env from '#start/env'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import app from '@adonisjs/core/services/app'
import { signupValidator, verifyOtpValidator } from '#validators/user'
import { DateTime } from 'luxon'
import {
  sessionFingerprint,
  deliverMockOtp,
  ensureOtpDeliveryAvailable,
} from '#services/identity_service'
import {
  facebookBinding,
  pendingFacebook,
  safeFacebookReturn,
  startSocialSignup,
  verifySocialSignup,
  linkSocialIdentity,
  type SocialProvider,
} from '#services/facebook_identity_service'

const configuredOrigin = (value: string | undefined, developmentDefault: string) => {
  if (!value && app.inProduction)
    throw new Error('Social sign-in application origins are not configured')
  return new URL(value || developmentDefault).origin
}
const publicUrl = () => configuredOrigin(env.get('PUBLIC_WEB_URL'), 'http://localhost:3000')
const appUrl = () => configuredOrigin(env.get('COLLECTOR_APP_URL'), 'http://localhost:5173')
const failure = (
  provider: SocialProvider,
  reason: string,
  returnTo: unknown = '/',
  destination: unknown = 'public'
) => {
  const url = new URL('/login', publicUrl())
  url.searchParams.set(`${provider}_error`, reason)
  url.searchParams.set('returnTo', safeFacebookReturn(returnTo))
  url.searchParams.set('destination', destination === 'collector' ? 'collector' : 'public')
  return url.toString()
}
const getProvider = (ctx: HttpContext): SocialProvider | null =>
  ctx.params.provider === 'facebook' || ctx.params.provider === 'google'
    ? ctx.params.provider
    : null

export default class FacebookAuthController {
  async redirect(ctx: HttpContext) {
    const { request, session, response } = ctx
    const provider = getProvider(ctx)
    if (!provider) return response.notFound()
    const secret = env.get('SOCIAL_AUTH_BRIDGE_SECRET')
    if (!secret || secret.length < 32)
      return response.redirect(
        failure(provider, 'unavailable', request.input('returnTo'), request.input('destination'))
      )
    const nonce = randomBytes(32).toString('hex')
    const destination = request.input('destination') === 'collector' ? 'collector' : 'public'
    const returnTo = safeFacebookReturn(
      request.input('returnTo') || (destination === 'collector' ? '/dashboard' : '/')
    )
    session.put('facebook_pending_nonce', nonce)
    session.put('social_destination', destination)
    session.put('facebook_return_to', returnTo)
    session.forget('facebook_link_user_id')
    await SocialAuthAttempt.create({
      nonceHash: createHash('sha256').update(nonce).digest('hex'),
      provider,
      destination,
      returnTo,
      expiresAt: DateTime.utc().plus({ minutes: 10 }),
    })
    const url = new URL('/social/start', publicUrl())
    url.searchParams.set('provider', provider)
    url.searchParams.set('attempt', nonce)
    url.searchParams.set('destination', destination)
    url.searchParams.set('returnTo', returnTo)
    return response.redirect(url.toString())
  }

  async callback(ctx: HttpContext) {
    const provider = getProvider(ctx)
    if (!provider) return ctx.response.notFound()
    return ctx.response.redirect(failure(provider, 'failed'))
  }

  async finish(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    response.header('Cache-Control', 'no-store')
    response.header('Referrer-Policy', 'no-referrer')
    const provider = getProvider(ctx)
    if (!provider) return response.notFound()
    const fail = (reason: string) =>
      failure(
        provider,
        reason,
        session.get('facebook_return_to'),
        session.get('social_destination')
      )
    const secret = env.get('SOCIAL_AUTH_BRIDGE_SECRET')
    const assertion = request.input('assertion')
    const nonce = session.get('facebook_pending_nonce')
    const payload = verifySocialAssertion(assertion, secret, nonce, provider)
    if (!payload || typeof nonce !== 'string') return response.redirect(fail('failed'))
    const nonceHash = createHash('sha256').update(nonce).digest('hex')
    const attempt = await db.transaction(async (trx) => {
      const found = await SocialAuthAttempt.query({ client: trx })
        .where('nonce_hash', nonceHash)
        .where('provider', provider)
        .where('expires_at', '>', new Date())
        .whereNull('consumed_at')
        .forUpdate()
        .first()
      if (!found) return null
      found.consumedAt = DateTime.utc()
      await found.save()
      return { destination: found.destination, returnTo: found.returnTo }
    })
    if (!attempt) return response.redirect(fail('failed'))
    session.put('social_destination', attempt.destination)
    const identity = await ExternalIdentity.query()
      .where('provider', provider)
      .where('provider_subject', payload.subject)
      .first()
    if (identity) {
      const user = await User.find(identity.userId)
      if (!user || user.blocked || user.status !== 'active' || !user.isVerified)
        return response.redirect(
          failure(provider, 'account_unavailable', attempt.returnTo, attempt.destination)
        )
      user.lastLoginAt = DateTime.now()
      user.version += 1
      await user.save()
      await auth.use('web').login(user)
      session.put('auth_password_fingerprint', sessionFingerprint(user.password))
      session.forget('facebook_pending_nonce')
      return response.redirect(
        new URL(
          attempt.returnTo,
          attempt.destination === 'collector' ? appUrl() : publicUrl()
        ).toString()
      )
    }
    await PendingExternalIdentity.query().where('expires_at', '<=', new Date()).delete()
    await PendingExternalIdentity.create({
      bindingHash: nonceHash,
      provider,
      providerSubject: payload.subject,
      email: typeof payload.email === 'string' ? payload.email : null,
      returnTo: attempt.returnTo,
      expiresAt: DateTime.utc().plus({ minutes: 20 }),
    })
    return response.redirect(`${publicUrl()}/login/social?provider=${provider}`)
  }

  async pending(ctx: HttpContext) {
    const { session, response } = ctx
    const provider = getProvider(ctx)
    if (!provider) return response.notFound()
    const pending = await pendingFacebook(session, provider)
    if (!pending)
      return response.status(410).json({ error: 'Social sign-in expired. Please start again.' })
    return response.json({
      email: pending.email,
      returnTo: pending.returnTo,
      destination: session.get('social_destination') === 'collector' ? 'collector' : 'public',
      signupStarted: Boolean(pending.signupData),
      mobile: pending.signupMobile,
    })
  }

  async signup(ctx: HttpContext) {
    const { request, response, session } = ctx
    const provider = getProvider(ctx)
    if (!provider) return response.notFound()
    const pending = await pendingFacebook(session, provider)
    if (!pending || pending.signupData)
      return response
        .status(410)
        .json({ error: 'Social sign-in expired or signup already started.' })
    const data = await request.validateUsing(signupValidator)
    ensureOtpDeliveryAvailable()
    const passwordHash = await hash.make(data.password)
    const binding = facebookBinding(session)
    if (!binding) return response.status(410).json({ error: 'Social sign-in expired.' })
    const challenge = await startSocialSignup(binding, provider, data.mobile, {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      governorate: data.governorate,
      passwordHash,
    })
    if (!challenge) return response.status(410).json({ error: 'Social sign-in expired.' })
    deliverMockOtp(
      data.mobile,
      provider === 'facebook' ? 'facebook_signup' : 'google_signup',
      challenge.code
    )
    return response
      .status(202)
      .json({ challenge: 'issued', expiresInSeconds: challenge.expiresInSeconds })
  }

  async verify(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    const provider = getProvider(ctx)
    if (!provider) return response.notFound()
    const { mobile, otp } = await request.validateUsing(verifyOtpValidator)
    const binding = facebookBinding(session)
    if (!binding) return response.status(410).json({ error: 'Social sign-in expired.' })
    try {
      const result = await verifySocialSignup(binding, provider, mobile, otp)
      if (result.kind === 'expired')
        return response.status(410).json({ error: 'Social sign-in expired. Please start again.' })
      if (result.kind === 'conflict')
        return response.status(409).json({ error: 'This social identity is already linked.' })
      if (result.kind === 'invalid')
        return response.status(401).json({ error: 'Invalid or expired verification code.' })
      const user = await User.findOrFail(result.id)
      await auth.use('web').login(user)
      session.put('auth_password_fingerprint', sessionFingerprint(user.password))
      session.forget('facebook_pending_nonce')
      return response.json({ verified: true })
    } catch (error) {
      if ((error as { code?: string }).code === '23505')
        return response
          .status(409)
          .json({ error: 'An account or social identity is already using these details.' })
      throw error
    }
  }

  async link(ctx: HttpContext) {
    const { auth, session, response } = ctx
    const provider = getProvider(ctx)
    if (!provider) return response.notFound()
    const user = await auth.use('web').authenticate()
    if (
      user.blocked ||
      user.status !== 'active' ||
      !user.isVerified ||
      session.get('auth_password_fingerprint') !== sessionFingerprint(user.password)
    ) {
      return response.status(403).json({ error: 'This account is not available.' })
    }
    if (session.get('facebook_link_user_id') !== user.id)
      return response.status(403).json({ error: 'Sign in with your password before linking.' })
    const binding = facebookBinding(session)
    if (!binding)
      return response.status(410).json({ error: 'Social sign-in expired. Please start again.' })
    try {
      const result = await linkSocialIdentity(binding, provider, user.id)
      if (result === null)
        return response.status(410).json({ error: 'Social sign-in expired. Please start again.' })
      session.forget('facebook_pending_nonce')
      session.forget('facebook_link_user_id')
      return response.json({ returnTo: result })
    } catch (error) {
      if ((error as { code?: string }).code === '23505')
        return response
          .status(409)
          .json({ error: 'This social identity or account is already linked.' })
      throw error
    }
  }
}
