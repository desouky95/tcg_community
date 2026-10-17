import router from '@adonisjs/core/services/router'

export default () => {
  router
    .group(() => {
      router.get('/', [() => import('#controllers/categories_controller'), 'index'])
      router.get('/:id', [() => import('#controllers/categories_controller'), 'show'])
    })
    .prefix('categories')
}
