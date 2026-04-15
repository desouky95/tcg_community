/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('request-otp', [() => import('#controllers/auth_controller'), 'requestOtp'])
        router.post('signup', [() => import('#controllers/auth_controller'), 'signup'])
        router.post('verify-otp', [() => import('#controllers/auth_controller'), 'verifyOtp'])
        router.post('login', [() => import('#controllers/auth_controller'), 'login'])
        router
          .post('logout', [() => import('#controllers/auth_controller'), 'logout'])
          .use(middleware.auth())
      })
      .prefix('auth')

    router
      .group(() => {
        router.get('/', [() => import('#controllers/categories_controller'), 'index'])
        router.post('/', [() => import('#controllers/categories_controller'), 'store'])
        router.post('/:id/subcategories', [
          () => import('#controllers/categories_controller'),
          'addSubcategory',
        ])
        router.delete('/:id', [() => import('#controllers/categories_controller'), 'destroy'])
      })
      .prefix('categories')

    router
      .group(() => {
        router.get('/', [() => import('#controllers/checklists_controller'), 'index'])
        router.get('/:id', [() => import('#controllers/checklists_controller'), 'show'])
        router.post('/', [() => import('#controllers/checklists_controller'), 'store'])
        router.put('/:id', [() => import('#controllers/checklists_controller'), 'update'])
        router.delete('/:id', [() => import('#controllers/checklists_controller'), 'destroy'])
      })
      .prefix('checklists')

    router
      .group(() => {
        router.get('/:id/reviews', [() => import('#controllers/reviews_controller'), 'index'])
        router
          .post('/:targetUserId/reviews', [
            () => import('#controllers/reviews_controller'),
            'store',
          ])
          .use(middleware.auth())
        router.get('/:id', [() => import('#controllers/profile_controller'), 'show'])
        router.get('', [() => import('#controllers/admin_controller'), 'listUsers'])
      })
      .prefix('users')

    router
      .group(() => {
        router.post('/users/:id/block', [
          () => import('#controllers/admin_controller'),
          'blockUser',
        ])
      })
      .prefix('admin')
      .use(middleware.admin())

    router
      .group(() => {
        router.get('/:id', [() => import('#controllers/user_checklists_controller'), 'show'])
        router.post('/:id', [() => import('#controllers/user_checklists_controller'), 'update'])
        router.post('/:id/import', [
          () => import('#controllers/user_checklists_controller'),
          'importExcel',
        ])
      })
      .prefix('user-checklists')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
        router.put('/profile', [controllers.Profile, 'update'])
      })
      .prefix('account')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/search', [() => import('#controllers/swaps_controller'), 'search'])
        router.get('/:userId', [() => import('#controllers/swaps_controller'), 'match'])
      })
      .prefix('swaps')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [() => import('#controllers/conversations_controller'), 'index'])
        router.post('/find-or-create', [
          () => import('#controllers/conversations_controller'),
          'findOrCreate',
        ])
        router.get('/:id', [() => import('#controllers/conversations_controller'), 'show'])
        router.post('/:id/messages', [
          () => import('#controllers/conversations_controller'),
          'storeMessage',
        ])
      })
      .prefix('conversations')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/', [() => import('#controllers/swap_deals_controller'), 'store'])
        router.post('/:id/accept', [() => import('#controllers/swap_deals_controller'), 'accept'])
        router.post('/:id/postal', [
          () => import('#controllers/swap_deals_controller'),
          'updatePostal',
        ])
        router.post('/:id/received', [
          () => import('#controllers/swap_deals_controller'),
          'markReceived',
        ])
        router.post('/:id/scan-qr', [() => import('#controllers/swap_deals_controller'), 'scanQr'])
      })
      .prefix('swap-deals')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
