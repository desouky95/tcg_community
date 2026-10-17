import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.post('request-otp', [() => import('#controllers/auth_controller'), 'requestOtp'])
      router.get('me', [() => import('#controllers/auth_controller'), 'me'])
      router.post('signup', [() => import('#controllers/auth_controller'), 'signup'])
      router.post('verify-otp', [() => import('#controllers/auth_controller'), 'verifyOtp'])
      router.post('login', [() => import('#controllers/auth_controller'), 'login'])
      //! otp-login not needed as login redirects to verify-otp
      router.post('otp-login', [() => import('#controllers/identity_controller'), 'otpLogin'])
      //? Not tested manually
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
