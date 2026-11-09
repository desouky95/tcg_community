import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID') || 'not-configured',
    clientSecret: env.get('GOOGLE_CLIENT_SECRET') || 'not-configured',
    callbackUrl: `${env.get('APP_URL').replace(/\/$/, '')}/api/v1/auth/oauth/google/callback`,
    scopes: ['openid', 'userinfo.email', 'userinfo.profile'],
  }),
  facebook: services.facebook({
    clientId: env.get('FACEBOOK_CLIENT_ID'),
    clientSecret: env.get('FACEBOOK_CLIENT_SECRET'),
    callbackUrl: `${env.get('APP_URL').replace(/\/$/, '')}/api/v1/auth/oauth/facebook/callback`,
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}