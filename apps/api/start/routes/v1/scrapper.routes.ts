import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default () => {
  return router
    .group(() => {
      router.get('/collections', [() => import('#controllers/scrappers_controller'), 'collections'])
      router.get('/done', [() => import('#controllers/scrappers_controller'), 'scrapped'])
      router.post('/jobs', [() => import('#controllers/scrappers_controller'), 'start'])
      router.get('/jobs/:jobId', [() => import('#controllers/scrappers_controller'), 'show'])
    })
    .prefix('/scrapper')
    .use(middleware.scraperTrigger())
}
