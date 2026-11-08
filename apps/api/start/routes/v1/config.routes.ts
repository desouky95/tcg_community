import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.get('', [() => import('#controllers/configs_controller'), 'config'])
    })
    .prefix('/config')
}
