import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.post('request-otp', [() => import('#controllers/auth_controller'), 'requestOtp'])
      router.get('me', [() => import('#controllers/auth_controller'), 'me'])
      router
        .post('commerce/customer', [() => import('#controllers/commerce_controller'), 'customer'])
        .use(middleware.auth())
      router.post('signup', [() => import('#controllers/auth_controller'), 'signup'])
      router.post('verify-otp', [() => import('#controllers/auth_controller'), 'verifyOtp'])
      router.post('login', [() => import('#controllers/auth_controller'), 'login'])
      router.get('oauth/:provider/redirect', [
        () => import('#controllers/facebook_auth_controller'),
        'redirect',
      ])
      router.get('oauth/:provider/finish', [
        () => import('#controllers/facebook_auth_controller'),
        'finish',
      ])
      router.get('oauth/:provider/callback', [
        () => import('#controllers/facebook_auth_controller'),
        'callback',
      ])
      router.post('oauth/:provider/signup', [
        () => import('#controllers/facebook_auth_controller'),
        'signup',
      ])
      router.post('oauth/:provider/verify', [
        () => import('#controllers/facebook_auth_controller'),
        'verify',
      ])
      router.get('oauth/:provider/pending', [
        () => import('#controllers/facebook_auth_controller'),
        'pending',
      ])
      router
        .post('oauth/:provider/link', [
          () => import('#controllers/facebook_auth_controller'),
          'link',
        ])
        .use(middleware.auth())
      //! otp-login not needed as login redirects to verify-otp
      router.post('otp-login', [() => import('#controllers/identity_controller'), 'otpLogin'])
      //? Not tested manually
      router.post('deactivated-privacy-deletion', [
        () => import('#controllers/identity_controller'),
        'deleteDeactivatedAccount',
      ])
      router.post('password-recovery', [
        () => import('#controllers/identity_controller'),
        'recoverPassword',
      ])
      router
        .post('logout', [() => import('#controllers/auth_controller'), 'logout'])
        .use(middleware.auth())
    })
    .prefix('auth')
}
