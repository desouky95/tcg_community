import router from '@adonisjs/core/services/router'
import adminRoutes from './admin.routes.ts'
import authRoutes from './auth.routes.ts'
import categoriesRoutes from './categories.routes.ts'
import checklistsRoutes from './checklists.routes.ts'
import conversationsRoutes from './conversations.routes.ts'
import scrapperRoutes from './scrapper.routes.ts'
import swapsRoutes from './swaps.routes.ts'
import usersRoutes from './users.routes.ts'
import commerceCatalogRoutes from './commerce-catalog.routes.ts'
import configRoutes from './config.routes.ts'

router
  .group(() => {
    adminRoutes()
    authRoutes()
    categoriesRoutes()
    checklistsRoutes()
    conversationsRoutes()
    scrapperRoutes()
    swapsRoutes()
    usersRoutes()
    commerceCatalogRoutes()
    configRoutes()
  })
  .prefix('/api/v1')
