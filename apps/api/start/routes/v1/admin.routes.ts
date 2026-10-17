import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.post('/categories', [
        () => import('#controllers/catalogue_controller'),
        'createCategory',
      ])
      router.put('/categories/:id', [
        () => import('#controllers/catalogue_controller'),
        'updateCategory',
      ])
      router.delete('/categories/:id', [
        () => import('#controllers/catalogue_controller'),
        'archiveCategory',
      ])
      router.post('/categories/:id/subcategories', [
        () => import('#controllers/catalogue_controller'),
        'createSubcategory',
      ])
      router.post('/checklists', [() => import('#controllers/checklists_controller'), 'store'])
      router.put('/checklists/:id', [() => import('#controllers/checklists_controller'), 'update'])
      router.delete('/checklists/:id', [
        () => import('#controllers/catalogue_controller'),
        'archiveChecklist',
      ])
    })
    .use(middleware.admin())

  router
    .group(() => {
      router.post('/catalogue-imports/validate', [
        () => import('#controllers/catalogue_controller'),
        'validateImport',
      ])
      router.post('/catalogue-imports/:id/commit', [
        () => import('#controllers/catalogue_controller'),
        'commitImport',
      ])
      router.post('/catalogue-imports/:id/rollback', [
        () => import('#controllers/catalogue_controller'),
        'rollbackImport',
      ])
    })
    .prefix('admin')
    .use(middleware.admin())
  router
    .group(() => {
      router.post('/users/:id/block', [() => import('#controllers/admin_controller'), 'blockUser'])
    })
    .prefix('admin')
    .use(middleware.admin())
}
