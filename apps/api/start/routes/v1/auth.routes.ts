import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.get('csrf', [() => import('#controllers/auth_controller'), 'csrf'])
      router
        .post('request-otp', [() => import('#controllers/auth_controller'), 'mobileVerificationDisabled'])
        .as('auth.request_otp')
      router.get('me', [() => import('#controllers/auth_controller'), 'me'])
      router
        .post('commerce/customer', [() => import('#controllers/commerce_controller'), 'customer'])
        .use(middleware.auth())
      router.post('signup', [() => import('#controllers/auth_controller'), 'signup'])
      router
        .post('verify-otp', [() => import('#controllers/auth_controller'), 'mobileVerificationDisabled'])
        .as('auth.verify_otp')
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
      router
        .post('oauth/:provider/signup', [
          () => import('#controllers/auth_controller'),
          'mobileVerificationDisabled',
        ])
        .as('auth.oauth_signup')
      router
        .post('oauth/:provider/verify', [
          () => import('#controllers/auth_controller'),
          'mobileVerificationDisabled',
        ])
        .as('auth.oauth_verify')
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
      router
        .post('otp-login', [() => import('#controllers/auth_controller'), 'mobileVerificationDisabled'])
        .as('auth.otp_login')
      //? Not tested manually
      router.post('deactivated-privacy-deletion', [
        () => import('#controllers/identity_controller'),
        'deleteDeactivatedAccount',
      ])
      router
        .post('password-recovery', [
          () => import('#controllers/auth_controller'),
          'mobileVerificationDisabled',
        ])
        .as('auth.password_recovery')
      router
        .post('logout', [() => import('#controllers/auth_controller'), 'logout'])
        .use(middleware.auth())
    })
    .prefix('auth')
}
