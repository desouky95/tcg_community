import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
export default () => {
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
}
