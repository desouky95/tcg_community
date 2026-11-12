import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
export default () => {
  router
    .group(() => {
      router.get('/:userId/collections/:checklistId', [() => import('#controllers/collection_progress_controller'), 'publicView'])
      router.get('/:id/reviews', [() => import('#controllers/reviews_controller'), 'index'])
      router
        .post('/:targetUserId/reviews', [() => import('#controllers/reviews_controller'), 'store'])
        .use(middleware.auth())
      router.get('/:id', [() => import('#controllers/profile_controller'), 'show'])
      router.get('', [() => import('#controllers/admin_controller'), 'listUsers']).use([middleware.auth(), middleware.admin()])
    })
    .prefix('users')

  router
    .group(() => {
      router.post('/:id/start', [() => import('#controllers/collection_progress_controller'), 'start'])
      router.get('/:id/details', [() => import('#controllers/collection_progress_controller'), 'details'])
      router.patch('/:id/entries', [() => import('#controllers/collection_progress_controller'), 'batch'])
      router.put('/:id/visibility', [() => import('#controllers/collection_progress_controller'), 'visibility'])
      router.post('/:id/reset', [() => import('#controllers/collection_progress_controller'), 'reset'])
      router.post('/:id/import/preview', [() => import('#controllers/collection_progress_controller'), 'preview'])
      router.post('/:id/import/commit', [() => import('#controllers/collection_progress_controller'), 'commit'])
      router.get('/:id/export', [() => import('#controllers/collection_progress_controller'), 'export'])
      router.get('/:id', [() => import('#controllers/user_checklists_controller'), 'show'])
      router.post('/:id', [() => import('#controllers/user_checklists_controller'), 'update'])
      router.post('/:id/import', [() => import('#controllers/collection_progress_controller'), 'legacyImport'])
    })
    .prefix('user-checklists')
    .use(middleware.auth())

  router.get('/shared/collections/:token', [() => import('#controllers/collection_progress_controller'), 'sharedView'])

  router
    .group(() => {
      router.get('/collections', [() => import('#controllers/collection_progress_controller'), 'dashboard'])
      router.get('/commerce/orders', [() => import('#controllers/commerce_controller'), 'orders'])
      router.get('/commerce/orders/:id', [() => import('#controllers/commerce_controller'), 'order'])
      router.get('/commerce/addresses', [() => import('#controllers/commerce_controller'), 'addresses'])
      router.post('/commerce/addresses', [() => import('#controllers/commerce_controller'), 'createAddress'])
      router.put('/commerce/addresses/:id', [() => import('#controllers/commerce_controller'), 'updateAddress'])
      router.delete('/commerce/addresses/:id', [() => import('#controllers/commerce_controller'), 'deleteAddress'])
      router.get('/profile', [() => import('#controllers/profile_controller'), 'show'])
      router.put('/profile', [() => import('#controllers/profile_controller'), 'update'])
      router.get('/preferences', [() => import('#controllers/identity_controller'), 'getPreferences'])
      router.put('/preferences', [() => import('#controllers/identity_controller'), 'preferences'])
      router.post('/deactivate', [() => import('#controllers/identity_controller'), 'deactivate'])
      router.post('/privacy-exports', [
        () => import('#controllers/identity_controller'),
        'exportPersonalData',
      ])
      router.get('/privacy-exports', [() => import('#controllers/identity_controller'), 'listPersonalExports'])
      router.get('/privacy-exports/:id', [() => import('#controllers/identity_controller'), 'getPersonalExport'])
      router.get('/privacy-exports/:id/download', [() => import('#controllers/identity_controller'), 'downloadPersonalExport'])
      router.post('/privacy-deletions', [
        () => import('#controllers/identity_controller'),
        'deletePersonalData',
      ])
    })
    .prefix('account')
    .use(middleware.auth())
}
