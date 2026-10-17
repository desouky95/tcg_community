import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.get('/', [() => import('#controllers/checklists_controller'), 'index'])
      router.get('/:id/cover', [() => import('#controllers/checklists_controller'), 'cover'])
      router.get('/:id', [() => import('#controllers/checklists_controller'), 'show'])
      router.get('/:id/download', [() => import('#controllers/checklists_controller'), 'download'])
      router.get('/:id/cards', [() => import('#controllers/cards_controller'), 'index'])
      router.post('/:id/import', [() => import('#controllers/checklists_controller'), 'import'])
    })
    .prefix('checklists')
    .middleware(middleware.auth())
  router
    .group(() => {
      // router.get('/:id', [() => import('#controllers/cards_controller'), 'index'])
      // router.get('/:id', [() => import('#controllers/catalogue_controller'), 'card'])
    })
    .prefix('cards')
}
