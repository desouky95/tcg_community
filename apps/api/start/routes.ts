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
        router.post('otp-login', [() => import('#controllers/identity_controller'), 'otpLogin'])
        router.post('password-recovery', [() => import('#controllers/identity_controller'), 'recoverPassword'])
        router
          .post('logout', [() => import('#controllers/auth_controller'), 'logout'])
          .use(middleware.auth())
      })
      .prefix('auth')

    router
      .group(() => {
        router.get('/', [() => import('#controllers/catalogue_controller'), 'categories'])
        router.get('/:id', [() => import('#controllers/catalogue_controller'), 'category'])
      })
      .prefix('categories')

    router
      .group(() => {
        router.get('/', [() => import('#controllers/catalogue_controller'), 'checklists'])
        router.get('/:id', [() => import('#controllers/catalogue_controller'), 'checklist'])
      })
      .prefix('checklists')

    router
      .group(() => {
        router.get('/', [() => import('#controllers/catalogue_controller'), 'cards'])
        router.get('/:id', [() => import('#controllers/catalogue_controller'), 'card'])
      })
      .prefix('catalogue/cards')

    router
      .group(() => {
        router.post('/categories', [() => import('#controllers/catalogue_controller'), 'createCategory'])
        router.put('/categories/:id', [() => import('#controllers/catalogue_controller'), 'updateCategory'])
        router.delete('/categories/:id', [() => import('#controllers/catalogue_controller'), 'archiveCategory'])
        router.post('/categories/:id/subcategories', [() => import('#controllers/catalogue_controller'), 'createSubcategory'])
        router.post('/checklists', [() => import('#controllers/catalogue_controller'), 'createChecklist'])
        router.put('/checklists/:id', [() => import('#controllers/catalogue_controller'), 'updateChecklist'])
        router.delete('/checklists/:id', [() => import('#controllers/catalogue_controller'), 'archiveChecklist'])
      })
      .use(middleware.admin())

    router
      .group(() => {
        router.post('/catalogue-imports/validate', [() => import('#controllers/catalogue_controller'), 'validateImport'])
        router.post('/catalogue-imports/:id/commit', [() => import('#controllers/catalogue_controller'), 'commitImport'])
        router.post('/catalogue-imports/:id/rollback', [() => import('#controllers/catalogue_controller'), 'rollbackImport'])
      })
      .prefix('admin')
      .use(middleware.admin())

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
        router.put('/preferences', [() => import('#controllers/identity_controller'), 'preferences'])
        router.post('/deactivate', [() => import('#controllers/identity_controller'), 'deactivate'])
        router.post('/privacy-exports', [() => import('#controllers/identity_controller'), 'exportPersonalData'])
        router.post('/privacy-deletions', [() => import('#controllers/identity_controller'), 'deletePersonalData'])
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
