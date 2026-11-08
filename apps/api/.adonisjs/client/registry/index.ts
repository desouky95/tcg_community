/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [[0,"uploads"],[2,"*"]],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'catalogue.create_category': {
    methods: ["POST"],
    pattern: '/api/v1/categories',
    tokens: [[0,"api"],[0,"v1"],[0,"categories"]],
    types: placeholder as Registry['catalogue.create_category']['types'],
  },
  'catalogue.update_category': {
    methods: ["PUT"],
    pattern: '/api/v1/categories/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"categories"],[1,"id"]],
    types: placeholder as Registry['catalogue.update_category']['types'],
  },
  'catalogue.archive_category': {
    methods: ["DELETE"],
    pattern: '/api/v1/categories/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"categories"],[1,"id"]],
    types: placeholder as Registry['catalogue.archive_category']['types'],
  },
  'catalogue.create_subcategory': {
    methods: ["POST"],
    pattern: '/api/v1/categories/:id/subcategories',
    tokens: [[0,"api"],[0,"v1"],[0,"categories"],[1,"id"],[0,"subcategories"]],
    types: placeholder as Registry['catalogue.create_subcategory']['types'],
  },
  'checklists.store': {
    methods: ["POST"],
    pattern: '/api/v1/checklists',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"]],
    types: placeholder as Registry['checklists.store']['types'],
  },
  'checklists.update': {
    methods: ["PUT"],
    pattern: '/api/v1/checklists/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"]],
    types: placeholder as Registry['checklists.update']['types'],
  },
  'catalogue.archive_checklist': {
    methods: ["DELETE"],
    pattern: '/api/v1/checklists/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"]],
    types: placeholder as Registry['catalogue.archive_checklist']['types'],
  },
  'catalogue.validate_import': {
    methods: ["POST"],
    pattern: '/api/v1/admin/catalogue-imports/validate',
    tokens: [[0,"api"],[0,"v1"],[0,"admin"],[0,"catalogue-imports"],[0,"validate"]],
    types: placeholder as Registry['catalogue.validate_import']['types'],
  },
  'catalogue.commit_import': {
    methods: ["POST"],
    pattern: '/api/v1/admin/catalogue-imports/:id/commit',
    tokens: [[0,"api"],[0,"v1"],[0,"admin"],[0,"catalogue-imports"],[1,"id"],[0,"commit"]],
    types: placeholder as Registry['catalogue.commit_import']['types'],
  },
  'catalogue.rollback_import': {
    methods: ["POST"],
    pattern: '/api/v1/admin/catalogue-imports/:id/rollback',
    tokens: [[0,"api"],[0,"v1"],[0,"admin"],[0,"catalogue-imports"],[1,"id"],[0,"rollback"]],
    types: placeholder as Registry['catalogue.rollback_import']['types'],
  },
  'admin.block_user': {
    methods: ["POST"],
    pattern: '/api/v1/admin/users/:id/block',
    tokens: [[0,"api"],[0,"v1"],[0,"admin"],[0,"users"],[1,"id"],[0,"block"]],
    types: placeholder as Registry['admin.block_user']['types'],
  },
  'auth.request_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/request-otp',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"request-otp"]],
    types: placeholder as Registry['auth.request_otp']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/me',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"me"]],
    types: placeholder as Registry['auth.me']['types'],
  },
  'commerce.customer': {
    methods: ["POST"],
    pattern: '/api/v1/auth/commerce/customer',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"commerce"],[0,"customer"]],
    types: placeholder as Registry['commerce.customer']['types'],
  },
  'auth.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"signup"]],
    types: placeholder as Registry['auth.signup']['types'],
  },
  'auth.verify_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-otp',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"verify-otp"]],
    types: placeholder as Registry['auth.verify_otp']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"login"]],
    types: placeholder as Registry['auth.login']['types'],
  },
  'identity.otp_login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/otp-login',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"otp-login"]],
    types: placeholder as Registry['identity.otp_login']['types'],
  },
  'identity.delete_deactivated_account': {
    methods: ["POST"],
    pattern: '/api/v1/auth/deactivated-privacy-deletion',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"deactivated-privacy-deletion"]],
    types: placeholder as Registry['identity.delete_deactivated_account']['types'],
  },
  'identity.recover_password': {
    methods: ["POST"],
    pattern: '/api/v1/auth/password-recovery',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"password-recovery"]],
    types: placeholder as Registry['identity.recover_password']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [[0,"api"],[0,"v1"],[0,"auth"],[0,"logout"]],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories',
    tokens: [[0,"api"],[0,"v1"],[0,"categories"]],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"categories"],[1,"id"]],
    types: placeholder as Registry['categories.show']['types'],
  },
  'checklists.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"]],
    types: placeholder as Registry['checklists.index']['types'],
  },
  'checklists.cover': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists/:id/cover',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"],[0,"cover"]],
    types: placeholder as Registry['checklists.cover']['types'],
  },
  'checklists.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"]],
    types: placeholder as Registry['checklists.show']['types'],
  },
  'checklists.download': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists/:id/download',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"],[0,"download"]],
    types: placeholder as Registry['checklists.download']['types'],
  },
  'cards.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists/:id/cards',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"],[0,"cards"]],
    types: placeholder as Registry['cards.index']['types'],
  },
  'checklists.import': {
    methods: ["POST"],
    pattern: '/api/v1/checklists/:id/import',
    tokens: [[0,"api"],[0,"v1"],[0,"checklists"],[1,"id"],[0,"import"]],
    types: placeholder as Registry['checklists.import']['types'],
  },
  'cards.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/medusa/checklists/:id/card',
    tokens: [[0,"api"],[0,"v1"],[0,"medusa"],[0,"checklists"],[1,"id"],[0,"card"]],
    types: placeholder as Registry['cards.index']['types'],
  },
  'cards.batch': {
    methods: ["POST"],
    pattern: '/api/v1/cards/cards/batch',
    tokens: [[0,"api"],[0,"v1"],[0,"cards"],[0,"cards"],[0,"batch"]],
    types: placeholder as Registry['cards.batch']['types'],
  },
  'conversations.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/conversations',
    tokens: [[0,"api"],[0,"v1"],[0,"conversations"]],
    types: placeholder as Registry['conversations.index']['types'],
  },
  'conversations.find_or_create': {
    methods: ["POST"],
    pattern: '/api/v1/conversations/find-or-create',
    tokens: [[0,"api"],[0,"v1"],[0,"conversations"],[0,"find-or-create"]],
    types: placeholder as Registry['conversations.find_or_create']['types'],
  },
  'conversations.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/conversations/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"conversations"],[1,"id"]],
    types: placeholder as Registry['conversations.show']['types'],
  },
  'conversations.store_message': {
    methods: ["POST"],
    pattern: '/api/v1/conversations/:id/messages',
    tokens: [[0,"api"],[0,"v1"],[0,"conversations"],[1,"id"],[0,"messages"]],
    types: placeholder as Registry['conversations.store_message']['types'],
  },
  'scrappers.collections': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scrapper/collections',
    tokens: [[0,"api"],[0,"v1"],[0,"scrapper"],[0,"collections"]],
    types: placeholder as Registry['scrappers.collections']['types'],
  },
  'scrappers.scrapped': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scrapper/done',
    tokens: [[0,"api"],[0,"v1"],[0,"scrapper"],[0,"done"]],
    types: placeholder as Registry['scrappers.scrapped']['types'],
  },
  'scrappers.start': {
    methods: ["POST"],
    pattern: '/api/v1/scrapper/jobs',
    tokens: [[0,"api"],[0,"v1"],[0,"scrapper"],[0,"jobs"]],
    types: placeholder as Registry['scrappers.start']['types'],
  },
  'scrappers.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scrapper/jobs/:jobId',
    tokens: [[0,"api"],[0,"v1"],[0,"scrapper"],[0,"jobs"],[1,"jobId"]],
    types: placeholder as Registry['scrappers.show']['types'],
  },
  'swaps.search': {
    methods: ["POST"],
    pattern: '/api/v1/swaps/search',
    tokens: [[0,"api"],[0,"v1"],[0,"swaps"],[0,"search"]],
    types: placeholder as Registry['swaps.search']['types'],
  },
  'swaps.match': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/swaps/:userId',
    tokens: [[0,"api"],[0,"v1"],[0,"swaps"],[1,"userId"]],
    types: placeholder as Registry['swaps.match']['types'],
  },
  'swap_deals.store': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals',
    tokens: [[0,"api"],[0,"v1"],[0,"swap-deals"]],
    types: placeholder as Registry['swap_deals.store']['types'],
  },
  'swap_deals.accept': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/accept',
    tokens: [[0,"api"],[0,"v1"],[0,"swap-deals"],[1,"id"],[0,"accept"]],
    types: placeholder as Registry['swap_deals.accept']['types'],
  },
  'swap_deals.update_postal': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/postal',
    tokens: [[0,"api"],[0,"v1"],[0,"swap-deals"],[1,"id"],[0,"postal"]],
    types: placeholder as Registry['swap_deals.update_postal']['types'],
  },
  'swap_deals.mark_received': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/received',
    tokens: [[0,"api"],[0,"v1"],[0,"swap-deals"],[1,"id"],[0,"received"]],
    types: placeholder as Registry['swap_deals.mark_received']['types'],
  },
  'swap_deals.scan_qr': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/scan-qr',
    tokens: [[0,"api"],[0,"v1"],[0,"swap-deals"],[1,"id"],[0,"scan-qr"]],
    types: placeholder as Registry['swap_deals.scan_qr']['types'],
  },
  'collection_progress.public_view': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:userId/collections/:checklistId',
    tokens: [[0,"api"],[0,"v1"],[0,"users"],[1,"userId"],[0,"collections"],[1,"checklistId"]],
    types: placeholder as Registry['collection_progress.public_view']['types'],
  },
  'reviews.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id/reviews',
    tokens: [[0,"api"],[0,"v1"],[0,"users"],[1,"id"],[0,"reviews"]],
    types: placeholder as Registry['reviews.index']['types'],
  },
  'reviews.store': {
    methods: ["POST"],
    pattern: '/api/v1/users/:targetUserId/reviews',
    tokens: [[0,"api"],[0,"v1"],[0,"users"],[1,"targetUserId"],[0,"reviews"]],
    types: placeholder as Registry['reviews.store']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"users"],[1,"id"]],
    types: placeholder as Registry['profile.show']['types'],
  },
  'admin.list_users': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users',
    tokens: [[0,"api"],[0,"v1"],[0,"users"]],
    types: placeholder as Registry['admin.list_users']['types'],
  },
  'collection_progress.start': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id/start',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"start"]],
    types: placeholder as Registry['collection_progress.start']['types'],
  },
  'collection_progress.details': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user-checklists/:id/details',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"details"]],
    types: placeholder as Registry['collection_progress.details']['types'],
  },
  'collection_progress.batch': {
    methods: ["PATCH"],
    pattern: '/api/v1/user-checklists/:id/entries',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"entries"]],
    types: placeholder as Registry['collection_progress.batch']['types'],
  },
  'collection_progress.visibility': {
    methods: ["PUT"],
    pattern: '/api/v1/user-checklists/:id/visibility',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"visibility"]],
    types: placeholder as Registry['collection_progress.visibility']['types'],
  },
  'collection_progress.reset': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id/reset',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"reset"]],
    types: placeholder as Registry['collection_progress.reset']['types'],
  },
  'collection_progress.preview': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id/import/preview',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"import"],[0,"preview"]],
    types: placeholder as Registry['collection_progress.preview']['types'],
  },
  'collection_progress.commit': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id/import/commit',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"import"],[0,"commit"]],
    types: placeholder as Registry['collection_progress.commit']['types'],
  },
  'collection_progress.export': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user-checklists/:id/export',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"export"]],
    types: placeholder as Registry['collection_progress.export']['types'],
  },
  'user_checklists.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user-checklists/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"]],
    types: placeholder as Registry['user_checklists.show']['types'],
  },
  'user_checklists.update': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"]],
    types: placeholder as Registry['user_checklists.update']['types'],
  },
  'collection_progress.legacy_import': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id/import',
    tokens: [[0,"api"],[0,"v1"],[0,"user-checklists"],[1,"id"],[0,"import"]],
    types: placeholder as Registry['collection_progress.legacy_import']['types'],
  },
  'collection_progress.shared_view': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/shared/collections/:token',
    tokens: [[0,"api"],[0,"v1"],[0,"shared"],[0,"collections"],[1,"token"]],
    types: placeholder as Registry['collection_progress.shared_view']['types'],
  },
  'collection_progress.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/collections',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"collections"]],
    types: placeholder as Registry['collection_progress.dashboard']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.show']['types'],
  },
  'profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/account/profile',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"profile"]],
    types: placeholder as Registry['profile.update']['types'],
  },
  'identity.get_preferences': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/preferences',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"preferences"]],
    types: placeholder as Registry['identity.get_preferences']['types'],
  },
  'identity.preferences': {
    methods: ["PUT"],
    pattern: '/api/v1/account/preferences',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"preferences"]],
    types: placeholder as Registry['identity.preferences']['types'],
  },
  'identity.deactivate': {
    methods: ["POST"],
    pattern: '/api/v1/account/deactivate',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"deactivate"]],
    types: placeholder as Registry['identity.deactivate']['types'],
  },
  'identity.export_personal_data': {
    methods: ["POST"],
    pattern: '/api/v1/account/privacy-exports',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"privacy-exports"]],
    types: placeholder as Registry['identity.export_personal_data']['types'],
  },
  'identity.list_personal_exports': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/privacy-exports',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"privacy-exports"]],
    types: placeholder as Registry['identity.list_personal_exports']['types'],
  },
  'identity.get_personal_export': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/privacy-exports/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"privacy-exports"],[1,"id"]],
    types: placeholder as Registry['identity.get_personal_export']['types'],
  },
  'identity.download_personal_export': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/privacy-exports/:id/download',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"privacy-exports"],[1,"id"],[0,"download"]],
    types: placeholder as Registry['identity.download_personal_export']['types'],
  },
  'identity.delete_personal_data': {
    methods: ["POST"],
    pattern: '/api/v1/account/privacy-deletions',
    tokens: [[0,"api"],[0,"v1"],[0,"account"],[0,"privacy-deletions"]],
    types: placeholder as Registry['identity.delete_personal_data']['types'],
  },
  'commerce_catalog.collections': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/internal/card-catalog/collections',
    tokens: [[0,"api"],[0,"v1"],[0,"internal"],[0,"card-catalog"],[0,"collections"]],
    types: placeholder as Registry['commerce_catalog.collections']['types'],
  },
  'commerce_catalog.collection': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/internal/card-catalog/collections/:id',
    tokens: [[0,"api"],[0,"v1"],[0,"internal"],[0,"card-catalog"],[0,"collections"],[1,"id"]],
    types: placeholder as Registry['commerce_catalog.collection']['types'],
  },
  'commerce_catalog.cards': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/internal/card-catalog/collections/:id/cards',
    tokens: [[0,"api"],[0,"v1"],[0,"internal"],[0,"card-catalog"],[0,"collections"],[1,"id"],[0,"cards"]],
    types: placeholder as Registry['commerce_catalog.cards']['types'],
  },
  'commerce_catalog.batch': {
    methods: ["POST"],
    pattern: '/api/v1/internal/card-catalog/cards/batch',
    tokens: [[0,"api"],[0,"v1"],[0,"internal"],[0,"card-catalog"],[0,"cards"],[0,"batch"]],
    types: placeholder as Registry['commerce_catalog.batch']['types'],
  },
  'configs.config': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/config',
    tokens: [[0,"api"],[0,"v1"],[0,"config"]],
    types: placeholder as Registry['configs.config']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
