import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.get('/collections', [
        () => import('#controllers/commerce_catalog_controller'),
        'collections',
      ])
      router.get('/collections/:id', [
        () => import('#controllers/commerce_catalog_controller'),
        'collection',
      ])
      router.get('/collections/:id/cards', [
        () => import('#controllers/commerce_catalog_controller'),
        'cards',
      ])
      router.post('/cards/batch', [
        () => import('#controllers/commerce_catalog_controller'),
        'batch',
      ])
    })
    .prefix('/internal/card-catalog')
    .middleware(middleware.cardCatalog())
}
