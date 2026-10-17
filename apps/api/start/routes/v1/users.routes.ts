import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
export default () => {
  router
    .group(() => {
      router.get('/:id/reviews', [() => import('#controllers/reviews_controller'), 'index'])
      router
        .post('/:targetUserId/reviews', [() => import('#controllers/reviews_controller'), 'store'])
        .use(middleware.auth())
      router.get('/:id', [() => import('#controllers/profile_controller'), 'show'])
      router.get('', [() => import('#controllers/admin_controller'), 'listUsers'])
    })
    .prefix('users')

  router
    .group(() => {
      router.get('/:id', [() => import('#controllers/user_checklists_controller'), 'show'])
      router.post('/:id', [() => import('#controllers/user_checklists_controller'), 'update'])
      router.post('/:id/import', [
        () => import('#controllers/user_checklists_controller'),
        'import',
      ])
    })
    .prefix('user-checklists')
    .use(middleware.auth())

  router
    .group(() => {
      router.get('/profile', [() => import('#controllers/profile_controller'), 'show'])
      router.put('/profile', [() => import('#controllers/profile_controller'), 'update'])
      router.put('/preferences', [() => import('#controllers/identity_controller'), 'preferences'])
      router.post('/deactivate', [() => import('#controllers/identity_controller'), 'deactivate'])
      router.post('/privacy-exports', [
        () => import('#controllers/identity_controller'),
        'exportPersonalData',
      ])
      router.post('/privacy-deletions', [
        () => import('#controllers/identity_controller'),
        'deletePersonalData',
      ])
    })
    .prefix('account')
    .use(middleware.auth())
}
