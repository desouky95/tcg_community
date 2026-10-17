import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.post('/search', [() => import('#controllers/swaps_controller'), 'search'])
      router.get('/:userId', [() => import('#controllers/swaps_controller'), 'match'])
    })
    .prefix('swaps')
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
}
